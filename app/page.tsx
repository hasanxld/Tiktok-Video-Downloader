"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SideMenu } from "@/components/side-menu"
import { ProfileModal } from "@/components/profile-modal"
import { LoadingBar } from "@/components/loading-bar"
import { UrlInput } from "@/components/url-input"
import { VideoPreview } from "@/components/video-preview"
import { DownloadLoading } from "@/components/download-loading"
import { Notification, type NotificationType } from "@/components/notification"
import { HelpPage } from "@/components/pages/help-page"
import { AboutPage } from "@/components/pages/about-page"
import { ContactPage } from "@/components/pages/contact-page"
import { PrivacyPolicyPage } from "@/components/pages/privacy-policy-page"
import { TermsPage } from "@/components/pages/terms-page"
import { DisclaimerPage } from "@/components/pages/disclaimer-page"
import { DownloadsPage } from "@/components/pages/downloads-page"
import { ViewInfoPage } from "@/components/pages/view-info-page"
import { Plus, Download, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { downloadTikTokVideo, type TikTokVideoData, type TikTokMedia } from "@/lib/tiktok-api"
import { isValidTikTokUrl } from "@/lib/utils"

interface NotificationState {
  isVisible: boolean
  type: NotificationType
  title: string
  message: string
}

interface DownloadHistoryItem {
  id: string
  title: string
  thumbnail: string
  downloadedAt: Date
  fileType: string
  quality: string
  size: string
  url?: string
  originalMedia?: TikTokMedia
}

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState("home")
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<DownloadHistoryItem | null>(null)

  // Download system state
  const [url, setUrl] = useState("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [videoData, setVideoData] = useState<TikTokVideoData | null>(null)
  const [downloadingMedia, setDownloadingMedia] = useState<TikTokMedia | null>(null)
  const [downloadingItems, setDownloadingItems] = useState<Set<string>>(new Set())
  const [notification, setNotification] = useState<NotificationState>({
    isVisible: false,
    type: "success",
    title: "",
    message: "",
  })

  const [downloadHistory, setDownloadHistory] = useState<DownloadHistoryItem[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const savedHistory = localStorage.getItem("tiktok-download-history")
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setDownloadHistory(
          parsed.map((item: any) => ({
            ...item,
            downloadedAt: new Date(item.downloadedAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load download history:", error)
      }
    }
  }, [])

  const showNotification = (type: NotificationType, title: string, message: string) => {
    setNotification({
      isVisible: true,
      type,
      title,
      message,
    })
  }

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }))
  }

  const handleNavigation = (page: string) => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage(page)
      setIsLoading(false)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }, 800)
  }

  const handleDownloadRequest = async () => {
    if (!url.trim()) {
      showNotification("warning", "URL Required", "Please enter a TikTok video URL")
      return
    }

    if (!isValidTikTokUrl(url)) {
      showNotification("error", "Invalid URL", "Please enter a valid TikTok video URL")
      return
    }

    setIsDownloading(true)
    setVideoData(null)

    try {
      const data = await downloadTikTokVideo(url)
      setVideoData(data)
      showNotification("success", "Video Found!", "Your video is ready for download")
    } catch (error) {
      console.error("Download error:", error)
      showNotification(
        "error",
        "Download Failed",
        error instanceof Error ? error.message : "Failed to fetch video. Please try again.",
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const handleMediaDownload = async (media: TikTokMedia) => {
    try {
      setDownloadingMedia(media)
      showNotification("info", "Download Starting", "Your download is beginning...")

      // Fetch the file
      const response = await fetch(media.url)
      if (!response.ok) {
        throw new Error("Failed to fetch file")
      }

      const blob = await response.blob()

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = `tiktok-video-${Date.now()}.${media.extension}`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up
      window.URL.revokeObjectURL(downloadUrl)

      // Add to download history
      if (videoData) {
        const historyItem: DownloadHistoryItem = {
          id: Date.now().toString(),
          title: videoData.title,
          thumbnail: videoData.thumbnail || "/video-thumbnail.png",
          downloadedAt: new Date(),
          fileType: media.extension.toUpperCase(),
          quality: media.quality,
          size: media.formattedSize || "Unknown size",
          url: media.url,
          originalMedia: media,
        }

        const newHistory = [historyItem, ...downloadHistory].slice(0, 50)
        setDownloadHistory(newHistory)
        localStorage.setItem("tiktok-download-history", JSON.stringify(newHistory))
      }

      showNotification(
        "success",
        "Download Complete",
        `Your ${media.extension.toUpperCase()} file has been downloaded successfully`,
      )
    } catch (error) {
      console.error("Download failed:", error)
      showNotification("error", "Download Failed", "Failed to download the file. Please try again.")
    } finally {
      setDownloadingMedia(null)
    }
  }

  const handleViewInfo = (item: DownloadHistoryItem) => {
    setSelectedHistoryItem(item)
    handleNavigation("view-info")
  }

  const handleAgainDownload = async (item: DownloadHistoryItem) => {
    if (!item.originalMedia) return

    setDownloadingItems((prev) => new Set(prev).add(item.id))

    try {
      await handleMediaDownload(item.originalMedia)
    } finally {
      setDownloadingItems((prev) => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "help":
        return (
          <>
            <HelpPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "about":
        return (
          <>
            <AboutPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "contact":
        return (
          <>
            <ContactPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "privacy":
        return (
          <>
            <PrivacyPolicyPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "terms":
        return (
          <>
            <TermsPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "disclaimer":
        return (
          <>
            <DisclaimerPage onBack={() => handleNavigation("home")} />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "downloads":
        return (
          <>
            <DownloadsPage
              onBack={() => handleNavigation("home")}
              downloadHistory={downloadHistory}
              onClearHistory={() => {
                setDownloadHistory([])
                localStorage.removeItem("tiktok-download-history")
                showNotification("success", "History Cleared", "Download history has been cleared")
              }}
              onViewInfo={handleViewInfo}
              onAgainDownload={handleAgainDownload}
              downloadingItems={downloadingItems}
            />
            <Footer onNavigate={handleNavigation} />
          </>
        )
      case "view-info":
        return (
          <>
            {selectedHistoryItem && (
              <ViewInfoPage
                onBack={() => handleNavigation("downloads")}
                item={selectedHistoryItem}
                onDownload={handleMediaDownload}
                isDownloading={downloadingMedia !== null}
              />
            )}
            <Footer onNavigate={handleNavigation} />
          </>
        )
      default:
        return (
          <>
            {/* Mobile spacing for fixed header */}
            <div className="md:hidden h-16" />

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-8">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="font-display font-bold text-4xl md:text-6xl text-primary text-balance animate-fade-in-up">
                    Advanced TikTok Video Downloader
                  </h1>
                  <p
                    className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty animate-fade-in-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    Download your favorite TikTok videos in high quality with our stylish and advanced downloader tool
                  </p>
                </div>

                {/* Download Section */}
                <div
                  className="max-w-2xl mx-auto bg-card p-6 md:p-8 border border-border animate-scale-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="space-y-6">
                    <h2 className="font-display font-semibold text-xl md:text-2xl text-card-foreground">
                      Paste TikTok URL Below
                    </h2>

                    <div className="space-y-4">
                      <UrlInput
                        value={url}
                        onChange={setUrl}
                        onSubmit={handleDownloadRequest}
                        isLoading={isDownloading}
                      />

                      <Button
                        onClick={handleDownloadRequest}
                        disabled={!url.trim() || !isValidTikTokUrl(url) || isDownloading}
                        className="w-full h-14 text-base font-display font-semibold flex items-center justify-center gap-2 hover-lift"
                        size="lg"
                      >
                        {isDownloading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Download className="w-5 h-5" />
                            Download Video
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Loading State */}
                    {isDownloading && <DownloadLoading />}

                    {/* Video Preview */}
                    {videoData && !isDownloading && (
                      <VideoPreview
                        videoData={videoData}
                        onDownload={handleMediaDownload}
                        isDownloading={downloadingMedia !== null}
                        downloadingMedia={downloadingMedia}
                      />
                    )}
                  </div>
                </div>

                {/* Features Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                  {[
                    {
                      icon: Download,
                      title: "High Quality",
                      desc: "Download videos in original quality with multiple format options",
                    },
                    {
                      icon: "⚡",
                      title: "Fast & Reliable",
                      desc: "Quick processing with multiple API endpoints for maximum uptime",
                    },
                    {
                      icon: "🔒",
                      title: "Safe & Secure",
                      desc: "No registration required. Your privacy is our priority",
                    },
                  ].map((feature, index) => (
                    <div
                      key={index}
                      className="text-center space-y-3 hover-lift animate-fade-in-up"
                      style={{ animationDelay: `${0.6 + index * 0.1}s` }}
                    >
                      <div className="w-12 h-12 bg-primary mx-auto flex items-center justify-center">
                        {typeof feature.icon === "string" ? (
                          <span className="text-primary-foreground font-bold text-lg">{feature.icon}</span>
                        ) : (
                          <feature.icon className="w-6 h-6 text-primary-foreground" />
                        )}
                      </div>
                      <h3 className="font-display font-semibold text-lg text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm text-pretty">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </main>

            <Footer onNavigate={handleNavigation} />
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LoadingBar isLoading={isLoading} />

      <Header
        onMenuClick={() => setIsMenuOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        onNavigate={handleNavigation}
      />

      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigation} />

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />

      {renderCurrentPage()}

      <Button
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg z-30 transition-all duration-300 ${
          showScrollTop ? "animate-bounce-in" : "animate-pulse-glow"
        }`}
        onClick={scrollToTop}
      >
        {showScrollTop ? <ArrowUp className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </Button>
    </div>
  )
}
