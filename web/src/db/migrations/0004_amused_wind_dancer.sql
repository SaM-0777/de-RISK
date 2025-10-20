CREATE TABLE "premium" (
	"id" varchar PRIMARY KEY NOT NULL,
	"policy_template_slug" varchar NOT NULL,
	"user_policy_id" varchar NOT NULL,
	"owner_address" varchar NOT NULL,
	"tx_hash" varchar NOT NULL,
	"premium_paid" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_policy" ADD COLUMN "token_id" numeric DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "user_policy" ADD COLUMN "expiry" timestamp;--> statement-breakpoint
ALTER TABLE "premium" ADD CONSTRAINT "premium_policy_template_slug_policy_template_slug_fk" FOREIGN KEY ("policy_template_slug") REFERENCES "public"."policy_template"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "premium" ADD CONSTRAINT "premium_user_policy_id_user_policy_id_fk" FOREIGN KEY ("user_policy_id") REFERENCES "public"."user_policy"("id") ON DELETE no action ON UPDATE no action;