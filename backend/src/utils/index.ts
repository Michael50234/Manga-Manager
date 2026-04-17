import jwt from "jsonwebtoken"

export function createJWTToken(userId: string) { 
    // Create JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '2h'
    });

    return token;
}