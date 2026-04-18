import "../config/env"
import express from 'express';
import { accountsRouter } from "./routers/accounts";
import { mangaRouter } from "./routers/manga";
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        detail: "Hello, is this working"
    });
})

app.use("/accounts", accountsRouter);

app.use("/manga", mangaRouter);

app.listen(Number(process.env.port));