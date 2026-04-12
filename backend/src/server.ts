import "../config/env"
import express from 'express';

const app = express();

app.use(express.json())


app.listen(Number(process.env.port));