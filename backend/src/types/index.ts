export type JWTPayload = {
    userId: string,
    // Issued at time 
    iat?: string, 
    // Expiry time  
    exp?: string, 
}

export type ReleasingSeries = {
    title: string,
    mangaAccessLink: string | null,
}