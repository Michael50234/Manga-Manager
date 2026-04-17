import express from "express";
import bcrypt from 'bcrypt';
import { prisma } from '~/prisma';
import { createJWTToken } from "~/utils";
import { JWTMiddleware } from "~/middleware/authentication";
import { UserUpdateArgs } from "generated/prisma/models";
import { loginSchema, signUpSchema, updateUserSchema } from "~/validators/accounts";

export const accountsRouter = express.Router();

accountsRouter.post("/login", async (req, res) => {
    // Validate request body
    const parsed = loginSchema.safeParse(req.body);

    if(!parsed.success) {
        res.status(400).json({
            detail: `Request body not valid: ${parsed.error.message}`
        });
        return;
    }

    const username = parsed.data.username;
    const password = parsed.data.password;

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
    // Validate request body
    const parsed = signUpSchema.safeParse(req.body);
    
    if(!parsed.success) {
        res.status(400).json({
            detail: `Request body is not valid: ${parsed.error.message}`
        })
        return;
    }

    const username = parsed.data.username;
    const password = parsed.data.password;
    const email = parsed.data.email;

    // Hash the password 
    const hashedPassword = await bcrypt.hash(password, 10);;

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
    res.status(200).json({
        accessToken: token,
    })

});

// UserId will be set through JWTMiddleware so we dont need it as a route parameter
// This route lets users change their nickname, bio, and email
accountsRouter.patch("/update", JWTMiddleware, async (req, res) => {
    // Validate the request body using a zod schema
    const validated = updateUserSchema.safeParse(req.body);
    
    if(!validated.success) {
        res.status(400).json({
            detail: `Failed to save changes: ${validated.error.message}`
        });
        return;
    }

    const requestBody = validated.data;

    const user = req.user;

    const data: UserUpdateArgs['data'] = {};

    // Add the fields we want to update to the data attribute
    if(requestBody.nickname) {
        data.nickname = requestBody.nickname;
    }

    if(requestBody.bio) {
        data.bio = requestBody.bio;
    }

    if(requestBody.email) {
        data.email = requestBody.email;
    }

    await prisma.user.update({
        where: {
            id: user!.id
        },
        data,
    });

    res.status(200).json({
        detail: "Successfully saved changes to user"
    });

});