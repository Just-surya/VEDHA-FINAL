# Vedha — Student Management Dashboard (Term 2)

**Vedha** (वेद) is a modern, responsive student management and scholastic performance dashboard built for school staff and academic coordinators. It delivers real-time visibility into academic marks, attendance benchmarks, class distributions, and student records across Classes 9 and 10.

---

## 🛠 Tech Stack

### Frontend (SPA)
- **Framework**: React 19 + Vite (JavaScript)
- **Styling**: Tailwind CSS v4 (Custom dark palette `#12111f`, card surface `#1c1b30`, soft violet `#8b85ff`, amber `#f59e0b`)
- **Routing**: React Router v7 with route-level code splitting (`React.lazy` + `Suspense`) and `<ProtectedRoute>` guards
- **API Client**: Axios instance with centralized `VITE_API_URL` configuration and JWT bearer interceptor
- **Charts & Visualization**: Recharts (Custom dark-themed bar charts and line charts)
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel with `vercel.json` SPA rewrite rules

### Backend (REST API)
- **Runtime**: Node.js + Express
- **Authentication**: JWT (JSON Web Tokens) with `bcryptjs` password hashing
- **Security**: Configurable CORS with `FRONTEND_URL` origin restriction
- **Database**: **Supabase PostgreSQL** cloud database (with automatic fallback to local store if credentials not yet configured)
- **Deployment**: Deployable to Render, Railway, Fly.io, Heroku, or Supabase Edge Functions

---

## 🏛 Project Architecture

```
GitHub
│
├── React/Vite frontend (src/)
│       │
│       └── Deployed to Vercel (dist/)
│               │
│               ↓ HTTPS / REST
│
└── Node.js/Express backend (backend/)
        │
        └── Deployed to Cloud Hosting (Render / Railway)
                │
                ↓ Secure Database Connection
                │
        Supabase PostgreSQL Cloud
```

### Folder Structure
```
VEDHA2/
├── backend/                    # Production Node.js + Express REST API
│   ├── src/
│   │   ├── config/             # Environment & Supabase client configuration
│   │   ├── controllers/        # authController, studentController, statsController
│   │   ├── middleware/         # JWT auth middleware, centralized error handling
│   │   ├── routes/             # /api/auth, /api/students, /api/stats
│   │   ├── app.js              # Express app setup, CORS, JSON parser
│   │   └── server.js           # Server entry point on PORT
│   ├── scripts/
│   │   └── migrateData.js      # Script to migrate local data into Supabase
│   ├── schema.sql              # Supabase PostgreSQL schema DDL & seed queries
│   ├── .env.example            # Backend environment variables template
│   └── package.json            # Backend dependencies & scripts
│
├── src/                        # React Frontend
│   ├── components/             # Reusable UI primitives (Dashboard, Students, Layout, Common)
│   ├── context/                # AuthContext (JWT session & persistence)
│   ├── hooks/                  # useAuth, useStudents custom hooks
│   ├── pages/                  # Lazy-loaded views (SignIn, Dashboard, Students, NotFound)
│   ├── routes/                 # ProtectedRoute, AppRoutes with Suspense code splitting
│   ├── services/               # Axios API client, studentService, statsService
│   └── utils/                  # Grade and stats calculation domain utilities
│
├── vercel.json                 # Vercel SPA routing configuration
├── db.json                     # Initial seed reference dataset
├── package.json                # Project orchestration scripts
└── .env.example                # Frontend environment template
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Start Both Frontend and Backend Concurrently
```bash
npm run dev
```

This starts:
- **Backend API**: `http://localhost:5000` (`http://localhost:5000/api`)
- **Frontend App**: `http://localhost:3000`

### 3. Running Separately (Optional)
```bash
# Terminal 1: Run backend API
npm run server:dev

# Terminal 2: Run frontend client
npm run dev:client
```

---

## 🔐 Staff Sign-In & Demo Credentials

| Role | Username | Password |
|---|---|---|
| **Academic Coordinator** | `admin` | `admin123` |

> An **"Auto-fill"** helper button is embedded directly into the sign-in form for rapid evaluation and testing.

---

## 🗄️ Setting Up Supabase Cloud Database

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In the Supabase Dashboard, open the **SQL Editor**.
3. Copy the contents of `backend/schema.sql` and click **Run**.
   - This creates the `users`, `students`, `attendance_trend`, and `term_meta` tables with constraints, indexes, and initial seed data.

### 2. Configure Backend `.env`
Create `backend/.env` (using `backend/.env.example` as a template):
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Your Supabase Project Settings -> API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-or-anon-key

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
```

### 3. Migrate Local Data to Supabase
Run the automated migration script to populate Supabase with the seed dataset:
```bash
npm run migrate
```
The script reads `db.json`, hashes staff passwords with bcrypt, checks for duplicates, and upserts all records into your Supabase database.

---

## 🌐 Cloud Deployment

### 1. Deploy Backend (e.g. Render / Railway / Fly.io)
1. Push your repository to GitHub.
2. Create a new Web Service pointing to the `backend/` directory (or repository root).
3. Set Build Command: `cd backend && npm install`
4. Set Start Command: `node backend/src/server.js`
5. Configure Environment Variables on your hosting provider:
   - `PORT`: `5000` (or host provided)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-vedha-app.vercel.app`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `JWT_SECRET`: `your_secure_jwt_secret`

### 2. Deploy Frontend to Vercel
1. Import the repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api-domain.com/api`
6. Click **Deploy**. Vercel will automatically apply `vercel.json` rewrites for SPA routing.

---

## ⚡ Performance & Bundle Optimization

- **Code Splitting**: Route-level lazy loading (`React.lazy()` + `Suspense`) keeps the initial entry chunk at **324 kB** (gzip: **105 kB**).
- **On-Demand Loading**: Recharts and heavy dashboard visualizers load only when the `/dashboard` route is opened (`392 kB`).
- **No Warnings**: The production build produces 0 bundle warnings and builds in ~1.1 seconds.
