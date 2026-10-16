import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* The Arabic teh — first letter of the wordmark, from Thmanyah Serif
   Display Black. Baked as a path (identical to app/icon.svg) so no font
   file is parsed at render time — see gotcha 11 in AGENTS.md. */
const GLYPH =
  "M49.72 20.22H48.52L44.32 30.17C46.54 31.79 49.72 34.61 51.7 37.25C47.02 38.15 36.29 39.53 27.35 39.53C15.9 39.53 11.82 37.25 11.82 28.91C11.82 27.53 12 25.67 12.18 23.87H10.98C9.66 28.49 9 32.39 9 36.23C9 47.44 15 50.86 25.07 50.86C33.29 50.86 43.6 48.58 48.82 47.5L52.48 37.67C53.32 35.45 53.74 33.23 53.62 30.95L55 27.71ZM38.87 19.08C38.93 19.02 38.93 18.24 38.87 18.18L33.83 13.14L29.33 17.64L24.83 13.14L19.74 18.24V19.02L24.83 24.11L29.33 19.62L33.83 24.11Z";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0c0c0e",
        }}
      >
        <svg viewBox="0 0 64 64" width={180} height={180}>
          <path fill="#e8e6e1" d={GLYPH} />
        </svg>
      </div>
    ),
    { ...size },
  );
}
