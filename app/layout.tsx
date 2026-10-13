import type { Metadata, Viewport } from "next";
import {
  workSans,
  array,
  arrayWide,
  chunkFive,
  nimbus,
  officeCode,
} from "./fonts";
import { person } from "@/lib/content";
import "./globals.css";

const SITE = "https://taimkellizy-portfolio.vercel.app";
const TITLE = "Taim Kellizy — Developer & CS Student";
const DESCRIPTION =
  "Portfolio of Taim Kellizy, a developer and computer science student. Selected work, credentials, and writing.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s — Taim Kellizy",
  },
  description: DESCRIPTION,
  authors: [{ name: person.name, url: SITE }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: person.name,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        workSans.variable,
        array.variable,
        arrayWide.variable,
        chunkFive.variable,
        nimbus.variable,
        officeCode.variable,
      ].join(" ")}
    >
      <body>{children}</body>
    </html>
  );
}
