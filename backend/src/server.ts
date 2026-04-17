import "../config/env"
import express from 'express';
import { accountsRouter } from "./routers/accounts";
import { mangaRouter } from "./routers/manga";

const app = express();

app.use(express.json());

app.use("/accounts", accountsRouter);

app.use("/manga", mangaRouter);

app.listen(Number(process.env.port));