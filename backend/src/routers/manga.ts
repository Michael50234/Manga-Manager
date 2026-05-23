import express from "express";
import { Prisma } from "generated/prisma/client";
import { JWTMiddleware } from "~/middleware/authentication";
import { prisma } from "~/prisma";
import { getMangaDexMangaTitle } from "~/utils/mangaDex";
import { addFavouriteMangaSchema, editUserMangaPreferenceSchema, getFavouriteMangaSchema, getManhwaListSchema, getUserMangaPreferencesSchema } from "~/validators/manga";

export const mangaRouter = express.Router();

mangaRouter.use(JWTMiddleware);

mangaRouter.route("/favourites")
    // Returns a list of all the user's favourited manga
    // If the user includes a limit and page query parameter the response will be paginated
    // Otherwise, it won't be paginated
    .get(async (req, res) => {
        const parsed = getFavouriteMangaSchema.safeParse(req.query);

        if(!parsed.success) {
            res.json({
                detail: `Response body is not valid: ${parsed.error.message}`
            });
            return;
        }

        const queryParams = parsed.data;
        const page = queryParams.page;
        const limit = queryParams.limit;

        const count = (await prisma.user.findUnique({
            where: { id: req.user!.id },
            select: {
                _count: {
                    select: {
                        favouritedManga: true
                    }
                }
            }
        }))?._count.favouritedManga;

        if(page && limit) {
            const skip = page * limit;

            const user = await prisma.user.findUnique({
                where: {
                    id: req.user!.id
                },
                include: {
                    favouritedManga: {
                        take: limit,
                        skip,
                        orderBy: {
                            lastUpdatedAt: 'asc'
                        }
                    }
                }
            });

            if(!user) {
                res.status(404).json({
                    detail: "User not found"
                });
                return;
            }

            res.status(200).json({
                data: user.favouritedManga,
                count,
            });
        }

        // Query for the user and their favourited manga
        const user = await prisma.user.findUnique({
            where: {
                id: req.user!.id
            },
            include: {
                favouritedManga: true
            }
        });

        if(!user) {
            res.status(404).json({
                detail: "User not found"
            });
            return;
        }

        // Return the list of all the user's favourite manga
        res.status(200).json({
            data: user.favouritedManga,
            count,
        });
    })
    // Add/Removes a manga to the users favourite manga
    .post(async (req, res) => {
        const user = req.user!

        // Validate the request body
        const parsed = addFavouriteMangaSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json({
                detail: `Request body not valid ${parsed.error.message}`
            });
            return;
        }

        // This is the MangaDex id of the manga
        const mangaDexId = parsed.data.mangaId;

        // Check that the manga being favourited exists in the database
        let existingManga = await prisma.manga.findUnique({
            where: {
                mangaDexId,
            }
        });

        // If the manga does not already exist, create it
        if(!existingManga) {
            // Get the manga data from MangaDex
            const response = await fetch(`https://api.mangadex.org/manga/${mangaDexId}`)

            if(!response.ok) {
                console.error("Failed to fetch manga from MangaDex");
                
                res.status(404).json({
                    detail: "Failed to fetch manga from MangaDex"
                });

                return;
            }

            const data = await response.json();

            const title = getMangaDexMangaTitle(data.data);

            // Add the manga to the database
            existingManga = await prisma.manga.create({
                data: {
                    mangaDexId,
                    title,
                }
            });
        }

        // Check if the manga is already favourited
        const favouritedMangaList = (await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                favouritedManga: {
                    select: {
                        mangaDexId: true,
                    }
                },
            }
        }))?.favouritedManga;

        // If the manga is already favourited, unfavourite it
        if(favouritedMangaList) {
            for(const favouritedManga of favouritedMangaList) {
                if(mangaDexId === favouritedManga.mangaDexId) {
                    await prisma.user.update({
                        where: {
                            id: user.id
                        },
                        data: {
                            favouritedManga: {
                                disconnect: [{
                                    id: existingManga.id
                                }]
                            }
                        }
                    });

                    res.status(200).json({
                        detail: "Successfully unfavourited manga"
                    });
                    return; 
                }
            }

        }

        // If the manga is not favourited, favourite it
        await prisma.user.update({
            where: {
                id: req.user!.id
            },
            data: {
                favouritedManga: {
                    connect: [{
                        id: existingManga.id
                    }]
                }
            }
        });

        res.status(200).json({
            detail: "Successfully added manga to user's favourites"
        });
    });

