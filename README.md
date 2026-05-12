# Manga Manager

## Introduction 
Welcome to the github repository for my project **Manga Manager**! Manga manager solves a problem that many manga/manhwa readers have, keeping track of the series they are following and where they read those series. Manga manager lets users store keep track of the series the are reading and the sites where they are reading them all in one place. Plus, it lets users create an ongoing tierlist, helps users see which series come out on which days, and can send user's email notifications, informing them what series are updated
each day.

## Project Overview

The core functionality of this Manga Manager is based around CRUD operations for user manga preferences. User manga preferences are used to store the user's set release date and access link for the manga, as well as the tier list rank of a manga. The app also features a user-friendly interface that allows users to access the CRUD actions and view database data, such as manga preferences or profile data, and manga data from the MangaDex api.

### Frontend

- Technologies Used: Typescript, MUI, React, Next.js
- Description: The frontend provides an interactive interface that allows users to create and manage their manga preferences, search for new manga, and maintain a tierlist of their manga rankings. It also lets user's customize their profile information and view their followed and favourited manga. It uses a protected page component and a global user state for authentication and authorization.

### Backend
- Technologies Used: Typescript, Express, NodeJS, Zod, Redis, BullMQ
- Description: The backend saves data to the database, serves data from the database to the frontend, and enforces authentication and authorization. Authentication is implemented using JWT cookies, verifying user identity and securing API requests, and authorization logic is handled using custom middleware, allowing control to access to resources based on ownership. The backend uses BullMQ and Redis to send daily email notifications to users about their followed manga.

## Database
- Technologies Used: Typescript, Prisma, Postgres
- Description: The database allows for the persistence of user manga preferences, user information, and manga information. It also defines relationships between different models/tables, such as manga preference ownership, allowing for efficent data retrival and connecting related data.
