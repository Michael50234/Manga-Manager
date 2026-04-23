import { Manga } from "@/types";

// Takes a list of mangaDex manga and returns a list of client type manga objects
export async function getClientMangaFromMangaDexManga(mangaList: any): Promise<Manga[]> {
    // Create an list of the latest chapter ids
    const latestChapterIdList = mangaList.map((manga: any) => {
        return manga.attributes.latestUploadedChapter
    });

    // Get a hashmap mapping latest chapter ids to their chapter numbers
    const chapterIdToNumberMap = await getChapterIdToNumberMap(latestChapterIdList);


    // Create the list of client manga objects
    const clientMangaList: Manga[] = mangaList.map((manga: any) => {
        const coverArtObject = manga.relationships.find((relationship: any) => {
            return relationship.type === 'cover_art'
        })

        return {
            id: manga.id,
            title: getMangaDexMangaTitle(manga),
            author: manga.relationships[0].attributes.name,
            description: manga.attributes.description.en,
            tags: manga.attributes.tags.map((tag: any) => {
                return {
                    id: tag.id,
                    name: tag.attributes.name.en
                }
            }),
            status: manga.attributes.status,
            lastUpdatedAt: manga.attributes.updatedAt,
            latestChapter: chapterIdToNumberMap.get(manga.attributes.latestUploadedChapter),
            latestChapterId: manga.attributes.latestUploadedChapter,
            coverImageUrl: `https://uploads.mangadex.org/covers/${manga.id}/${coverArtObject.attributes.fileName}`
        }
    })

    return clientMangaList
}

// Takes a list of chapterIds and returns a map mapping each chapterId to a chapter number
export async function getChapterIdToNumberMap(chapterIdList: string[]) {
    const chapterIdtoNumberMap = new Map<string, string>();

    // Add the ids of the latest manga chapters to the searchParams
    const searchParams = new URLSearchParams();

    chapterIdList.forEach((chapterId) => {
        searchParams.append("ids[]", chapterId);
    })

    // Query for the details of the latest manga chapters
    const response = await fetch(`https://api.mangadex.org/chapter?${searchParams.toString()}`);

    const data = (await response.json()).data;

    // Create a hash map mapping chapter ids to their chapter number
    data.forEach((manga: any) => {
        chapterIdtoNumberMap.set(manga.id, manga.attributes.chapter)
    })

    return chapterIdtoNumberMap;
}

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
