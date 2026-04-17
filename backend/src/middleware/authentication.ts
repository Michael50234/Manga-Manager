import { JWTPayload } from "~/types";
import jwt from "jsonwebtoken";
import { prisma } from "~/prisma";
import z from 'zod'
import { NextFunction, Request, Response } from "express";

// Validates JWT token and returns the user with the userId in the payload
export async function JWTMiddleware(req: Request, res: Response, next: NextFunction) {
    // Get the jwt token from the auth header
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        res.status(401).json({
            detail: "The request object is missing a JWT token"
        });
        return;
    } 

    const [scheme, accessToken] = authHeader.split(" ")

    if(scheme !== "Bearer" || !accessToken) {
        res.status(401).json({
            detail: "Authorization header is not valid"
        })
        return;
    }

    let payload: JWTPayload;

    // Verify that the token is valid
    try {
        payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown as JWTPayload;
    } catch {
        res.status(401).json({
            detail: "JWT token is not valid"
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
            detail: `Failed to find user with the userId ${payload.userId}`
        });
        return;
    }
    console.log("User Authenticated")

    req.user = user
    next();
}