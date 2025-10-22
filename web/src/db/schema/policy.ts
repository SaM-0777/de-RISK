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
  // for admin use
  id: varchar("id").primaryKey().$defaultFn(nanoid),
  slug: varchar("slug").unique().notNull(),
  name: varchar("name").notNull(),
  txHash: varchar("tx_hash").notNull(),
  description: varchar("description").notNull().default(""),
  imageUrl: varchar("image_url").notNull(),
  contractAddress: varchar("contract_address").notNull().unique(),
  policyId: varchar("policy_id").notNull().unique(),
  premiumAmount: numeric("premium_amount").notNull(),
  payoutAmount: numeric("payout_amount").notNull(),
  oracleAddress: varchar("oracle_address").notNull(),
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
  // keep track of users policy
  id: varchar("id").primaryKey().$defaultFn(nanoid),
  policyTemplateSlug: varchar("policy_template_slug")
    .references(() => policyTemplate.slug)
    .notNull(),
  ownerAddress: varchar("owner_address").notNull(),
  tokenId: numeric("token_id").notNull().default("0"),
  tokenURI: varchar("token_uri").notNull().default(""),
  expiry: timestamp("expiry"),
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

export const premium = pgTable("premium", {
  // keep track of users policy premiums
  id: varchar("id").primaryKey().$defaultFn(nanoid),
  policyTemplateSlug: varchar("policy_template_slug")
    .references(() => policyTemplate.slug)
    .notNull(),
  userPolicyId: varchar("user_policy_id")
    .references(() => userPolicy.id)
    .notNull(),
  ownerAddress: varchar("owner_address").notNull(),
  txHash: varchar("tx_hash").notNull(),
  premiumPaid: numeric("premium_paid").notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
