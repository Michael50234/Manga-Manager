// Takes a MangaDex manga and returns a title in a supported language or No Title
export function getMangaDexMangaTitle(manga: any) {
    const supportedLanguages = new Set(['ja-ro', 'en']);

    // Check the title attribute for a title in a supported language
    for(const language in manga.attributes.title) {
        if(supportedLanguages.has(language)) {
            return manga.attributes.title[language];
        }
    }

    // Check the altTitle attribute for a title in a supported language
    for(const altTitle of manga.attributes.altTitles) {
        for(const language in altTitle) {
            if(supportedLanguages.has(language)) {
                return altTitle[language];
            }
        }
    }

    // Return No Title if no title in a supported language is found
    return "No Title";
}