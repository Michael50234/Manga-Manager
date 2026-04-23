// Resource Types
export type User = {
    id: string,
    bio: string
    email: string,
    nickname: string,
    createdAt: Date,
    lastUpdatedAt: Date,
}

export type Tag = {
    id: string,
    name: string,
}

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
  lastUpdatedAt: Date,

  coverImageUrl: string,
}


// Backend API Response Types
export type ErrorResponse = {
    detail: string,
}


