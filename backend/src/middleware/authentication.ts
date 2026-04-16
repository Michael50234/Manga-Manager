import { JWTPayload } from "~/types";
import jwt from "jsonwebtoken";
import { prisma } from "~/prisma";

// Validates JWT token and returns the user with the userId in the payload
async function JWTMiddleware(accessToken: string) {
    let payload: JWTPayload;

    // Verify that the token is valid
    try {
        payload = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown as JWTPayload;
    } catch {
        throw new Error("JWT token is not valid")
    }

    // Finds and return user with userId payload.userId
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: payload.userId
            }
        });
        return user;
    } catch(error) {
        throw new Error(`Failed to find user with the userId ${payload.userId}`);
    }
}