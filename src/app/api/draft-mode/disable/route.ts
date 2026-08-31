import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin)
    return new Response("Invalid origin.", { status: 403 });
  (await draftMode()).disable();
  return NextResponse.redirect(new URL("/", request.url), 303);
}

// Sanity Presentation also invokes this endpoint through GET.
export const GET = POST;
