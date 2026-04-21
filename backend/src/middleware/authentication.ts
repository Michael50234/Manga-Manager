import { JWTPayload } from "~/types";
import jwt from "jsonwebtoken";
import { prisma } from "~/prisma";
import { NextFunction, Request, Response } from "express";

// Validates JWT token and returns the user with the userId in the payload
export async function JWTMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get the jwt token from the auth header
    const accessToken = req.cookies.token;

    if(!accessToken) {
        res.status(401).json({
            detail: "User is not authorized"
        });
        return;
    } 

    let payload: JWTPayload;

    // Verify that the token is valid
    try {
        payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown as JWTPayload;
    } catch {
        res.status(401).json({
            detail: "User is not authorized"
        })
        return
    }

    // Finds and sets user in the response object
    const user = await prisma.user.findUnique({
        where: {
            id: payload.userId
        }
    });

    if(!user) {
        res.status(401).json({
            detail: "User is not authorized"
        });
        return;
    }

    // Take out after test
    console.log("User Authenticated")

    req.user = user
    next();
}