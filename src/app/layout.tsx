import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://baby-birth-neon.vercel.app"),
  applicationName: "Mini Nous",
  title: {
    default: "Mini Nous - Liste de naissance & pronostics bébé",
    template: "%s | Mini Nous",
  },
  description:
    "Mini Nous est une application dédiée à notre liste de naissance et aux pronostics de bébé.",
  keywords: [
    "Mini Nous",
    "liste de naissance",
    "pronostics bébé",
    "date naissance bébé",
    "jeu naissance bébé",
    "liste naissance en ligne",
    "baby shower jeu",
    "deviner naissance bébé",
    "application naissance",
    "organisation naissance",
  ],
  authors: [{ name: "Mini Nous" }],
  creator: "Mini Nous",
  publisher: "Mini Nous",
  category: "family",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Mini Nous - Liste de naissance & pronostics bébé",
    description:
      "Liste de naissance et pronostics sur futur bébé : date, prénom, poids… Une expérience fun et collaborative.",
    url: "/",
    siteName: "Mini Nous",
    images: [
      {
        url: "/assets/images/wallpaper2.jpg",
        alt: "Mini Nous",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='fr' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
