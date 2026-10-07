import localFont from "next/font/local";

export const workSans = localFont({
  src: "./fonts/WorkSans-Variable.ttf",
  weight: "100 900",
  display: "swap",
  variable: "--font-work-sans",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
});

export const array = localFont({
  src: [
    { path: "./fonts/Array-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/Array-Semibold.otf", weight: "600", style: "normal" },
    { path: "./fonts/Array-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-array",
  fallback: ["Impact", "Haettenschweiler", "sans-serif"],
});

export const arrayWide = localFont({
  src: [
    { path: "./fonts/ArrayWide-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/ArrayWide-Semibold.otf", weight: "600", style: "normal" },
    { path: "./fonts/ArrayWide-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-array-wide",
  fallback: ["Impact", "Haettenschweiler", "sans-serif"],
});

export const chunkFive = localFont({
  src: "./fonts/ChunkFive-Regular.ttf",
  weight: "400",
  display: "swap",
  variable: "--font-chunk",
  fallback: ["Rockwell", "Georgia", "serif"],
});

export const nimbus = localFont({
  src: [
    { path: "./fonts/NimbusSans-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/NimbusSans-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-nimbus",
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
