ALTER TABLE "Mesures" RENAME TO "Measures";--> statement-breakpoint
ALTER TABLE "Notifications" RENAME COLUMN "mesure_ID" TO "measure_ID";--> statement-breakpoint
ALTER TABLE "Measures" RENAME COLUMN "mesure_ID" TO "measure_ID";--> statement-breakpoint
ALTER TABLE "Notifications" DROP CONSTRAINT "Notifications_mesure_ID_Mesures_mesure_ID_fk";
--> statement-breakpoint
ALTER TABLE "Measures" DROP CONSTRAINT "Mesures_sensor_ID_Sensors_sensor_ID_fk";
--> statement-breakpoint
ALTER TABLE "Access" ALTER COLUMN "hall_ID" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_measure_ID_Measures_measure_ID_fk" FOREIGN KEY ("measure_ID") REFERENCES "Measures"("measure_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Measures" ADD CONSTRAINT "Measures_sensor_ID_Sensors_sensor_ID_fk" FOREIGN KEY ("sensor_ID") REFERENCES "Sensors"("sensor_ID") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
