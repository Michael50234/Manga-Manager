import { Worker } from "bullmq";
import nodemailer from "nodemailer";

import "~/../config/env";
import { prisma } from "~/prisma";
import { sendNotificationQueue } from "./queues";
import { ReleasingSeries } from "~/types";
import { createNotificationMessage } from "~/utils/workers";

type SendNotificationJobData = {
    user: {
        username: string
        id: string
        email: string
        nickname: string
        bio: string | null
        lastUpdatedAt: Date
        createdAt: Date
    },
    mangaPreferences: {
        manga: {
            title: string
        }
        id: string
        lastUpdatedAt: Date
        createdAt: Date
        mangaAccessLink: string | null
        sendNotifications: boolean
        mangaReleaseDay: string | null
        tierListRank: string
        userId: string
        mangaId: string
    }[]
}

// Create a node mailer transporter to send emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

const createNotificationRequestWorker  = new Worker("createNotificationRequestQueue", async (job) => {
    const users = await prisma.user.findMany({
        include: {
            userMangaPreferences: { 
                include: { 
                    manga: {
                        select: {
                            title: true
                        }
                    }
                }
            }
        }
    });

    for(const user of users) {
        await sendNotificationQueue.add(`send-notification-for-${user.id}`, {
            user: {
                username: user.username,
                password: user.password,
                id: user.id,
                email: user.email,
                nickname: user.nickname,
                bio: user.bio,
                lastUpdatedAt: user.lastUpdatedAt,
                createdAt: user.createdAt,
            }, 
            mangaPreferences: user.userMangaPreferences,
        }, {
             attempts: 2,
             backoff: {
                type: "linear",
                delay: 1000
             }, 
        })
    }

    // True will signify a successful job
    return true;
}, {
    connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    }
});

const sendNotificationWorker = new Worker<SendNotificationJobData>("sendNotificationQueue", async (job) => {
    const dayMap: Record<number, string> = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    };

    // A list of the series followed by the user releasing today
    const releasingSeries: ReleasingSeries[] = [];

    const email = job.data.user.email;
    const currentDay = dayMap[new Date().getDay()];

    for(const mangaPreference of job.data.mangaPreferences) {
        if(
            mangaPreference.sendNotifications &&
            mangaPreference.mangaReleaseDay === currentDay
        ) {
            releasingSeries.push({
                title: mangaPreference.manga.title,
                mangaAccessLink: mangaPreference.mangaAccessLink,
            });
        }
    } 

    // Do not send empty emails if there are no releasing series
    if(releasingSeries.length === 0) {
        return;
    }

    const message = createNotificationMessage(
        job.data.user.username,
        releasingSeries
    );

    const htmlMessage = createNotificationMessage(
        job.data.user.username, 
        releasingSeries
    );

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: job.data.user.email,
        subject: "Your Manga Release Notifications",
        text: message,
        html: htmlMessage, 
    });

    return true;
}, {
    connection: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT!),
    },
    concurrency: 5,
})


