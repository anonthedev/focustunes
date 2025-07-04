import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "MyTunes - Ambient Sound Mixer",
  description: "Create your perfect ambient soundscape with MyTunes. Mix nature sounds, music, and white noise for focus, relaxation, and productivity. Customize your audio environment with our intuitive sound mixer.",
  keywords: [
    "ambient sounds",
    "sound mixer",
    "focus music",
    "white noise",
    "productivity sounds",
    "relaxation audio",
    "nature sounds",
    "background noise",
    "concentration",
    "meditation sounds"
  ],
  authors: [{ name: "MyTunes" }],
  creator: "MyTunes",
  publisher: "MyTunes",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    title: "MyTunes - Create Your Perfect Ambient Soundscape",
    description: "Mix and customize ambient sounds for focus, relaxation, and productivity. Create your perfect audio environment with MyTunes sound mixer.",
    siteName: "MyTunes",
    images: [
      {
        url: "/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "MyTunes Sound Mixer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyTunes - Ambient Sound Mixer",
    description: "Create your perfect ambient soundscape with MyTunes sound mixer. Mix nature sounds, music, and white noise for focus and relaxation.",
    images: ["/placeholder-logo.png"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#09090B" }
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/placeholder-logo.png",
    apple: "/placeholder-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="dark" attribute="class" forcedTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  );
}
