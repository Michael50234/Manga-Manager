import express from "express";
import bcrypt from 'bcrypt';
import { prisma } from '~/prisma';
import { createJWTToken } from "~/utils";
import { create } from "node:domain";


const accountsRouter = express.Router();

accountsRouter.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Get the user with the username
    const user = await prisma.user.findUnique({
        where: {
            username,
        }
    });

    if(!user) {
        res.status(401).json({
            detail: `Username or password is incorrect`
        });
        return;
    }

    // Hash the password and compare it to the hashed password in the database
    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid) {
        res.status(401).json({
            detail: "Username or password is incorrect"
        })
        return;
    }

    // Create the JWT token and return it
    const token = createJWTToken(user.id);

    res.status(200).json({
        accessToken: token,
    });
});

accountsRouter.post("/sign-up", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;

    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user in the database
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            email, 
        }
    });

    // Create and return a JWT token
    const token = createJWTToken(user.id);
    return token;
});

// UserId will be set through JWTMiddleware so we dont need it as a route parameter
accountsRouter.patch("/update", (req, res) => {

});