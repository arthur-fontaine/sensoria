DO $$ BEGIN
 CREATE TYPE "impact" AS ENUM('high', 'medium', 'normal', 'post_high');
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
CREATE TABLE IF NOT EXISTS "Access" (
	"access_ID" serial PRIMARY KEY NOT NULL,
	"hall_ID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Actions" (
	"action_ID" serial PRIMARY KEY NOT NULL,
	"sensor_ID" integer,
	"name" varchar,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Alarms" (
	"alert_ID" serial PRIMARY KEY NOT NULL,
	"sensor_ID" integer,
	"impact" "impact",
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Blocks" (
	"block_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"location" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Halls" (
	"hall_ID" serial PRIMARY KEY NOT NULL,
	"sensor_ID" integer,
	"block_ID" integer,
	"hall_tag_ID" integer,
	"map" "bytea"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Invitations" (
	"invitation_ID" serial PRIMARY KEY NOT NULL,
	"user_ID" integer,
	"email" varchar,
	"maximum_date" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Mesures" (
	"mesure_ID" serial PRIMARY KEY NOT NULL,
	"sensor_ID" integer,
	"value" numeric,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Notifications" (
	"notification_ID" serial PRIMARY KEY NOT NULL,
	"mesure_ID" integer,
	"sensor_ID" integer,
	"message" text,
	"timestamp" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "OnboardingRating" (
	"onboarding_rating_id" serial PRIMARY KEY NOT NULL,
	"rate" numeric,
	"note" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Roles" (
	"role_ID" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "RolesAccess" (
	"access_ID" serial PRIMARY KEY NOT NULL,
	"role_ID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "SensorConfig" (
	"sensor_config_ID" serial PRIMARY KEY NOT NULL,
	"config" jsonb
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Sensors" (
	"sensor_ID" serial PRIMARY KEY NOT NULL,
	"sensor_config_ID" integer,
	"tag_ID" integer,
	"maker" varchar,
	"name" varchar,
	"serial_number" varchar,
	"emplacement" text,
	"installation_date" timestamp,
	"status" varchar,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Tags" (
	"tag_ID" serial PRIMARY KEY NOT NULL,
	"type_sensor_ID" integer,
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TagsConfig" (
	"type_sensor_ID" integer,
	"sensor_config_ID" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Thresholds" (
	"threshold_ID" serial PRIMARY KEY NOT NULL,
	"sensor_ID" integer,
	"name" varchar,
	"value_max" numeric,
	"value_min" numeric
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "TypeSensor" (
	"type_sensor_ID" serial PRIMARY KEY NOT NULL,
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Users" (
	"user_ID" serial PRIMARY KEY NOT NULL,
	"invitation_ID" integer,
	"role_ID" integer,
	"name" varchar,
	"email" varchar,
	"password" varchar,
	"joined_at" timestamp,
	"permissions" permission[]
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "UsersAccess" (
	"user_access_ID" serial PRIMARY KEY NOT NULL,
	"access_ID" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Actions" ADD CONSTRAINT "Actions_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Alarms" ADD CONSTRAINT "Alarms_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Halls" ADD CONSTRAINT "Halls_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Halls" ADD CONSTRAINT "Halls_block_ID_Blocks_block_ID_fk" FOREIGN KEY ("block_ID") REFERENCES "Blocks"("block_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Halls" ADD CONSTRAINT "Halls_hall_tag_ID_Tags_tag_ID_fk" FOREIGN KEY ("hall_tag_ID") REFERENCES "Tags"("tag_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Mesures" ADD CONSTRAINT "Mesures_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_mesure_ID_Mesures_mesure_ID_fk" FOREIGN KEY ("mesure_ID") REFERENCES "Mesures"("mesure_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "RolesAccess" ADD CONSTRAINT "RolesAccess_role_ID_Roles_role_ID_fk" FOREIGN KEY ("role_ID") REFERENCES "Roles"("role_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Sensors" ADD CONSTRAINT "Sensors_sensor_config_ID_SensorConfig_sensor_config_ID_fk" FOREIGN KEY ("sensor_config_ID") REFERENCES "SensorConfig"("sensor_config_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Sensors" ADD CONSTRAINT "Sensors_tag_ID_Tags_tag_ID_fk" FOREIGN KEY ("tag_ID") REFERENCES "Tags"("tag_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Tags" ADD CONSTRAINT "Tags_type_sensor_ID_TypeSensor_type_sensor_ID_fk" FOREIGN KEY ("type_sensor_ID") REFERENCES "TypeSensor"("type_sensor_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TagsConfig" ADD CONSTRAINT "TagsConfig_type_sensor_ID_TypeSensor_type_sensor_ID_fk" FOREIGN KEY ("type_sensor_ID") REFERENCES "TypeSensor"("type_sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "TagsConfig" ADD CONSTRAINT "TagsConfig_sensor_config_ID_SensorConfig_sensor_config_ID_fk" FOREIGN KEY ("sensor_config_ID") REFERENCES "SensorConfig"("sensor_config_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Thresholds" ADD CONSTRAINT "Thresholds_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users" ADD CONSTRAINT "Users_invitation_ID_Invitations_invitation_ID_fk" FOREIGN KEY ("invitation_ID") REFERENCES "Invitations"("invitation_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Users" ADD CONSTRAINT "Users_role_ID_Roles_role_ID_fk" FOREIGN KEY ("role_ID") REFERENCES "Roles"("role_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UsersAccess" ADD CONSTRAINT "UsersAccess_access_ID_Access_access_ID_fk" FOREIGN KEY ("access_ID") REFERENCES "Access"("access_ID") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
