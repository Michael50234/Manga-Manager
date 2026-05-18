import "../config/env"
import express from 'express';
import { accountsRouter } from "./routers/accounts";
import { mangaRouter } from "./routers/manga";
import cors from 'cors'
import cookieParser from "cookie-parser";
import "~/bullmq/workers";
import { registerCronJobs } from "./bullmq/registerCronJobs";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

app.use("/accounts", accountsRouter);

app.use("/manga", mangaRouter);

const startServer = async () => {
    await registerCronJobs();

    app.listen(Number(process.env.PORT), () => {
        console.log("Server started");
    });
};

startServer();