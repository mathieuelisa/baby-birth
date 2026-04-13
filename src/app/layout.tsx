import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/index.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mini Nous – Liste de naissance & pronostics bébé",
  description:
    "Mini Nous est une application dédiée a notre liste de naissance et aux pronostics de bébé.",

  keywords: [
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

  openGraph: {
    title: "Mini Nous – Liste de naissance & pronostics bébé",
    description:
      "Liste de naissance et pronostics sur futur bébé : date, prénom, poids… Une expérience fun et collaborative.",
    url: "https://baby-birth-neon.vercel.app/home",
    siteName: "Mini Nous",
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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
