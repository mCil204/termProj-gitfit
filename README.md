# GitFIT 🏋️

Personal fitness tracker — Node.js + Express + EJS + PostgreSQL.

## Project Structure

```
gitfit/
├── server.js              # Entry point
├── .env.example           # Copy to .env and fill in
├── package.json
├── db/
│   ├── pool.js            # PostgreSQL connection
│   └── schema.sql         # Run once to create tables
├── routes/
│   ├── auth.js            # Login, signup, logout
│   └── activities.js      # All CRUD + page routes
├── views/
│   ├── partials/
│   │   ├── header.ejs     # Nav + top bar (include in every page)
│   │   ├── footer.ejs     # Closing tags
│   │   └── activity-card.ejs
│   ├── auth/
│   │   └── login.ejs      # Login + signup (shared view)
│   ├── home.ejs           # Dashboard
│   ├── workouts.ejs       # Workout type picker
│   ├── activities.ejs     # Full activity history
│   ├── activity-form.ejs  # Add / Edit form
│   └── 404.ejs
└── public/
    └── css/
        └── style.css
```

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create your database
```bash
createdb gitfit
psql -d gitfit -f db/schema.sql
```

### 3. Configure environment
```bash
cp .env.example .env
# Edit .env with your DATABASE_URL and a SESSION_SECRET
```

Your `.env` should look like:
```
DATABASE_URL=postgresql://localhost:5432/gitfit
SESSION_SECRET=some_long_random_string_here
PORT=3000
```

### 4. Run the app
```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Visit http://localhost:3000

## Routes

| Method | Path                        | Description              |
|--------|-----------------------------|--------------------------|
| GET    | /auth/login                 | Login page               |
| POST   | /auth/login                 | Submit login             |
| GET    | /auth/signup                | Signup page              |
| POST   | /auth/signup                | Submit signup            |
| POST   | /auth/logout                | Log out                  |
| GET    | /                           | Dashboard (home)         |
| GET    | /workouts                   | Workout type picker      |
| GET    | /activities                 | Full activity history    |
| GET    | /activities/new             | Add activity form        |
| POST   | /activities                 | Save new activity        |
| GET    | /activities/:id/edit        | Edit activity form       |
| POST   | /activities/:id/edit        | Save edited activity     |
| POST   | /activities/:id/delete      | Delete activity          |

## Deploying to Render

1. Push your project to GitHub
2. Create a new **Web Service** on Render pointing to your repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables: `DATABASE_URL`, `SESSION_SECRET`, `PORT`
6. Create a **PostgreSQL** database on Render and copy the connection string into `DATABASE_URL`
7. Run the schema: connect to your Render DB and paste in `db/schema.sql`
