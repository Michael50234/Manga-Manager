import { createNotificationRequestQueue } from "./queues";

export const registerCronJobs = async () => {
    await createNotificationRequestQueue.upsertJobScheduler(
        "daily-manga-notifications",
        {
            pattern: "0 10 * * *"
        },
        {
            name: "daily-manga-notifications",
            data: {},
        }
    );
};