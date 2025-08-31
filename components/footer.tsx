"use client"

import { Heart, Download, Shield, Zap, Github, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FooterProps {
  onNavigate?: (page: string) => void
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const features = [
    { icon: Download, text: "High Quality Downloads" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Shield, text: "Safe & Secure" },
  ]

  const links = [
    { label: "Home", action: () => onNavigate?.("home") },
    { label: "Help", action: () => onNavigate?.("help") },
    { label: "About", action: () => onNavigate?.("about") },
    { label: "Contact", action: () => onNavigate?.("contact") },
  ]

  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    {
      icon: () => (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.042-3.441.219-.937 1.404-5.965 1.404-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.888-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.357-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
        </svg>
      ),
      href: "https://tiktok.com/@hasan_x_fire",
      label: "TikTok",
    },
    { icon: Mail, href: "mailto:kinghasanbd1@gmail.com", label: "Email" },
  ]

  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse-glow">
                <span className="text-primary-foreground font-display font-bold text-lg">TK</span>
              </div>
              <h3 className="font-display font-bold text-xl text-card-foreground">TikTok Downloader</h3>
            </div>
            <p className="text-muted-foreground text-sm text-pretty">
              The most advanced and stylish TikTok video downloader. Download your favorite videos in high quality, fast
              and secure.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>by Hasan Islam</span>
            </div>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-card-foreground">Features</h4>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-3 text-sm text-muted-foreground hover:text-card-foreground transition-colors"
                >
                  <feature.icon className="w-4 h-4 text-primary" />
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-card-foreground">Quick Links</h4>
            <ul className="space-y-3">
              {links.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={link.action}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center space-x-2 group"
                  >
                    <span>{link.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-card-foreground">Connect</h4>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Follow us for updates and support</p>
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-10 h-10 p-0 hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                    onClick={() => window.open(social.href, "_blank")}
                  >
                    <social.icon className="w-4 h-4" />
                    <span className="sr-only">{social.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Animated Divider */}
        <div className="my-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-4">
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-primary animate-bounce"
                    style={{ animationDelay: `${index * 0.2}s`, animationDuration: "2s" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            <p>&copy; {currentYear} TikTok Video Downloader. All rights reserved.</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            <button
              onClick={() => onNavigate?.("privacy")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate?.("terms")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onNavigate?.("disclaimer")}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Disclaimer
            </button>
          </div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
          <div
            className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-accent/10 to-primary/10 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>
    </footer>
  )
}
