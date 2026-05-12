# Manga Manager

## Introduction 
Welcome to the GitHub repository for **Manga Manager**! Manga Manager solves a common problem many manga and manhwa readers face: keeping track of the series they follow and where they read them. The application allows users to organize the manga they are currently reading, store access links for reading sites, and manage everything in one place. Plus, the application lets users create and maintain personalized manga tier lists, view which followed series release on specific days, and sends daily email notifications about newly updated series.

## Project Overview

Manga Manager is a full-stack web application centered around CRUD operations for user manga preferences. Users can store manga release schedules, access links, and personalized tier list rankings. The application also provides an intuitive interface for managing preferences, viewing profile information, and browsing manga data fetched from the MangaDex API.

### Frontend

- **Technologies Used:** Typescript, MUI, React, Next.js
- **Description:** The frontend provides an interactive and responsive interface that allows users to search for manga, manage manga preferences, and maintain personalized tier lists. Users can also customize profile information and view followed or favourited manga. It uses a protected page component and a global user state for authentication and authorization.

### Backend
- **Technologies Used:** Typescript, Express, NodeJS, Zod, Redis, BullMQ
- **Description:** The backend hanldes data persistence, serves data from the database to the frontend, and enforces authentication and authorization. Authentication is implemented using JWT cookies, verifying user identity and securing API requests, and authorization logic is handled using custom middleware, allowing control to resources based on ownership. Redis and BullMQ are used to manage background jobs that send daily email notifications about followed manga releases.

### Database
- **Technologies Used:** Typescript, Prisma, Postgres
- **Description:** The database allows for the persistence of user manga preferences, user information, and manga data. It also defines relationships between different models/tables, such as manga preference ownership, allowing for efficent data retrival and connecting related data.
