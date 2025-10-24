ALTER TABLE "policy_template" ALTER COLUMN "premium_amount" TYPE numeric USING payout_amount::numeric;--> statement-breakpoint
ALTER TABLE "policy_template" ALTER COLUMN "payout_amount" TYPE numeric USING payout_amount::numeric;--> statement-breakpoint
ALTER TABLE "policy_template" ADD COLUMN "tx_hash" varchar NOT NULL;