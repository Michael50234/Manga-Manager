import z from "zod";

export const updateSchema = z.object({
    bio: z.string().min(1, "Bio must be at least one charecter long").optional(),
    email: z.string().refine((email) => {
        return email.includes("@")
    }, {
        message: "Please pass a valid email"
    }).optional(),
    nickname: z.string().min(1, "Nickname cannot be empty").max(20, "Nickname must be shorter than 20 charecters"),
})