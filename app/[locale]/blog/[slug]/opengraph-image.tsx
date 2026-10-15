import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";
import { getAllPosts, readingMinutes } from "@/lib/blog";
import { content, isLocale, type Locale } from "@/lib/i18n";
import { topicLabel } from "@/lib/topics";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* alt/size/contentType stay plain strings/objects — function exports
   throw a DataCloneError on prerender (AGENTS.md gotcha 19). */
export const alt = "Taim Kellizy — blog post card";

/* Same static-TTF rule as the person card (gotcha 11/19): next/og cannot
   parse variable-font fvar tables and satori cannot read woff2. */
async function loadFont(file: string) {
  return readFile(join(process.cwd(), "public", "fonts", "static", file));
}

function formatDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en", {
    dateStyle: "long",
  }).format(new Date(date));
}

export default async function OpengraphImage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await props.params;
  const locale = (isLocale(raw) ? raw : "en") as Locale;
  const post = (await getAllPosts(locale)).find((p) => p.slug === slug);
  if (!post) return new Response("Not found", { status: 404 });

  const { person, ui } = content[locale];
  const rtl = locale === "ar";

  const [
    outfitMedium,
    outfitSemiBold,
    outfitExtraBold,
    thmanyahMedium,
    thmanyahBold,
  ] = await Promise.all([
    loadFont("Outfit-Medium.ttf"),
    loadFont("Outfit-SemiBold.ttf"),
    loadFont("Outfit-ExtraBold.ttf"),
    loadFont("thmanyahsans-Medium.ttf"),
    loadFont("thmanyahsans-Bold.ttf"),
  ]);

  const fonts = [
    { name: "Outfit", data: outfitMedium, weight: 500 as const, style: "normal" as const },
    { name: "Outfit", data: outfitSemiBold, weight: 600 as const, style: "normal" as const },
    { name: "Outfit", data: outfitExtraBold, weight: 800 as const, style: "normal" as const },
    { name: "Thmanyah", data: thmanyahMedium, weight: 500 as const, style: "normal" as const },
    { name: "Thmanyah", data: thmanyahBold, weight: 700 as const, style: "normal" as const },
  ];

  const textFace = rtl ? "Thmanyah" : "Outfit";
  /* Satori has no bidi: multi-word Arabic draws logical-order L-to-R, so
     render-only strings reverse WORD order (never characters — that
     severs the joins). Mirrors the person card's verified approach. */
  const rtlWords = (text: string) =>
    rtl ? text.split(" ").reverse().join(" ") : text;
  const align = rtl ? ("flex-end" as const) : ("flex-start" as const);

  const metaRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    flexDirection: rtl ? ("row-reverse" as const) : ("row" as const),
  };

  const topicLabels = post.topics
    .map((id) => topicLabel(id, locale))
    .join("  ·  ");
  const dateLine = formatDate(post.date, locale);
  const readLine = `${readingMinutes(post.body, locale)} ${ui.minRead}`;

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
          <span style={{ fontFamily: textFace }}>{rtlWords(person.name)}</span>
          <span style={{ fontFamily: textFace }}>{rtlWords(topicLabels)}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignSelf: align,
            maxWidth: 1056,
            fontFamily: textFace,
            fontSize: 62,
            fontWeight: rtl ? 700 : 600,
            letterSpacing: rtl ? 0 : "-0.025em",
            lineHeight: 1.14,
          }}
        >
          {rtlWords(post.title)}
        </div>

        <div
          style={{
            ...metaRow,
            borderTop: "1px solid rgba(232, 230, 225, 0.14)",
            paddingTop: 28,
            fontSize: 26,
            fontWeight: 500,
            color: "rgba(232, 230, 225, 0.58)",
          }}
        >
          <span style={{ fontFamily: textFace }}>{rtlWords(dateLine)}</span>
          <span style={{ fontFamily: textFace }}>{rtlWords(readLine)}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
