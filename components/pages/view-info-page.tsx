"use client"

import { ArrowLeft, Download, Clock, Calendar, FileType, HardDrive, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { formatDuration } from "@/lib/utils"

interface DownloadHistoryItem {
  id: string
  title: string
  thumbnail: string
  downloadedAt: Date
  fileType: string
  quality: string
  size: string
  url?: string
  originalMedia?: any
  duration?: number
}

interface ViewInfoPageProps {
  onBack: () => void
  item: DownloadHistoryItem
  onDownload?: (media: any) => void
  isDownloading?: boolean
}

export function ViewInfoPage({ onBack, item, onDownload, isDownloading = false }: ViewInfoPageProps) {
  const [showFullscreenThumbnail, setShowFullscreenThumbnail] = useState(false)

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  // Mock media options based on the original download
  const mockMediaOptions = [
    {
      extension: item.fileType.toLowerCase(),
      quality: item.quality,
      formattedSize: item.size,
      videoAvailable: item.fileType !== "MP3",
      audioAvailable: true,
      url: item.url || "#",
    },
  ]

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Mobile spacing for fixed header */}
        <div className="md:hidden h-16" />

        <main className="container mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2 hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back to Downloads
            </Button>
          </div>

          <div className="space-y-8">
            {/* Page Title */}
            <div className="text-center space-y-4">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-primary text-balance animate-fade-in-up">
                Video Information
              </h1>
              <p
                className="font-body text-lg text-muted-foreground max-w-2xl mx-auto text-pretty animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                Complete details and download options for your video
              </p>
            </div>

            {/* Video Info Card */}
            <Card className="w-full max-w-4xl mx-auto animate-scale-in" style={{ animationDelay: "0.4s" }}>
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Video Preview */}
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0 relative">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt="Video thumbnail"
                        className="w-full lg:w-80 h-64 lg:h-80 object-cover bg-muted"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/video-thumbnail.png"
                        }}
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute top-4 right-4 w-10 h-10 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
                        onClick={() => setShowFullscreenThumbnail(true)}
                      >
                        <Maximize2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="font-display font-bold text-2xl text-card-foreground mb-4 line-clamp-3">
                          {item.title}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>Downloaded: {formatDate(item.downloadedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileType className="w-4 h-4" />
                            <span>File Type: {item.fileType}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <HardDrive className="w-4 h-4" />
                            <span>File Size: {item.size}</span>
                          </div>
                          {item.duration && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>Duration: {formatDuration(item.duration)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="default">{item.quality} Quality</Badge>
                        <Badge variant="secondary">{item.fileType}</Badge>
                        <Badge variant="outline">TikTok Video</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Download Options */}
                  <div className="space-y-6">
                    <div className="border-t border-border pt-6">
                      <h3 className="font-display font-semibold text-xl text-card-foreground mb-4">
                        Available Download Options
                      </h3>

                      <div className="grid gap-4">
                        {mockMediaOptions.map((media, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-muted border border-border"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-primary flex items-center justify-center">
                                <span className="text-primary-foreground text-sm font-bold">
                                  {media.extension.toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-base text-card-foreground">
                                  {media.quality} {media.videoAvailable ? "Video" : "Audio"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Size: {media.formattedSize} • Format: {media.extension.toUpperCase()}
                                </p>
                              </div>
                            </div>

                            <Button
                              onClick={() => onDownload?.(media)}
                              disabled={isDownloading}
                              className="flex items-center gap-2 px-6"
                              size="lg"
                            >
                              {isDownloading ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <Download className="w-4 h-4" />
                                  Download Now
                                </>
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Fullscreen Thumbnail Popup */}
      {showFullscreenThumbnail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <img
              src={item.thumbnail || "/placeholder.svg"}
              alt="Full size thumbnail"
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/video-thumbnail.png"
              }}
            />
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-4 right-4 w-12 h-12 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={() => setShowFullscreenThumbnail(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
