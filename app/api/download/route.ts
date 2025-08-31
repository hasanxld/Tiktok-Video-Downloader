import { type NextRequest, NextResponse } from "next/server"
import { getCurrentApiKey, rotateApiKey, getApiKeyName } from "@/lib/api-keys"
import { isValidTikTokUrl } from "@/lib/utils"

export interface TikTokMedia {
  url: string
  quality: string
  extension: string
  size: number
  formattedSize: string
  videoAvailable: boolean
  audioAvailable: boolean
  chunked: boolean
  cached: boolean
}

export interface TikTokVideoData {
  url: string
  title: string
  thumbnail: string
  duration: string
  source: string
  medias: TikTokMedia[]
  sid: string | null
}

interface ApiResponse {
  success: boolean
  data?: TikTokVideoData
  error?: string
  keyUsed?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json()
    const { url } = body

    // Validate input
    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 })
    }

    if (!isValidTikTokUrl(url)) {
      return NextResponse.json({ success: false, error: "Invalid TikTok URL format" }, { status: 400 })
    }

    const apiUrl = "https://snap-video3.p.rapidapi.com/download"
    let attempts = 0
    const maxAttempts = 4

    while (attempts < maxAttempts) {
      try {
        const apiKey = getCurrentApiKey()
        const keyName = getApiKeyName()

        console.log(`[API] Attempt ${attempts + 1} using key: ${keyName}`)

        const options = {
          method: "POST",
          headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "snap-video3.p.rapidapi.com",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ url }),
        }

        const response = await fetch(apiUrl, options)

        if (response.ok) {
          const result = await response.json()

          // Validate response structure
          if (!result.url || !result.title || !Array.isArray(result.medias)) {
            throw new Error("Invalid response format from API")
          }

          console.log(`[API] Success with key: ${keyName}`)

          return NextResponse.json({
            success: true,
            data: result,
            keyUsed: keyName,
          })
        } else if (response.status === 429) {
          console.log(`[API] Rate limit hit with key: ${keyName}, rotating...`)
          rotateApiKey()
          attempts++

          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 1000))
          continue
        } else if (response.status === 403) {
          console.log(`[API] Forbidden with key: ${keyName}, rotating...`)
          rotateApiKey()
          attempts++
          continue
        } else {
          const errorText = await response.text()
          throw new Error(`API request failed with status: ${response.status} - ${errorText}`)
        }
      } catch (error) {
        console.error(`[API] Error with key ${getApiKeyName()}:`, error)
        rotateApiKey()
        attempts++

        if (attempts >= maxAttempts) {
          return NextResponse.json(
            {
              success: false,
              error: "All API keys failed. Please try again later.",
            },
            { status: 503 },
          )
        }

        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to download video after all attempts",
      },
      { status: 503 },
    )
  } catch (error) {
    console.error("[API] Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
