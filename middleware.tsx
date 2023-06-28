import { NextRequest, NextResponse } from "next/server";

export const middleware = (request: NextRequest): NextResponse => {
  const requestHeaders = new Headers(request.headers);

  // Store current request pathname in a custom header
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};
