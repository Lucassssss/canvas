CREATE TABLE "access_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"member_id" text,
	"env_id" text,
	"url" text NOT NULL,
	"title" text,
	"action" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "access_policies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'blacklist' NOT NULL,
	"targets" jsonb DEFAULT '[]',
	"applied_to" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"desc" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_settings" (
	"id" text PRIMARY KEY NOT NULL,
	"device_whitelist" boolean DEFAULT false,
	"office_ip_restricted" boolean DEFAULT false,
	"allowed_ips" text,
	"time_restricted" boolean DEFAULT false,
	"allow_time_start" text,
	"allow_time_end" text
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" text DEFAULT 'custom' NOT NULL,
	"permissions" jsonb DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"role_id" text,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"phone" text,
	"password_hash" text NOT NULL,
	"accessible_groups" jsonb DEFAULT '[]',
	"browser_limit" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "browser_environments" ADD COLUMN "group_id" text;--> statement-breakpoint
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_member_id_users_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_env_id_browser_environments_id_fk" FOREIGN KEY ("env_id") REFERENCES "public"."browser_environments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "browser_environments" ADD CONSTRAINT "browser_environments_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE set null ON UPDATE no action;