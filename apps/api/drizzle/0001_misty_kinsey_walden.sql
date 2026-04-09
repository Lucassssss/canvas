ALTER TABLE "orders" ADD COLUMN "poll_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "last_polled_at" timestamp;