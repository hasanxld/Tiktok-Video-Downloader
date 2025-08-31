import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Poppins, Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "TikTok Video Downloader - Download TikTok Videos Without Watermark Free",
  description:
    "Free TikTok video downloader tool. Download TikTok videos without watermark in HD quality. Fast, secure, and easy to use. No registration required. Support MP4 and MP3 formats.",
  keywords:
    "tiktok downloader, download tiktok video, tiktok video download, remove watermark, tiktok to mp4, tiktok to mp3, free tiktok downloader, tiktok saver",
  authors: [{ name: "TikTok Downloader Team" }],
  creator: "TikTok Downloader",
  publisher: "TikTok Downloader",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tiktok-downloader.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "TikTok Video Downloader - Download TikTok Videos Without Watermark",
    description:
      "Free TikTok video downloader tool. Download TikTok videos without watermark in HD quality. Fast, secure, and easy to use.",
    url: "https://tiktok-downloader.vercel.app",
    siteName: "TikTok Video Downloader",
    images: [
      {
        url: "/tiktok-downloader-og.png",
        width: 1200,
        height: 630,
        alt: "TikTok Video Downloader - Free Online Tool",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Video Downloader - Download Videos Without Watermark",
    description: "Free TikTok video downloader tool. Download TikTok videos without watermark in HD quality.",
    images: ["/tiktok-downloader-og.png"],
    creator: "@tiktokdownloader",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TikTok Downloader" />
        <meta name="application-name" content="TikTok Downloader" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body
        className={`font-sans ${dmSans.variable} ${poppins.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
