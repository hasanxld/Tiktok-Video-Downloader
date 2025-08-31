"use client"

import { Download, Clock, Eye, Maximize2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import type { TikTokVideoData, TikTokMedia } from "@/lib/tiktok-api"
import { formatDuration } from "@/lib/utils"

interface VideoPreviewProps {
  videoData: TikTokVideoData
  onDownload: (media: TikTokMedia) => void
  isDownloading?: boolean
  downloadingMedia?: TikTokMedia | null
}

export function VideoPreview({ videoData, onDownload, isDownloading = false, downloadingMedia }: VideoPreviewProps) {
  const [showFullscreenThumbnail, setShowFullscreenThumbnail] = useState(false)

  const videoMedias = videoData.medias.filter((media) => media.videoAvailable)
  const audioMedias = videoData.medias.filter((media) => media.audioAvailable && !media.videoAvailable)

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Video Info */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0 relative">
                <img
                  src={videoData.thumbnail || "/placeholder.svg"}
                  alt="Video thumbnail"
                  className="w-full md:w-32 h-48 md:h-32 object-cover bg-muted"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/video-thumbnail.png"
                  }}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 w-8 h-8 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
                  onClick={() => setShowFullscreenThumbnail(true)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="font-display font-semibold text-lg text-card-foreground line-clamp-2">
                  {videoData.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(videoData.duration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>TikTok Video</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Options */}
            <div className="space-y-4">
              <h4 className="font-display font-semibold text-base text-card-foreground">Download Options</h4>

              {/* Video Downloads */}
              {videoMedias.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-muted-foreground">Video Files</h5>
                  <div className="grid gap-2">
                    {videoMedias.map((media, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary flex items-center justify-center">
                            <span className="text-primary-foreground text-xs font-bold">
                              {media.extension.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-card-foreground">{media.quality} Quality</p>
                            <p className="text-xs text-muted-foreground">{media.formattedSize || "Size unknown"}</p>
                          </div>
                        </div>

                        <Button
                          onClick={() => onDownload(media)}
                          disabled={isDownloading}
                          className="flex items-center gap-2"
                        >
                          {isDownloading && downloadingMedia === media ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audio Downloads */}
              {audioMedias.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm text-muted-foreground">Audio Files</h5>
                  <div className="grid gap-2">
                    {audioMedias.map((media, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted border border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent flex items-center justify-center">
                            <span className="text-accent-foreground text-xs font-bold">
                              {media.extension.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-card-foreground">{media.quality} Audio</p>
                            <p className="text-xs text-muted-foreground">{media.formattedSize || "Size unknown"}</p>
                          </div>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() => onDownload(media)}
                          disabled={isDownloading}
                          className="flex items-center gap-2"
                        >
                          {isDownloading && downloadingMedia === media ? (
                            <>
                              <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin" />
                              Downloading...
                            </>
                          ) : (
                            <>
                              <Download className="w-4 h-4" />
                              Download
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showFullscreenThumbnail && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={videoData.thumbnail || "/placeholder.svg"}
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
              className="absolute top-4 right-4 w-10 h-10 p-0 bg-black/50 hover:bg-black/70 text-white border-0"
              onClick={() => setShowFullscreenThumbnail(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
