import express from "express";

const mangaRouter = express.Router();

// Id is the manga's id
// Allows users to access their preferences for a specific manga
mangaRouter.route("/:id/user-manga-preference")
    .get((req, rest) => {
    
    })
    .post((req, rest) => {
    
    })
    .patch((req, rest) => {
    
    })

mangaRouter.get("/:id", (req, rest) => {
    
});

// Gets the users favourited series
mangaRouter.get("/favourites", (req, rest) => {
    
})

// Gets the data for the users personal tierlist
mangaRouter.get("/tier-list", (req, rest) => {
    
})