CREATE TYPE "public"."user_policy_claim_status" AS ENUM('claimed', 'active');--> statement-breakpoint
CREATE TYPE "public"."user_policy_status" AS ENUM('verified', 'pending');--> statement-breakpoint
CREATE TABLE "user_policy" (
	"id" varchar PRIMARY KEY NOT NULL,
	"policy_template_slug" varchar NOT NULL,
	"owner_address" varchar NOT NULL,
	"tx_hash" varchar NOT NULL,
	"premium_paid" numeric NOT NULL,
	"status" "user_policy_status" DEFAULT 'pending' NOT NULL,
	"claimStatus" "user_policy_claim_status" DEFAULT 'active' NOT NULL,
	"inputs" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_policy" ADD CONSTRAINT "user_policy_policy_template_slug_policy_template_slug_fk" FOREIGN KEY ("policy_template_slug") REFERENCES "public"."policy_template"("slug") ON DELETE no action ON UPDATE no action;