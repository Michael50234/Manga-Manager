import z from "zod";

export const signUpSchema = z.object({
    username: z.string().min(1, "Username cannot be empty"),
    password: z.string().min(6, "Password must have a minimum length of 6"),
    email: z.string().refine((email) => {
        return email.includes('@');
    }, {
        message: "Please pass a valid email"
    })
})

export const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const updateUserSchema = z.object({
    bio: z.string().min(1, "Bio must be at least one charecter long").optional(),
    email: z.string().refine((email) => {
        return email.includes("@")
    }, {
        message: "Please pass a valid email"
    }).optional(),
    nickname: z.string().min(1, "Nickname cannot be empty").max(20, "Nickname must be shorter than 20 charecters"),
})