import express from "express";
import bcrypt from 'bcrypt';
import { prisma } from '~/prisma';
import { createJWTToken } from "~/utils";
import { JWTMiddleware } from "~/middleware/authentication";
import { UserUpdateArgs } from "generated/prisma/models";

export const accountsRouter = express.Router();

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
            // By default the nickname will be the users username
            nickname: username,
            password: hashedPassword,
            email, 
        }
    });

    // Create and return a JWT token
    const token = createJWTToken(user.id);
    return token;
});

// UserId will be set through JWTMiddleware so we dont need it as a route parameter
// This route lets users change their nickname, bio, and email
accountsRouter.patch("/update", JWTMiddleware, (req, res) => {
    

    const user = req.user;

    const data = {}

    if(req.body.nickname) {
        data.nickanme = req.body.nickname;
    }

    if(req.body.bio) {
        data.bio = req.body.bio;
    }

    if(req.body.email) {
        data.email = req.body.email;
    }
});