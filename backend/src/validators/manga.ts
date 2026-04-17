import z from "zod";

export const editUserMangaPreferenceSchema =  z.object({
    mangaAccessLink: z.string().optional(), 
    sendNotifications: z.boolean().optional(), 
    mangaReleaseDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday",  "Friday", "Saturday", "Sunday"]).optional(),
    tierListRank: z.enum(["GodTier", "S", "A", "B", "C" , "D", "F" , "Dropped", "Unranked"]).optional()
})