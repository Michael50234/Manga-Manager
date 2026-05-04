import z from "zod";

export const getManhwaListSchema = z.object({
    page: z.string()
        .transform((page) => parseInt(page, 10) - 1)
        .refine((page) => {
            return page >= 0
        }, {
            message: "Page number cannot be negative"
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
    tags: z.preprocess((val) => {
        // Tags can be undefined, string, or array of strings
        // Normalize tags to array of strings
        return Array.isArray(val) ? val : val ? [val] : val
    }, z.array(z.uuid()))
        .optional(),    
    releaseYear: z.string().transform((year) => Number(year)).refine((year) => {
        // Use refine instead of max to generate the year at evaluation time
        return year <= new Date().getFullYear()
    }, {
        message: "The year cannot be greater than the current year"
    }).refine((year) => {
        return 1970 <= year
    }, {
        message: "The year must be greater than 1970"
    }).optional()
})

export const editUserMangaPreferenceSchema = z.object({
    mangaAccessLink: z.string().optional(), 
    sendNotifications: z.boolean().optional(), 
    mangaReleaseDay: z.enum(["Monday", "Tuesday", "Wednesday", "Thursday",  "Friday", "Saturday", "Sunday"]).optional(),
    tierListRank: z.enum(["GodTier", "S", "A", "B", "C" , "D", "F" , "Dropped", "Unranked"]).optional()
})

export const addFavouriteMangaSchema = z.object({
    mangaId: z.uuid(),
})

export const getUserMangaPreferencesSchema = z.object({
    limit: z.string().transform((limit) => Number(limit)).refine((limit) => {
        return limit >= 10;
    }, {
        message: "The number of items per page must be at least 10"
    }).refine((limit) => {
        return limit <= 100;
    }, {
        message: "The number of items per page must be smaller than 100"
    })
    .optional(),
    page: z.string().transform((page) => Number(page) - 1).refine((page) => {
        return page > 0;
    }, {
        message: "The page must be greater than 0"
    })
    .optional()
})

export const getFavouriteMangaSchema = z.object({
    limit: z.string().transform((limit) => Number(limit)).refine((limit) => {
        return limit >= 10;
    }, {
        message: "The number of items per page must be at least 10"
    }).refine((limit) => {
        return limit <= 100;
    }, {
        message: "The number of items per page must be smaller than 100"
    })
    .optional(),
    page: z.string().transform((page) => Number(page) - 1).refine((page) => {
        return page > 0;
    }, {
        message: "The page must be greater than 0"
    })
    .optional()
})