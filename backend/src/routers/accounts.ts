import express from "express";

const accountsRouter = express.Router();

accountsRouter.post("/login", (req, res) => {

});

accountsRouter.post("/sign-up", (req, res) => {

});

// UserId will be set through JWTMiddleware so we dont need it as a route parameter
accountsRouter.patch("/update", (req, res) => {

});