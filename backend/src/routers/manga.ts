import express from "express";
import { UserMangaPreferenceUpdateArgs } from "generated/prisma/models";
import { JWTMiddleware } from "~/middleware/authentication";
import { prisma } from "~/prisma";
import { editUserMangaPreferenceSchema, getManhwaListSchema } from "~/validators/manga";

export const mangaRouter = express.Router();

mangaRouter.use(JWTMiddleware);

mangaRouter.route("/favourites")
    // Returns the users favourite series
    .get((req, res) => {
    
    })
    // Adds a series to the users favourite series
    .post((req, res) => {
    
    })

// Returns a paginated list of manga from MangaDex
mangaRouter.get("/", async (req, res) => {
    // The query parameters include: page, limit, searchText, and a list of tags
    // Validate the request body
    const parsed = getManhwaListSchema.safeParse(req.query)

    if(!parsed.success) {
        res.status(400).json({
            detail: `Response body is not valid ${parsed.error.message}`
        });
        return;
    }

    const queryParams = parsed.data;

    const page = queryParams.page;
    const limit = queryParams.limit;
    const searchText = queryParams.searchText;
    const tags = queryParams.tags;

    // Create URLSearchParams object and add default search params
    const searchParams = new URLSearchParams([
        ["includes", "manga"],
        ["includes", "author"], 
        ["includes", "tag"]
    ])

    // Add pagination params
    searchParams.set("limit", `${limit}`);
    searchParams.set("offset", `${page * limit}`);

    // Add optional filter params
    if(searchText) {
        searchParams.set("title", searchText);
    }

    tags?.forEach((tag) => {
        searchParams.append("includedTags", tag);
    })

    // Fetch manga from MangaDex
    const response = await fetch(`https://api.mangadex.org/manga?${searchParams.toString()}`)

    if(!response.ok) {
        res.status(404).json({
            detatil: "Failed to fetch manga from MangaDex"
        })
        return;
    }

    // TODO: Maybe shape the response
    const paginatedManga = await response.json()

    res.status(200).json(paginatedManga)
})

// Returns a list of all MangaDex tags
mangaRouter.get("/tag-list", async (req, res) => {
    // Fetch tag list from MangaDex
    const response = await fetch("https://api.mangadex.org/manga/tag")

    if(!response.ok) {
        res.status(404).json({
            detail: "Failed to fetch tags"
        });
        return;
    }

    const tags = await response.json();

    res.status(200).json(tags);
})


// Allows users to access their preferences for a specific manga
// The id is the id of the manga
mangaRouter.route("/:id/user-manga-preference")
    .get(async (req, res) => {
        const mangaId = req.params.id
        const user = req.user

        // Get the users manga preference from the database
        const userMangaPreference = await prisma.userMangaPreference.findUnique({
            where: {
                userId_mangaId: {
                    userId: user!.id,
                    mangaId,
                }
            }
        })

        // Return an error response if the users preference is not found
        if(!userMangaPreference) {
            res.status(400).json({
                detail: "Failed to find user's manga preference settings"
            })
            return;
        }

        // Returns the users manga preference
        res.status(200).json(userMangaPreference)
    })
    .post((req, res) => {
        const mangaId = req.params.id;
        const user = req.user!;

        const parsed = editUserMangaPreferenceSchema.safeParse(req.body);
        
        if(!parsed.success) {
            res.status(400).json({
                detail: `Request body not valid: ${parsed.error.message}`
            });
            return;
        }

        const data = parsed.data;

        // Create the manga in the database if it doesnt already exist using data from the api

        const updateData: UserMangaPreferenceUpdateArgs['data'] = {

        }
    
    })
    .patch((req, res) => {
    
    })

// Returns a list of the users manga preference settings
mangaRouter.get("/user-manga-preferences", (req, res) => {

})

// Returns a list of recomended manga based on a manga
mangaRouter.get("/:id/recomended", () => {

})

// Returns the details of a specific manga
// The id is the id of the manga
mangaRouter.get("/:id", (req, res) => {
    
});

