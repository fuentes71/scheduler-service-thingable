-- CreateTable
CREATE TABLE "cron_interval" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "days_week" TEXT[],
    "minutes" INTEGER NOT NULL,
    "hours" INTEGER NOT NULL,
    "seconds" INTEGER NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP,

    CONSTRAINT "cron_interval_pkey" PRIMARY KEY ("id")
);
