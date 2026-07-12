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
    "Erik Oldre — NSF Graduate Research Fellow and Ph.D. student in Materials Science & Engineering at Cornell. Research in block copolymer self-assembly, synaptic cell adhesion, and quantum materials.",
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
      "Research in block copolymer self-assembly, synaptic cell adhesion, and quantum materials.",
    url: siteUrl,
    siteName: "Erik Oldre",
    images: [{ url: "/erik.jpg", width: 800, height: 800, alt: "Erik Oldre" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Erik Oldre — Materials Scientist",
    description:
      "Research in block copolymer self-assembly, synaptic cell adhesion, and quantum materials.",
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
      <body className="min-h-full bg-[#060A0F] text-white">{children}</body>
    </html>
  );
}
