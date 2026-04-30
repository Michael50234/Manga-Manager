// Resource Types
export type User = {
    id: string,
    bio: string
    email: string,
    nickname: string,
    createdAt: Date,
    lastUpdatedAt: Date,
};

export type Tag = {
    id: string,
    name: string,
};

export type Manga = {
  id: string,
  title: string,
  // Author name
  author: string,
  description: string,
  tags: Tag[],

  status: "completed" | "ongoing" | "hiatus" | "canceled",
  latestChapter: string,
  latestChapterId: string,
  lastUpdatedAt: string,

  coverImageUrl: string,
};

export type FavouriteMangaObject = {
    id: string;
    mangaDexId: string;
    title: string;
    lastUpdatedAt: Date;
    createdAt: Date;
};

export type TierListRank = "GodTier" | "S" | "A" | "B" | "C" | "D" | "F" | "Dropped" | "Unranked";

export type DaysOfWeek= "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export type UserMangaPreference = {
    mangaAccessLink: string,
    sendNotifications: boolean,
    mangaReleaseDay: DaysOfWeek | "",
    tierListRank: TierListRank
};

// Backend API Response Types
export type ErrorResponse = {
    detail: string,
};

export type UserMangaPreferenceResponse = {
    id: string,
    manga?: {
        mangaDexId: string;
    },
    mangaAccessLink: string | null,
    sendNotifications: boolean,
    mangaReleaseDay: DaysOfWeek | null,
    tierListRank: TierListRank,
    lastUpdatedAt: Date,
    createdAt: Date,
    userId: string,
    mangaId: string,
};


