# PuddleTrails

PuddleTrails is a collaborative trip planner that helps you organise a trip with friends or family in one place.

Instead of keeping your itinerary in one app, reservations in another, and all the important details buried in group chats, you can plan and manage your trip together.

**Live app:** https://puddletrails.amirana.me

## Features

- **Authentication** — Create an account, log in, and manage your session.
- **Trip management** — Create, edit, and delete trips.
- **Shared planning** — Invite people to a trip and manage their access.
- **Member roles** — Owners, editors, and viewers have different permissions.
- **Day-wise itinerary** — Organise activities by day and rearrange them as plans change.
- **Comments** — Discuss plans with other trip members.
- **Checklists** — Keep track of packing items and other trip tasks.
- **Reservations** — Store booking details alongside your trip.
- **Attachments** — Add files to trips, activities, and reservations.
- **Budget tracking** — Record expenses and see how they compare with your trip budget.

## Tech stack

**Frontend**
- React
- Vite
- JavaScript

**Backend**
- Node.js
- Express
- MongoDB
- Mongoose

**Other tools and services**
- JWT-based authentication
- Cloudinary for file uploads
- Vercel for frontend deployment
- Render for backend deployment

## Getting started

You'll need Node.js, pnpm, and a MongoDB database to run the project locally.

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Set up the frontend

```bash
cd frontend
pnpm install
```

Create a `.env` file in the `frontend` directory and add the API URL expected by the frontend.

For local development, this will point to your local backend.

Start the development server:

```bash
pnpm dev
```

### 3. Set up the backend

Open another terminal:

```bash
cd backend
pnpm install
```

Create a `.env` file in the `backend` directory with the required configuration, including:

- MongoDB connection string
- Authentication secrets
- Frontend URL for CORS
- Cloudinary credentials
- Any other environment variables used by the application

Start the backend:

```bash
pnpm dev
```

The backend runs on port `4000` in development by default, unless configured otherwise.

Make sure your frontend API URL and backend CORS settings match your local development URLs.

## Project structure

```text
PuddleTrails/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
│
└── backend/
    ├── src/
    └── package.json
```

The frontend and backend are maintained separately, with their own dependencies and development scripts.

## Deployment

The frontend and backend are deployed separately:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB

The live application is available at [puddletrails.amirana.me](https://puddletrails.amirana.me).

## What's next?

PuddleTrails is an ongoing project. The focus is on making collaborative trip planning easier and improving the experience based on how people use it.

---

Built as an independent project to make planning trips together a little less complicated.