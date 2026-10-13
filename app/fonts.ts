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
