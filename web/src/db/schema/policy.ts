import { nanoid } from "@/utils/nanoid";
import {
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const policyTemplate = pgTable("policy_template", {
  id: varchar("id").primaryKey().$defaultFn(nanoid),
  slug: varchar("slug").unique().notNull(),
  name: varchar("name").notNull(),
  txHash: varchar("tx_hash").notNull(),
  description: varchar("description").notNull().default(""),
  contractAddress: varchar("contract_address").notNull().unique(),
  policyId: varchar("policy_id").notNull().unique(),
  premiumAmount: numeric("premium_amount").notNull(),
  payoutAmount: numeric("payout_amount").notNull(),
  oracleAddress: varchar("oracle_address").notNull().unique(),
  coverageTerms: varchar("coverage_terms").array().notNull().default([]),
  formSchema: jsonb("form_schema").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userPolicyStatusEnum = pgEnum("user_policy_status", [
  "verified",
  "pending",
]);
export const userPolicyClaimStatusEnum = pgEnum("user_policy_claim_status", [
  "claimed",
  "active",
]);

export const userPolicy = pgTable("user_policy", {
  id: varchar("id").primaryKey().$defaultFn(nanoid),
  policyTemplateSlug: varchar("policy_template_slug")
    .references(() => policyTemplate.slug)
    .notNull(),
  ownerAddress: varchar("owner_address").notNull(),
  txHash: varchar("tx_hash").notNull(),
  premiumPaid: numeric("premium_paid").notNull(),
  status: userPolicyStatusEnum().notNull().default("pending"),
  claimStatus: userPolicyClaimStatusEnum().notNull().default("active"),
  inputs: jsonb("inputs")
    .$type<
      | { network: string; assetPairAddress: string }
      | { flightNumber: string; date: string }
    >()
    .notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
