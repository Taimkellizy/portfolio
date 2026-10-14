import localFont from "next/font/local";

export const workSans = localFont({
  src: "./fonts/WorkSans-Variable.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-work-sans",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const officeCode = localFont({
  src: [
    { path: "./fonts/OfficeCodePro-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/OfficeCodePro-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/OfficeCodePro-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-code",
  fallback: ["Consolas", "Menlo", "monospace"],
});

/* Arabic face (Sans). Latin glyphs are not in the font — everything
   falls through to Work Sans via the RTL font stack in CSS. Files are
   the official woff2s from the Thmanyah typeface release. */
export const thmanyahSans = localFont({
  src: [
    { path: "./fonts/thmanyahsans-Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/thmanyahsans-Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/thmanyahsans-Black.woff2", weight: "900", style: "normal" },
  ],
  display: "swap",
  variable: "--font-thmanyah",
  fallback: ["Work Sans", "Helvetica Neue", "Arial", "sans-serif"],
});

/* Arabic display cut — the wordmark face only (hero giant + footer
   word, RTL builds). Single Black instance: `.ea-giant` requests 800
   and font matching rounds up to 900. */
export const thmanyahSerifDisplay = localFont({
  src: [
    {
      path: "./fonts/thmanyahserifdisplay-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-thmanyah-display",
  fallback: ["Work Sans", "Helvetica Neue", "Arial", "sans-serif"],
});
