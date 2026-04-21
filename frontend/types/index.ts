// Database Resource Shapes
export type User = {
    id: string,
    bio: string
    email: string,
    nickname: string,
    createdAt: Date,
    lastUpdatedAt: Date,
}


// Backend API Response Shapes
export type ErrorResponse = {
    detail: string
}