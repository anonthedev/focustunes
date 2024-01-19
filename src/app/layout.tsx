import './globals.css'
import type { Metadata } from 'next'
import { Poppins, Raleway } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Focus Tunes',
  description: 'Immerse yourself in productivity with Focus Tunes. Elevate focus and concentration with a handpicked collection of ambient sounds, meditation music, and white noise. Enhance your study sessions, work efficiency, and relaxation. Explore the perfect sonic companions for success. Transform your environment, boost productivity – experience the power of focused sounds at Focus Tunes.',
  keywords: [
    "Focus sounds",
    "Concentration music",
    "Productivity sounds",
    "Study ambiance",
    "Ambient sounds for focus",
    "Calming background noise",
    "White noise for concentration",
    "Relaxing study sounds",
    "Nature sounds for focus",
    "Mindfulness audio",
    "Meditation sounds",
    "Stress relief sounds",
    "Soothing study music",
    "Study aid sounds",
    "Background sounds for work",
    "Office ambiance",
    "Noise-canceling sounds",
    "Brainwave music",
    "Deep focus audio",
    "Ambient instrumental music"
  ]
}

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${poppins.variable}`}>{children}</body>
    </html>
  )
}
