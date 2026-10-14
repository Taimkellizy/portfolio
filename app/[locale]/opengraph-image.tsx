import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { content, isLocale } from "@/lib/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Static font instances: the bundled opentype parser in next/og cannot
   read variable-font fvar tables (Outfit-Variable / WorkSans-Variable
   fail with a parseFvarAxis TypeError), and satori cannot read woff2.
   So every card face is a plain TTF in public/fonts/static/ — Outfit
   statics for Latin, Thmanyah statics (decompressed from the woff2
   sources in app/fonts) for Arabic. Latin faces load on the Arabic
   card too: the "Portfolio" label and "@"-style strings stay Latin. */
async function loadFont(file: string) {
  return readFile(join(process.cwd(), "public", "fonts", "static", file));
}

async function cardMeta({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  return { locale, person: content[locale].person };
}

/* alt/size/contentType must be plain strings/objects — Next clones
   image-route metadata exports at build time (functions throw a
   DataCloneError on prerender), so the alt stays locale-neutral. */
export const alt = "Taim Kellizy — portfolio card";

export default async function OpengraphImage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale, person } = await cardMeta(props);
  const rtl = locale === "ar";

  const [outfitMedium, outfitSemiBold, outfitExtraBold, thmanyahMedium, thmanyahBold, thmanyahDisplayBlack] =
    await Promise.all([
      loadFont("Outfit-Medium.ttf"),
      loadFont("Outfit-SemiBold.ttf"),
      loadFont("Outfit-ExtraBold.ttf"),
      loadFont("thmanyahsans-Medium.ttf"),
      loadFont("thmanyahsans-Bold.ttf"),
      loadFont("thmanyahserifdisplay-Black.ttf"),
    ]);

  const fonts = [
    { name: "Outfit", data: outfitMedium, weight: 500 as const, style: "normal" as const },
    { name: "Outfit", data: outfitSemiBold, weight: 600 as const, style: "normal" as const },
    { name: "Outfit", data: outfitExtraBold, weight: 800 as const, style: "normal" as const },
    { name: "Thmanyah", data: thmanyahMedium, weight: 500 as const, style: "normal" as const },
    { name: "Thmanyah", data: thmanyahBold, weight: 700 as const, style: "normal" as const },
    { name: "ThmanyahDisplay", data: thmanyahDisplayBlack, weight: 900 as const, style: "normal" as const },
  ];

  /* Mirror whole for RTL (reading edge flips): header/footer rows
     reverse, the giant word sits at the far end. Arabic spans never
     get letterSpacing/textTransform — tracking severs the joins and
     there are no capitals. Latin strings keep Outfit per-element. */
  const textFace = rtl ? "Thmanyah" : "Outfit";
  /* Satori has no real bidi: it draws multi-word Arabic in logical order
     left-to-right (verified by A/B render of the same string pre/post
     word-reversal). Fix for render-only strings: reverse the word order
     (NOT the characters — that severs the joins and reshapes gibberish
     forms). Characters keep logical order; screen readers/copy never
     see this string, it exists only inside the PNG. */
  const rtlWords = (text: string) =>
    rtl ? text.split(" ").reverse().join(" ") : text;
  const drawName = rtlWords(person.name);
  const drawRole = rtlWords(person.role);
  const giantFace = rtl ? "ThmanyahDisplay" : "Outfit";
  const giant = rtl ? "تيم" : "taim";
  /* Thmanyah Display's descender reaches far deeper than Outfit's at
     equal size — step the Arabic word down or its tail crosses the rule. */
  const giantSize = rtl ? 280 : 330;
  /* Satori sizes joined-Arabic boxes wider than the glyphs it draws
     (isolated advances vs shaped joins) — under alignSelf flex-end the
     ink falls ~251px short of the right padding edge. Empirical offset,
     tuned once by ink-profile measurement of the rendered PNG for
     "تيم" in Thmanyah Display Black at 280px; re-tune if the face,
     weight, size or word ever changes. */
  const giantNudge = rtl ? 251 : 0;
  const align = rtl ? ("flex-end" as const) : ("flex-start" as const);

  const metaRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexDirection: rtl ? ("row-reverse" as const) : ("row" as const),
  };

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
        }}
      >
        <div
          style={{
            ...metaRow,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: rtl ? 0 : "0.14em",
            color: "rgba(232, 230, 225, 0.58)",
            textTransform: rtl ? "none" : "uppercase",
          }}
        >
          <span style={{ fontFamily: textFace }}>{drawName}</span>
          <span style={{ fontFamily: "Outfit" }}>Portfolio</span>
        </div>

        <div
          style={{
            display: "flex",
            alignSelf: align,
            fontFamily: giantFace,
            fontSize: giantSize,
            fontWeight: rtl ? 900 : 800,
            letterSpacing: rtl ? 0 : "-0.05em",
            lineHeight: 1,
            transform: `translateX(${giantNudge}px)`,
          }}
        >
          {giant}
        </div>

        <div
          style={{
            ...metaRow,
            borderTop: "1px solid rgba(232, 230, 225, 0.14)",
            paddingTop: 28,
            fontSize: 30,
            fontWeight: 500,
          }}
        >
          <span style={{ fontFamily: textFace }}>{drawRole}</span>
          <span
            style={{
              fontFamily: textFace,
              color: "rgba(232, 230, 225, 0.58)",
              fontSize: 26,
            }}
          >
            {person.location}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
