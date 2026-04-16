import express from "express";

const mangaRouter = express.Router();


// Allows users to access their preferences for a specific manga
// The id is the id of the manhwa
mangaRouter.route("/:id/user-manga-preference")
    .get((req, rest) => {
    
    })
    .post((req, rest) => {
    
    })
    .patch((req, rest) => {
    
    })


    
// Returns the details of a specific manhwa
// The id is the id of the manhwa
mangaRouter.get("/:id", (req, rest) => {
    
});

mangaRouter.route("/favourites")
    // Returns the users favourite series
    .get((req, rest) => {
    
    })
    // Adds a series to the users favourite series
    .post((req, rest) => {
    
    })

// Gets the data for the users personal tierlist
mangaRouter.get("/tier-list", (req, rest) => {
    
})

// Returns 30 random manga 
mangaRouter.get("/")