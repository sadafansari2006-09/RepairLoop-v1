# RepairLoop
A full-stack repair marketplace that connects people who need repairs with local repairers.
RepairLoop allows users to submit broken-item repair requests, upload images, receive repair estimates from repairers, choose a repairer, and track the repair job until completion.

Live Demo
[RepairLoop](https://repairloop-frontend.onrender.com)

GitHub
[Repository](https://github.com/sadafansari2006-09/RepairLoop-v1)

Features

# For Item Owners
- Create an account and log in
- Add items that need repair
- Upload images of damaged items
- Create repair requests
- Receive repair estimates from repairers
- View repairer estimates
- Select a repairer
- Track repair progress
- View repair history and profile

# For Repairers
- Create a repairer account
- View available repair requests
- View item details and images
- Submit repair estimates
- View assigned repair jobs
- Start a repair
- Mark repairs as completed
- Add repair notes

---

Tech Stack

# Frontend
- React
- Vite
- React Router
- JavaScript
- Custom CSS

# Backend
- Node.js
- Express.js
- REST APIs

# Database & Services
- Supabase PostgreSQL
- Supabase Authentication
- Supabase Storage

# Deployment
- Render
- GitHub

---

# How It Works

```text
Owner
  ↓
Creates Item
  ↓
Uploads Item Image
  ↓
Creates Repair Request
  ↓
Repairers View Request
  ↓
Repairers Submit Estimates
  ↓
Owner Selects Repairer
  ↓
Repair Job Created
  ↓
Repairer Starts Repair
  ↓
Repair Completed

 Architecture

                RepairLoop
                    |
        ┌───────────┴───────────┐
        ↓                       ↓
    Frontend                 Backend
    React + Vite             Node + Express
        |                       |
        └───────────┬───────────┘
                    ↓
                 Supabase
          ┌─────────┼─────────┐
          ↓         ↓         ↓
         Auth       DB      Storage
                  PostgreSQL   Images

Authentication

RepairLoop uses Supabase Authentication.
After login, the frontend receives an authentication session and access token.
The token is sent to the Express backend using:        
Authorization: Bearer <access_token>
The backend verifies the authenticated user before performing protected operations.

Running Locally
1. Clone the repository
git clone https://github.com/sadafansari2006-09/RepairLoop-v1.git
cd RepairLoop-v1
2. Install frontend dependencies
npm install
3. Start the frontend
npm run dev
The frontend will run on:
http://localhost:5173
4. Start the backend
Open another terminal:
cd server
npm install
node server.js
The backend will run locally on:
http://localhost:5000

Deployment:
The project is deployed using:
Frontend: Render Static Site
Backend: Render Web Service
Database: Supabase PostgreSQL
Authentication: Supabase Auth
Storage: Supabase Storage

Future Improvements:
Repairer ratings and reviews
Location-based repairer discovery
Online payments
Real-time notifications
Chat between owners and repairers
Repair status notifications
Advanced repairer profiles
Better search and filtering

Built as a full-stack web development project to explore authentication, REST APIs, database integration, file storage, role-based workflows, and deployment.