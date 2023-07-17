DO $$ BEGIN
 CREATE TYPE "importance" AS ENUM('high', 'medium', 'normal', 'post_high');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "permission" AS ENUM('view_rooms', 'manage_rooms', 'add_rooms', 'view_sensors', 'manage_sensors', 'add_sensors');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "triggerEvent" AS ENUM('lessThanMin', 'greaterThanMax');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blocks" (
	"block_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"location" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "halls" (
	"hall_ID" serial PRIMARY KEY NOT NULL,
	"label" varchar NOT NULL,
	"map" "bytea" NOT NULL,
	"block_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invitations" (
	"invitation_ID" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"maximum_date" timestamp NOT NULL,
	"user_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "measures" (
	"measure_ID" serial PRIMARY KEY NOT NULL,
	"measure_type" varchar NOT NULL,
	"value" numeric NOT NULL,
	"timestamp" timestamp NOT NULL,
	"sensor_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "notifications" (
	"notification_ID" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"importance" "importance" NOT NULL,
	"measure_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objectConfigs" (
	"object_config_ID" serial PRIMARY KEY NOT NULL,
	"config" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objectTypes" (
	"object_type_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objects" (
	"object_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"icon_name" varchar NOT NULL,
	"maker" varchar NOT NULL,
	"serial_number" varchar NOT NULL,
	"installation_date" timestamp,
	"emplacement" text,
	"hall_ID" integer,
	"object_type_ID" integer NOT NULL,
	"block_ID" integer NOT NULL,
	"object_config_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "objectsToTags" (
	"object_ID" integer NOT NULL,
	"tag_ID" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "objectsToTags" ADD CONSTRAINT "objectsToTags_object_ID_tag_ID" PRIMARY KEY("object_ID","tag_ID");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "onboardingRating" (
	"onboarding_rating_id" serial PRIMARY KEY NOT NULL,
	"rate" numeric NOT NULL,
	"comment" varchar NOT NULL,
	"user_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roles" (
	"role_ID" serial PRIMARY KEY NOT NULL,
	"permissions" permission[] DEFAULT array[]::permission[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rolesToAccesses" (
	"role_access_ID" serial PRIMARY KEY NOT NULL,
	"role_ID" integer NOT NULL,
	"have_access" boolean NOT NULL,
	"hall_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tagConfigs" (
	"tag_config_ID" serial PRIMARY KEY NOT NULL,
	"object_type_ID" integer NOT NULL,
	"object_config_ID" integer NOT NULL,
	"tag_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"tag_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thresholds" (
	"threshold_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"value_min" numeric,
	"value_max" numeric,
	"sensor_ID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "thresholdsTriggers" (
	"threshold_trigger_ID" serial PRIMARY KEY NOT NULL,
	"trigger_event" "triggerEvent" NOT NULL,
	"threshold_ID" integer NOT NULL,
	"trigger_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "triggers" (
	"trigger_ID" serial PRIMARY KEY NOT NULL,
	"new_state" boolean NOT NULL,
	"object_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"user_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"permissions" permission[] DEFAULT array[]::permission[] NOT NULL,
	"block_ID" integer,
	"invitation_ID" integer,
	"role_ID" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersToAccesses" (
	"user_access_ID" serial PRIMARY KEY NOT NULL,
	"user_ID" integer NOT NULL,
	"have_access" boolean NOT NULL,
	"hall_ID" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "halls" ADD CONSTRAINT "halls_block_ID_blocks_block_ID_fk" FOREIGN KEY ("block_ID") REFERENCES "blocks"("block_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "measures" ADD CONSTRAINT "measures_sensor_ID_objects_object_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "objects"("object_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notifications" ADD CONSTRAINT "notifications_measure_ID_measures_measure_ID_fk" FOREIGN KEY ("measure_ID") REFERENCES "measures"("measure_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_hall_ID_halls_hall_ID_fk" FOREIGN KEY ("hall_ID") REFERENCES "halls"("hall_ID") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_object_type_ID_objectTypes_object_type_ID_fk" FOREIGN KEY ("object_type_ID") REFERENCES "objectTypes"("object_type_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_block_ID_blocks_block_ID_fk" FOREIGN KEY ("block_ID") REFERENCES "blocks"("block_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objects" ADD CONSTRAINT "objects_object_config_ID_objectConfigs_object_config_ID_fk" FOREIGN KEY ("object_config_ID") REFERENCES "objectConfigs"("object_config_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objectsToTags" ADD CONSTRAINT "objectsToTags_object_ID_objects_object_ID_fk" FOREIGN KEY ("object_ID") REFERENCES "objects"("object_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "objectsToTags" ADD CONSTRAINT "objectsToTags_tag_ID_tags_tag_ID_fk" FOREIGN KEY ("tag_ID") REFERENCES "tags"("tag_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "onboardingRating" ADD CONSTRAINT "onboardingRating_user_ID_users_user_ID_fk" FOREIGN KEY ("user_ID") REFERENCES "users"("user_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rolesToAccesses" ADD CONSTRAINT "rolesToAccesses_role_ID_roles_role_ID_fk" FOREIGN KEY ("role_ID") REFERENCES "roles"("role_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rolesToAccesses" ADD CONSTRAINT "rolesToAccesses_hall_ID_halls_hall_ID_fk" FOREIGN KEY ("hall_ID") REFERENCES "halls"("hall_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagConfigs" ADD CONSTRAINT "tagConfigs_object_type_ID_objectTypes_object_type_ID_fk" FOREIGN KEY ("object_type_ID") REFERENCES "objectTypes"("object_type_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagConfigs" ADD CONSTRAINT "tagConfigs_object_config_ID_objectConfigs_object_config_ID_fk" FOREIGN KEY ("object_config_ID") REFERENCES "objectConfigs"("object_config_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tagConfigs" ADD CONSTRAINT "tagConfigs_tag_ID_tags_tag_ID_fk" FOREIGN KEY ("tag_ID") REFERENCES "tags"("tag_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thresholds" ADD CONSTRAINT "thresholds_sensor_ID_objects_object_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "objects"("object_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thresholdsTriggers" ADD CONSTRAINT "thresholdsTriggers_threshold_ID_thresholds_threshold_ID_fk" FOREIGN KEY ("threshold_ID") REFERENCES "thresholds"("threshold_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "thresholdsTriggers" ADD CONSTRAINT "thresholdsTriggers_trigger_ID_triggers_trigger_ID_fk" FOREIGN KEY ("trigger_ID") REFERENCES "triggers"("trigger_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "triggers" ADD CONSTRAINT "triggers_object_ID_objects_object_ID_fk" FOREIGN KEY ("object_ID") REFERENCES "objects"("object_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_block_ID_blocks_block_ID_fk" FOREIGN KEY ("block_ID") REFERENCES "blocks"("block_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_invitation_ID_invitations_invitation_ID_fk" FOREIGN KEY ("invitation_ID") REFERENCES "invitations"("invitation_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_role_ID_roles_role_ID_fk" FOREIGN KEY ("role_ID") REFERENCES "roles"("role_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToAccesses" ADD CONSTRAINT "usersToAccesses_user_ID_users_user_ID_fk" FOREIGN KEY ("user_ID") REFERENCES "users"("user_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToAccesses" ADD CONSTRAINT "usersToAccesses_hall_ID_halls_hall_ID_fk" FOREIGN KEY ("hall_ID") REFERENCES "halls"("hall_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
