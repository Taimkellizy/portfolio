import type { Metadata, Viewport } from "next";
import {
  workSans,
  array,
  arrayWide,
  chunkFive,
  nimbus,
  officeCode,
} from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://taimkellizy.dev"),
  title: {
    default: "Taim Kellizy — Developer & CS Student",
    template: "%s — Taim Kellizy",
  },
  description:
    "Portfolio of Taim Kellizy, a developer and computer science student. Selected work, credentials, and writing.",
  openGraph: {
    type: "website",
    title: "Taim Kellizy — Developer & CS Student",
    description:
      "Portfolio of Taim Kellizy, a developer and computer science student.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
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
