CREATE TABLE "policy_template" (
	"id" varchar PRIMARY KEY NOT NULL,
	"slug" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar DEFAULT '' NOT NULL,
	"contract_address" varchar NOT NULL,
	"policy_id" varchar NOT NULL,
	"premium_amount" varchar NOT NULL,
	"payout_amount" varchar NOT NULL,
	"oracle_address" varchar NOT NULL,
	"coverage_terms" varchar[] DEFAULT '{}' NOT NULL,
	"form_schema" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "policy_template_slug_unique" UNIQUE("slug"),
	CONSTRAINT "policy_template_contract_address_unique" UNIQUE("contract_address"),
	CONSTRAINT "policy_template_policy_id_unique" UNIQUE("policy_id"),
	CONSTRAINT "policy_template_oracle_address_unique" UNIQUE("oracle_address")
);
