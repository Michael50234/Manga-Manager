import z from "zod";

export const getManhwaListSchema = z.object({
    page: z.string()
        .transform((page) => parseInt(page, 10) - 1)
        .refine((page) => {
            return page >= 0
        }, {
            message: "page number cannot be negative"
        }),
    limit: z.string()
        .transform((limit) => parseInt(limit, 10))
        .refine((limit) => {
            return limit >= 10
        }, {
            message: "The number of items per page must be at least 10"
        }).refine((limit) => {
            return limit <= 100
        }, {
            message: "The number of series per page must be smaller than 100"
        }),
    searchText: z.string()
        .transform((searchText) => searchText.trim())
        .optional(),
    // This is an array of tag uuids
    tags: z.array(z.uuid())
        .optional(),    
})

export const editUserMangaPreferenceSchema =  z.object({
    mangaAccessLink: z.string().optional(), 
    sendNotifications: z.boolean().optional(), 
    mangaReleaseDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday",  "Friday", "Saturday", "Sunday"]).optional(),
    tierListRank: z.enum(["GodTier", "S", "A", "B", "C" , "D", "F" , "Dropped", "Unranked"]).optional()
})