CREATE TABLE "recipes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"ingredients" jsonb NOT NULL,
	"steps" jsonb NOT NULL,
	"servings" integer NOT NULL,
	"prep_time_minutes" integer,
	"cook_time_minutes" integer,
	"tags" jsonb NOT NULL
);
