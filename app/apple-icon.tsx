import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* Static Outfit ExtraBold — see the note in app/opengraph-image.tsx (the
   bundled opentype parser cannot read variable-font fvar tables). */
export default async function AppleIcon() {
  const font = await readFile(
    join(process.cwd(), "public", "fonts", "static", "Outfit-ExtraBold.ttf"),
  );

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
          color: "#e8e6e1",
          fontFamily: "Outfit",
          fontSize: 140,
          fontWeight: 800,
          lineHeight: 1,
          paddingBottom: 18,
        }}
      >
        t
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Outfit", data: font, weight: 800, style: "normal" }],
    },
  );
}
