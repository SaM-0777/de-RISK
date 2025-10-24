import { db } from "@/db";
import { premium, userPolicy } from "@/db/schema/policy";
import { authorization } from "@/lib/authorization";
import { and, count, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs'
export const maxDuration = 25


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ wallet_address: string; policy_slug: string }> }
) {
  try {
    const { wallet_address, policy_slug } = await params;

    const auth = await authorization();
    if (!auth?.userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        {
          status: 401,
        }
      );
    }

    const filterCondition = and(
      eq(sql`LOWER(${premium.ownerAddress})`, wallet_address.toLowerCase()),
      eq(premium.policyTemplateSlug, policy_slug),
    );

    const [totalCount] = await db
      .select({
        count: count(premium.id),
      })
      .from(premium)
      .where(filterCondition);

    const premiumCount = totalCount.count ?? 0;

    const userPolicies = await db
      .select()
      .from(userPolicy)
      .where(
        and(
          eq(sql`LOWER(${userPolicy.ownerAddress})`, wallet_address.toLowerCase()),
          eq(userPolicy.policyTemplateSlug, policy_slug)
        )
      )
      .limit(1);

    const premiums = await db
      .select()
      .from(premium)
      .where(filterCondition);

    const response = {
      data: {
        userPolicies,
        premiums,
      },
      totalCount: premiumCount,
    };

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error(`src.app.api.policy.premium.error ${error}`);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}
