import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { person } from "@/lib/content";

export const alt = `${person.name} — ${person.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Static Outfit instances: the bundled opentype parser in next/og cannot
   read variable-font fvar tables (both Outfit-Variable and WorkSans-Variable
   fail with a parseFvarAxis TypeError), so the card is built from TTF
   statics in public/fonts/static/. */
async function loadFont(file: string, weight: 500 | 600 | 800) {
  const data = await readFile(
    join(process.cwd(), "public", "fonts", "static", file),
  );
  return { name: "Outfit", data, weight, style: "normal" as const };
}

export default async function OpengraphImage() {
  const fonts = await Promise.all([
    loadFont("Outfit-Medium.ttf", 500),
    loadFont("Outfit-SemiBold.ttf", 600),
    loadFont("Outfit-ExtraBold.ttf", 800),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0c0c0e",
          color: "#e8e6e1",
          fontFamily: "Outfit",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: "rgba(232, 230, 225, 0.58)",
            textTransform: "uppercase",
          }}
        >
          <span>{person.name}</span>
          <span>Portfolio</span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 330,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
          }}
        >
          taim
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            borderTop: "1px solid rgba(232, 230, 225, 0.14)",
            paddingTop: 28,
            fontSize: 30,
            fontWeight: 500,
          }}
        >
          <span>{person.role}</span>
          <span style={{ color: "rgba(232, 230, 225, 0.58)", fontSize: 26 }}>
            {person.location}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
