CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"platform" text,
	"username" text,
	"password" text,
	"cookie" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "browser_environments" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"group" text DEFAULT 'default',
	"platform" text DEFAULT 'none',
	"remark" text,
	"tags" jsonb DEFAULT '[]',
	"proxy_id" text,
	"account_id" text,
	"fingerprint" jsonb,
	"status" text DEFAULT 'idle',
	"last_opened_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proxies" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text DEFAULT 'direct' NOT NULL,
	"host" text,
	"port" text,
	"username" text,
	"password" text,
	"ip" text,
	"ip_loc" text,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "browser_environments" ADD CONSTRAINT "browser_environments_proxy_id_proxies_id_fk" FOREIGN KEY ("proxy_id") REFERENCES "public"."proxies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_environments" ADD CONSTRAINT "browser_environments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;