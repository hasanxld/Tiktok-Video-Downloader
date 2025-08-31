"use client"

import { ArrowLeft, Download, Trash2, Calendar, FileType, HardDrive, Clock, Info, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
}

interface DownloadsPageProps {
  onBack: () => void
  downloadHistory: DownloadHistoryItem[]
  onClearHistory: () => void
  onViewInfo?: (item: DownloadHistoryItem) => void
  onAgainDownload?: (item: DownloadHistoryItem) => void
  downloadingItems?: Set<string>
}

export function DownloadsPage({
  onBack,
  downloadHistory,
  onClearHistory,
  onViewInfo,
  onAgainDownload,
  downloadingItems = new Set(),
}: DownloadsPageProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTotalDownloads = () => downloadHistory.length

  const getFileTypeStats = () => {
    const stats: { [key: string]: number } = {}
    downloadHistory.forEach((item) => {
      stats[item.fileType] = (stats[item.fileType] || 0) + 1
    })
    return stats
  }

  const fileTypeStats = getFileTypeStats()

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile spacing for fixed header */}
      <div className="md:hidden h-16" />

      <main className="container mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2 hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </div>

        <div className="space-y-8">
          {/* Page Title */}
          <div className="text-center space-y-4">
            <h1 className="font-display font-bold text-4xl md:text-5xl text-primary text-balance animate-fade-in-up">
              Download History
            </h1>
            <p
              className="font-body text-lg text-muted-foreground max-w-2xl mx-auto text-pretty animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Track and manage all your downloaded TikTok videos
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in" style={{ animationDelay: "0.4s" }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <Download className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-card-foreground">{getTotalDownloads()}</p>
                    <p className="text-sm text-muted-foreground">Total Downloads</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent flex items-center justify-center">
                    <FileType className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-card-foreground">
                      {Object.keys(fileTypeStats).length}
                    </p>
                    <p className="text-sm text-muted-foreground">File Types</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary flex items-center justify-center">
                    <Clock className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-display font-bold text-card-foreground">
                      {downloadHistory.length > 0 ? "Recent" : "None"}
                    </p>
                    <p className="text-sm text-muted-foreground">Latest Activity</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Type Statistics */}
          {Object.keys(fileTypeStats).length > 0 && (
            <Card className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5" />
                  File Type Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(fileTypeStats).map(([type, count]) => (
                    <Badge key={type} variant="secondary" className="px-3 py-1">
                      {type}: {count}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Downloads List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold text-2xl text-card-foreground">Recent Downloads</h2>
              {downloadHistory.length > 0 && (
                <Button variant="destructive" size="sm" onClick={onClearHistory} className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Clear History
                </Button>
              )}
            </div>

            {downloadHistory.length === 0 ? (
              <Card className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Download className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-card-foreground mb-2">No Downloads Yet</h3>
                  <p className="text-muted-foreground mb-4">Start downloading TikTok videos to see your history here</p>
                  <Button onClick={onBack} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Start Downloading
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {downloadHistory.map((item, index) => (
                  <Card
                    key={item.id}
                    className="hover:shadow-lg transition-shadow animate-fade-in-up"
                    style={{ animationDelay: `${0.8 + index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt="Video thumbnail"
                            className="w-full md:w-24 h-32 md:h-24 object-cover bg-muted"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/video-thumbnail.png"
                            }}
                          />
                        </div>

                        <div className="flex-1 space-y-3">
                          <h3 className="font-display font-semibold text-lg text-card-foreground line-clamp-2">
                            {item.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(item.downloadedAt)}</span>
                            </div>
                            <Badge variant="outline">{item.fileType}</Badge>
                            <Badge variant="secondary">{item.quality}</Badge>
                            <span className="text-xs">{item.size}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewInfo?.(item)}
                            className="flex items-center gap-2"
                          >
                            <Info className="w-4 h-4" />
                            View Info
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onAgainDownload?.(item)}
                            disabled={downloadingItems.has(item.id)}
                            className="flex items-center gap-2"
                          >
                            {downloadingItems.has(item.id) ? (
                              <>
                                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-4 h-4" />
                                Again Download
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
