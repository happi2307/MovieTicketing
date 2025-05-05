# Flick Find Movie Ticketing System

A full-stack movie ticketing system built with React (Vite), Flask, and MySQL.

## Features

- User authentication (login/signup)
- Customer and Admin roles
- Browse movies, theaters, and showtimes
- Book seats for shows
- View your bookings (customers)
- Admin dashboard to view all bookings, grouped by movie, theater, and screen
- Responsive UI with Shadcn UI components

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Shadcn UI
- **Backend:** Flask, Python, MySQL
- **Database:** MySQL

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x
- MySQL

### 1. Clone the repository

```sh
git clone <repo-url>
cd movie ticketing system
```

### 2. Setup the Database

- Create the database and tables using the provided schema (see `/docs/schema.sql` or use the SQL in this repo).
- Update `.env` in `/backend` with your DB credentials.

### 3. Backend Setup

```sh
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

### 5. Access the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

## Project Structure

```
movie ticketing system/
│
├── backend/
│   ├── app.py
│   └── ...
├── frontend/
│   ├── src/
│   ├── index.html
│   └── ...
├── README.md
└── ...
```

## Environment Variables

Create a `.env` file in `/backend`:

```
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=movieticketing
```

## Notes

- The favicon is a popcorn icon.
- Admin dashboard is accessible only to users with `UserType = 'Admin'`.
- All API routes are proxied via Vite (`vite.config.ts`).

## License

MIT
