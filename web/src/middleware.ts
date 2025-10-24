/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  return NextResponse.next();
  //const cookie = request.cookies.get("privy-token");
  //const privyToken = cookie?.value ?? "";
  //const searchParam = new URLSearchParams();

  //try {
  //  const verifiedClaim = await privyServer.verifyAuthToken(privyToken);
  //  if (
  //    verifiedClaim.userId.length > 1 &&
  //    new Date(verifiedClaim.expiration).getTime() < Date.now() // expiration date has not passed
  //  ) {
  //    // authenticated
  //    return NextResponse.next();
  //  }
  //  searchParam.set("error", "Unauthorized");
  //  return NextResponse.redirect(new URL(`/?${searchParam.toString()}`, request.url));
  //} catch (error) {
  //  searchParam.set("error", "Unable to verify cookie");
  //  return NextResponse.redirect(new URL(`/?${searchParam.toString()}`, request.url));
  //}
}

export const config = {
  matcher: "/about",
};
