import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://erikoldre.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Erik Oldre — Materials Scientist",
  description:
    "Erik Oldre — NSF Graduate Research Fellow and Ph.D. researcher in Materials Science & Engineering at Cornell. A cinematic journey through neurons, molecules, and self-assembled quantum materials.",
  keywords: [
    "Erik Oldre",
    "Cornell",
    "Materials Science",
    "neuroscience",
    "NrCAM",
    "Ankyrin B",
    "block copolymer",
    "Wiesner Group",
  ],
  authors: [{ name: "Erik Oldre" }],
  openGraph: {
    title: "Erik Oldre — Materials Scientist",
    description:
      "A cinematic journey through neurons, molecules, and self-assembled quantum materials.",
    url: siteUrl,
    siteName: "Erik Oldre",
    images: [{ url: "/erik.jpg", width: 800, height: 800, alt: "Erik Oldre" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erik Oldre — Materials Scientist",
    description:
      "A cinematic journey through neurons, molecules, and self-assembled quantum materials.",
    images: ["/erik.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#04040A] text-white">{children}</body>
    </html>
  );
}
