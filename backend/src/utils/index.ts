import jwt from "jsonwebtoken"

function createJWTToken(userId: string) { 
    // Create JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '2h'
    });

    return token;
}