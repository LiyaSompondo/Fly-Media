# Fly-Media

Fly Media is a full-stack built with **React (Vite)** in the frontend and **Express (Node.js)** on the backend. The platform supports features such as authentication, file uploads, notifications, and a client dashboard.

# Features
- User authentication (login & register pages)
- Dashboard with personalized client view
- File uploads with preview and storage
- Notifications system (UI-ready, API stubs)
- Calender & tasks intergration (in progress)
- Fully branded UI (Fly Media logo, red/black/white pallete)
- Deployment-ready (Netlify frontend, Render backend trials)
- Domain + SSL setup included

# Tech Stack
- **Frontend**: React + Vite + Axios
- **backend** : Express (Node.js)
- **Database**: MongoDB (Atlas cluster or local instance)
- **Styling** : Vanila CSS (no Tailwind)
- **Deployment**: Netlify (frontend), Render (backend)
- **Other** : DNS + SSL config

## Setup

# 1. Clone Repository
 ```bash
git clone https://github.com/LiyaSompondo/fly-media.git
cd fly-media

# 2. Install Dependencies

**Frontend**
cd frontend
npm install

**Backend**
cd backend
npm install

# 3. Environment Variables
create a .env file for both frontend and backend directories, based on the replectively provided .env.example.
cp .env.example

# 4. Run the Project
Frontend (React + Vite)

cd frontend
npm run dev

Backend (Express)

cd backend
npm run dev

