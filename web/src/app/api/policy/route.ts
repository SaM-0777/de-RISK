/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { authorization } from "@/lib/authorization";
import { getPolicies } from "@/lib/onchain/policies";

export async function GET(request: NextRequest) {
  try {
    const auth = await authorization();
    if (!auth?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }

    const policies = await getPolicies();
    return NextResponse.json(policies, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
