import "~/../config/env";
import { Queue } from "bullmq";


export const sendNotificationQueue = new Queue("sendNotificationQueue", {
    connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    },
});

export const createNotificationRequestQueue = new Queue("createNotificationRequestQueue", {
    connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    },
});