// Returns a paginated list of manga from MangaDex
mangaRouter.get("/", async (req, res) => {
    // The query parameters include: page, limit, searchText, releaseYear, and a list of tags
    // Validate the query params object
    const parsed = getManhwaListSchema.safeParse(req.query)

    if(!parsed.success) {
        res.status(400).json({
            detail: `Request body is not valid ${parsed.error.message}`
        });
        return;
    }

    const queryParams = parsed.data;

    const page = queryParams.page;
    const limit = queryParams.limit;
    const searchText = queryParams.searchText;
    const tags = queryParams.tags;
    const releaseYear = queryParams.releaseYear;

    // Create URLSearchParams object and add default search params
    const searchParams = new URLSearchParams([
        ["includes[]", "author"], 
        ["includes[]", "tag"],
        ["includes[]", "cover_art"]
    ])

    // Add pagination params
    searchParams.set("limit", `${limit}`);
    searchParams.set("offset", `${page * limit}`);

    // Add optional filter params
    if(searchText) {
        searchParams.set("title", searchText);
    }

    tags?.forEach((tag) => {
        searchParams.append("includedTags[]", tag);
    })

    if(releaseYear) {
        searchParams.append("year", String(releaseYear));
    }

    // Fetch manga from MangaDex
    const response = await fetch(`https://api.mangadex.org/manga?${searchParams.toString()}`);

    if(!response.ok) {
        console.error("Failed to fetch manga from MangaDex")

        res.status(404).json({
            detail: "Failed to fetch manga from MangaDex"
        })
        return;
    }

    const paginatedManga = await response.json();

    res.status(200).json(paginatedManga);
});

// Returns a list of all MangaDex tags
mangaRouter.get("/tag-list", async (req, res) => {
    // Fetch tag list from MangaDex
    const response = await fetch("https://api.mangadex.org/manga/tag")

    if(!response.ok) {
        console.error("Failed to fetch tags from MangaDex")

        res.status(404).json({
            detail: "Failed to fetch tags"
        });
        return;
    }

    const tags = await response.json();

    res.status(200).json(tags);
});


// Allows users to access their preferences for a specific manga
mangaRouter.route("/:id/user-manga-preference")
    // Returns the users preference for a specific manga
    .get(async (req, res) => {
        // mangaDex mangaId
        const mangaDexId = req.params.id;
        const userId = req.user!.id;

        // Get the id of the record for the manga in the database
        const manga = await prisma.manga.findUnique({
            where: {
                mangaDexId,
            }
        });

        if(!manga) {
            res.status(404).json({
                detail: "Manga does not exist in the database"
            });
            return;
        }

        // Get the user's manga preference from the database
        const userMangaPreference = await prisma.userMangaPreference.findUnique({
            where: {
                userId_mangaId: {
                    userId,
                    mangaId: manga.id
                }
            }
        });

        // Return an error response if the users preference is not found
        if(!userMangaPreference) {
            res.status(404).json({
                detail: "User does not have preference settings for this manga"
            });
            return;
        }

        // Returns the users manga preference
        res.status(200).json(userMangaPreference);
    })
    // Creates a new preference setting for the user for the specific manga
    .post(async (req, res) => {
        // mangaDex mangaId
        const mangaDexId = req.params.id;
        const user = req.user!;

        // Check that the request body is valid
        const parsed = editUserMangaPreferenceSchema.safeParse(req.body);
        
        if(!parsed.success) {
            res.status(400).json({
                detail: `Request body not valid: ${parsed.error.message}`
            });
            return;
        }

        const body = parsed.data;

        // Get the manga record from the database
        let manga = await prisma.manga.findUnique({
            where: {
                mangaDexId,
            }
        });

        // If the manga does not exist in the database, then add it
        if(!manga) {
            // Fetch the manga from mangaDex
            const response = await fetch(`https://api.mangadex.org/manga/${mangaDexId}`)

            if(!response.ok) {
                console.error("Failed to find manga on MangaDex");

                res.status(404).json({
                    detail: "Failed to find manga on MangaDex"
                });

                return;
            }

            const data = await response.json();

            // Get the title of the manga
            const title = getMangaDexMangaTitle(data.data);

            // Create the manga in the database
            manga = await prisma.manga.create({
                data: {
                    title,
                    mangaDexId,
                }
            });
        }

        // Create the userMangaPreference in the database
        await prisma.userMangaPreference.create({
            data: {
                mangaAccessLink: body.mangaAccessLink ?? null,
                mangaReleaseDay: body.mangaReleaseDay ?? null,
                // Only add the tierListRank and sendNotifications attributes if they are non null
                ...(body.tierListRank !== undefined && {tierListRank: body.tierListRank}),
                ...(body.sendNotifications !== undefined && {sendNotifications: body.sendNotifications}),
                mangaId: manga.id,
                userId: user.id,
            }
        });

        res.status(200).json({
            detail: "Successfully created user's manga preference"
        });
    })
    // Update user preference
    .patch(async (req, res) => {
        const mangaDexId = req.params.id;
        const user = req.user!;

        // Check that the request body is valid
        const parsed = editUserMangaPreferenceSchema.safeParse(req.body);

        if(!parsed.success) {
            res.status(400).json({
                detail: `Request body is not valid: ${parsed.error.message}`
            });
            return;
        }

        const body = parsed.data;

        // Check that the manga exists in the database
        const existingManga = await prisma.manga.findUnique({
            where: {
                mangaDexId,
            }
        });

        if(!existingManga) {
            res.status(404).json({
                detail: "Manga not found"
            });
            return;
        }

        // Check that the users preference for this record already exists
        const existingPreference = await prisma.userMangaPreference.findUnique({
            where: {
                userId_mangaId: {
                    userId: user.id,
                    mangaId: existingManga.id, 
                }
            }
        });

        if(!existingPreference) {
            res.status(404).json({
                detail: "The user does not have existing preferences for this manga"
            });
            return;
        }

        // Update the users preference for this manga
        const data: Prisma.UserMangaPreferenceUpdateArgs['data'] = {}

        if(body.mangaAccessLink) {
            data.mangaAccessLink = body.mangaAccessLink;
        }

        if(body.mangaReleaseDay) {
            data.mangaReleaseDay = body.mangaReleaseDay; 
        }

        if(body.sendNotifications !== undefined) {
            data.sendNotifications = body.sendNotifications;
        }

        if(body.tierListRank) {
            data.tierListRank = body.tierListRank;
        }

        await prisma.userMangaPreference.update({
            where: {
                userId_mangaId: {
                    userId: user.id,
                    mangaId: existingManga.id,
                }
            },
            data
        })

        res.status(200).json({
            detail: "Successfully updated the user's preferences for this manga"
        })
    });

