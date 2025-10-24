import { cookies } from "next/headers";
import { privyServer } from "@/app/privy";

export async function authorization() {
  try {
    const cookieStore = await cookies();
    const privyToken = cookieStore.get("privy-token")?.value ?? "";

    const verifiedClaim = await privyServer.verifyAuthToken(privyToken);
    if (
      verifiedClaim.userId.length &&
      new Date(verifiedClaim.expiration).getTime() < Date.now()
    ) {
      return verifiedClaim;
    }
    return null;
  } catch (error) {
    console.log(`src.lib.authorization.error ${error}`)
    throw error;
  }
}
