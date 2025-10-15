import { PrivyClient } from "@privy-io/server-auth";

const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!;
const PRIVY_APP_SECRET = process.env.NEXT_PUBLIC_PRIVY_APP_SECRET!;

export const privyServer = new PrivyClient(PRIVY_APP_ID, PRIVY_APP_SECRET);
