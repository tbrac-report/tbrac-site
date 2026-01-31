import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const response = NextResponse.next()

  // Check if user already has a language preference cookie
  const existingLanguagePref = request.cookies.get("tbrac-language-pref")

  // If no preference is set, detect based on geolocation
  if (!existingLanguagePref) {
    // Vercel provides the country code in the x-vercel-ip-country header
    const country = request.headers.get("x-vercel-ip-country")

    // If the user is visiting from Mainland China, set Chinese as default
    if (country === "CN") {
      response.cookies.set("tbrac-geo-language", "zh", {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    } else {
      response.cookies.set("tbrac-geo-language", "en", {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
}