// Returns a list of all the users manga preference settings
// If the client passes page and limit query parameters, then the response will be paginated
// Otherwise it will not be paginated
mangaRouter.get("/user-manga-preferences", async (req, res) => {
    const user = req.user!;

    const parsed = getUserMangaPreferencesSchema.safeParse(req.query);

    if(!parsed.success) {
        res.status(400).json({
            detail: `Request body is not valid ${parsed.error.message}`
        });
        return;
    }

    const queryParams = parsed.data;
    const page = queryParams.page;
    const limit = queryParams.limit;
    const mangaReleaseDay = queryParams.mangaReleaseDay;
    const tierListRank = queryParams.tierListRank;

    const where: Prisma.UserMangaPreferenceFindManyArgs['where'] = {}

    if(mangaReleaseDay) {
        where.mangaReleaseDay = mangaReleaseDay;
    }

    if(tierListRank) {
        where.tierListRank = tierListRank;
    }

    const count = await prisma.userMangaPreference.count({
        where,
    });

    // If there is a limit and page query param then return a paginated response, otherwise return an unpaginated response
    if(limit && page) {
        const skip = page * limit;

        const mangaPreferences = await prisma.userMangaPreference.findMany({
            take: limit,
            skip,
            orderBy: { lastUpdatedAt: 'asc' },
            where: {
                userId: user.id,
                ...where,
            },
            include: {
                manga: {
                    select: {
                        mangaDexId: true
                    }
                }
            }
        })

        res.status(200).json({
            data: mangaPreferences,
            count,
        });
        return;
    } else {
        // Find all manga preferences belonging to the user
        const mangaPreferences = await prisma.userMangaPreference.findMany({
            where: {
                userId: user.id,
                ...where, 
            },
            include: {
                manga: {
                    select: {
                        mangaDexId: true
                    }
                }
            }
        });

        res.status(200).json({
            data: mangaPreferences,
            count,
        });
        return;
    }
});

// Returns a list of manga recomendations based on a manga
mangaRouter.get("/:id/recommended", async (req, res) => {
    // Validate the request body
    const mangaId = req.params.id;

    // Fetch recommendations from MangaDex
    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/recommendation?order[score]=desc`);
    
    // Handle fetching errors
    if(!response.ok) {
        console.error("Failed to fetch manga recommendations from MangaDex");

        res.status(404).json({
            detail: "Failed to fetch manga recommendations from MangaDex"
        });

        return;
    }

    const data = await response.json();

    // Return recomended manga
    res.status(200).json(data);

});

// Returns the details of a specific manga
mangaRouter.get("/:id", async (req, res) => {
    const mangaId = req.body.mangaId;

    const response = await fetch(`https://api.mangadex.org/manga/${mangaId}`)

    if(!response.ok) {
        console.error("Failed to fetch details for a manga")
        
        res.status(404).json({
            detail: "Failed to fetch details for a manga"
        });
        
        return;
    }

    const data = await response.json();

    res.status(200).json(data);
});

