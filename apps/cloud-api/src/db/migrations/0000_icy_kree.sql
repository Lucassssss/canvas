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
	"device_id" text,
	"account_id" text,
	"fingerprint" jsonb,
	"status" text DEFAULT 'idle',
	"last_opened_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "devices" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text DEFAULT 'custom',
	"type" text DEFAULT 'direct' NOT NULL,
	"host" text,
	"port" text,
	"username" text,
	"password" text,
	"ip" text,
	"ip_loc" text,
	"timezone" text,
	"country" text,
	"city" text,
	"lat" text,
	"lon" text,
	"expire_at" timestamp,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "browser_environments" ADD CONSTRAINT "browser_environments_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_environments" ADD CONSTRAINT "browser_environments_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE set null ON UPDATE no action;