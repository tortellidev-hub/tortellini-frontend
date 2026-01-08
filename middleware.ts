// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/auth",            // login page
  "/_next",           // next internals
  "/icon.jpg", "/og.jpg", "/favicon.ico",
  "/api",             // se hai api pubbliche (altrimenti rimuovi)
  "/public",          // statiche
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // consenti tutte le public
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  // tutto il resto richiede auth
  const authed = req.cookies.get("tortellini_auth")?.value === "1";
  if (!authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.jpg|og.jpg).*)",
  ],
};
