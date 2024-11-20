CREATE TYPE "public"."ActionType" AS ENUM('AUDITOR_TERMS_APPROVED', 'AUDITOR_TERMS_REJECTED', 'AUDITOR_FINDINGS', 'AUDITOR_LEFT', 'OWNER_APPROVED', 'OWNER_LOCKED', 'OWNER_OPENED', 'OWNER_EDITED', 'OWNER_FINALIZED', 'OWNER_REVEALED');--> statement-breakpoint
CREATE TYPE "public"."AuditStatusType" AS ENUM('DISCOVERY', 'ATTESTATION', 'AUDITING', 'CHALLENGEABLE', 'FINALIZED');--> statement-breakpoint
CREATE TYPE "public"."MembershipStatusType" AS ENUM('VERIFIED', 'REQUESTED', 'REJECTED');--> statement-breakpoint
CREATE TYPE "public"."RoleType" AS ENUM('OWNER', 'AUDITOR');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "action" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"membership_id" uuid NOT NULL,
	"comment" text,
	"type" "ActionType" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit_membership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"audit_id" uuid NOT NULL,
	"role" "RoleType" NOT NULL,
	"status" "MembershipStatusType" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"attested_terms" boolean DEFAULT false NOT NULL,
	"accepted_terms" boolean DEFAULT false NOT NULL,
	"findings" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "audit" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"details" text,
	"price" integer DEFAULT 0 NOT NULL,
	"duration" integer DEFAULT 30 NOT NULL,
	"cliff" integer DEFAULT 3 NOT NULL,
	"token" text,
	"onchain_audit_info_id" text,
	"onchain_nft_id" text,
	"status" "AuditStatusType" DEFAULT 'DISCOVERY' NOT NULL,
	CONSTRAINT "price_check" CHECK ("audit"."price" >= 0),
	CONSTRAINT "duration_check" CHECK ("audit"."duration" >= 0),
	CONSTRAINT "cliff_check" CHECK ("audit"."cliff" >= 0)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notification" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	"action_id" uuid NOT NULL,
	"has_viewed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"address" text NOT NULL,
	"owner_role" boolean DEFAULT false NOT NULL,
	"auditor_role" boolean DEFAULT false NOT NULL,
	"name" text,
	"image" text,
	"available" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wishlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "action" ADD CONSTRAINT "action_membership_id_audit_membership_id_fk" FOREIGN KEY ("membership_id") REFERENCES "public"."audit_membership"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_membership" ADD CONSTRAINT "audit_membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit_membership" ADD CONSTRAINT "audit_membership_audit_id_audit_id_fk" FOREIGN KEY ("audit_id") REFERENCES "public"."audit"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "audit" ADD CONSTRAINT "audit_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_receiver_id_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_membership_user_id_audit_id_is_active_idx" ON "audit_membership" USING btree ("user_id","audit_id","is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "audit_membership_user_id_audit_id_is_active_status_idx" ON "audit_membership" USING btree ("user_id","audit_id","is_active","status");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "audit_membership_user_id_audit_id_key" ON "audit_membership" USING btree ("user_id","audit_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "notification_user_id_action_id_key" ON "notification" USING btree ("user_id","action_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notification_user_id_has_viewed_idx" ON "notification" USING btree ("user_id","has_viewed");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "notification_user_id_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "user_address_key" ON "user" USING btree ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "wishlist_sender_id_receiver_id_key" ON "wishlist" USING btree ("sender_id","receiver_id");