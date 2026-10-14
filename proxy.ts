import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

/* Locale routing: every page path is prefixed (/en, /ar). Paths without
   a locale prefix redirect to the default locale's twin. Files (any path
   with a dot), /_next and asset routes pass through untouched. */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = locales.some((locale) => {
    const prefix = `/${locale}`;
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
  if (hasLocale) return NextResponse.next();

  const rest = pathname === "/" ? "" : pathname;
  return NextResponse.redirect(
    new URL(`/${defaultLocale}${rest}`, request.nextUrl.origin),
    308,
  );
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|apple-icon|.*\\..*).*)"],
};
