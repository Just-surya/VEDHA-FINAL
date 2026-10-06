# Vedha — Student Management Dashboard (Term 2)

**Vedha** (वेद) is a modern, responsive student management and scholastic performance dashboard built for school staff and academic coordinators. It delivers real-time visibility into academic marks, attendance benchmarks, class distributions, and student records across Classes 9 and 10.

---

## 🛠 Tech Stack

- **Frontend Core**: React 19 + Vite (JavaScript)
- **Styling**: Tailwind CSS v4 (Custom dark palette `#12111f`, card surface `#1c1b30`, soft violet `#8b85ff`, amber `#f59e0b`)
- **Routing**: React Router v7 with protected route guards
- **API Client**: Axios with configured baseURL, interceptors, and error handling
- **Charts & Visualization**: Recharts (Custom dark-themed bar charts and line charts)
- **Icons**: Lucide React
- **Mock REST API**: `json-server` serving `db.json` on port `5000`
- **Process Orchestration**: `concurrently` to run Vite and json-server in a single command

---

## 🏛 Architecture Layers

The codebase enforces strict separation of concerns across 5 modular layers:

```
src/
├── components/          # UI Layer (Reusable primitives)
│   ├── common/          # LoadingSpinner, ErrorAlert, DeleteConfirmModal
│   ├── dashboard/       # StatCard, ChartCard, ClassAverageChart, GradeDistributionChart, 
│   │                    # AttendanceTrendChart, TopPerformersList
│   ├── layout/          # Navbar (brand, nav links, staff logout, mobile menu), Layout wrapper
│   └── students/        # StudentTable, StudentFormModal (Add/Edit), StudentViewModal
├── context/             # State Layer (Session & Auth Context)
│   └── AuthContext.jsx  # Staff authentication state, localStorage persistence, login/logout
├── hooks/               # State Layer (Custom React Hooks)
│   ├── useAuth.js       # Authentication hook
│   └── useStudents.js   # Student CRUD state hook (students, loading, error, refresh)
├── routes/              # Routing & Security Layer
│   ├── AppRoutes.jsx    # Page route declarations
│   └── ProtectedRoute.jsx # Guard redirecting unauthenticated users to /signin
├── services/            # Service Layer (Network & API communication)
│   ├── api.js           # Axios instance with VITE_API_URL and interceptors
│   ├── studentService.js # Full CRUD methods (getStudents, addStudent, updateStudent, deleteStudent)
│   └── statsService.js  # Attendance trends and term benchmark queries
├── utils/               # Domain Utilities
│   ├── gradeCalculator.js # Standardized grading logic (A, B, C, D, F) & badge styles
│   └── statsCalculator.js # Dynamic computation of term metrics from live student data
└── pages/               # UI Page Views
    ├── SignInPage.jsx   # Split-screen sign-in with validation and demo auto-fill
    ├── DashboardPage.jsx # Term 2 summary cards, 3 analytics charts, top performers
    ├── StudentsPage.jsx # Student records table, search, class filter, sorting, CRUD modals
    └── NotFoundPage.jsx # 404 fallback page
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone <repo-url>
cd VEDHA2
npm install
```

### 3. Run Development Environment
To start **both** the mock REST API (`json-server` on port `5000`) and the Vite frontend application concurrently:
```bash
npm run dev
```

The application will be accessible at:
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Mock REST API**: [http://localhost:5000](http://localhost:5000)

### 4. Running Components Separately (Optional)
If you prefer running the mock backend and Vite client in separate terminal windows:
```bash
# Terminal 1: Run json-server mock API
npm run api

# Terminal 2: Run Vite dev server
npm run dev:client
```

---

## 🔐 Staff Sign-In & Demo Credentials

Access to all dashboard pages is protected behind the staff authentication guard.

| Role | Username | Password |
|---|---|---|
| **Academic Coordinator** | `admin` | `admin123` |

> A one-click **"Auto-fill"** helper button is embedded directly into the sign-in form for rapid evaluation and testing.

---

## ✨ Features

### 1. Authentication & Security
- Split-screen design: Left solid purple brand panel with Devanagari **वेद** insignia, serif **Vedha** wordmark, and school mission tagline; Right dark credential form.
- Form validation with inline error highlights.
- Clear error notification on authentication failure with retry capability.
- Session persistence via `localStorage` with header synchronization and secure logout.
- All application routes except `/signin` are guarded by `<ProtectedRoute>`.

### 2. Term 2 Dashboard Overview
- **Four Dynamic Stat Cards** (computed dynamically from student records):
  - **Total students**: `12` (`+3 this term`, green)
  - **Average marks**: `72%` (`+2.1 vs last term`, green)
  - **Average attendance**: `89%` (`-0.8 vs last term`, red)
  - **Pass rate**: `92%` (`1 need support`, red)
- **Three Analytics Charts** in a single desktop row:
  - **Average Marks by Class**: Recharts bar chart for `10-A`, `10-B`, `9-A`, and `9-B` with soft violet (`#8b85ff`) bars.
  - **Grade Distribution**: Recharts bar chart covering 5 grade buckets (`A`, `B`, `C`, `D`, `F`) with amber (`#f59e0b`) bars.
  - **Attendance Trend**: Recharts line chart tracking staff attendance figures from June to November with purple line and amber indicator points.
- **Top Performers**:
  - Ranked leaderboard showing top scoring students (`Lakshmi Iyer 97%`, `Meera Menon 94%`, `Aarav Nair 88%`, `Joel Mathew 84%`, `Divya Pillai 81%`) with rank badges, muted class labels, and accent percentages.

### 3. Student Records Management (`/students`)
- Comprehensive table listing all students with name, class badge, marks with mini progress bar, attendance percentage, and grade badge.
- **Full CRUD Support**:
  - **Add Student**: Registration modal with validation (name required, class select, marks 0–100, attendance 0–100, dynamic real-time grade preview).
  - **View Student**: Detailed profile modal showing parent/guardian info, contact email, and academic standing.
  - **Edit Student**: Pre-populated update modal that calculates revised grades on the fly.
  - **Delete Student**: Modal confirmation prompt with target student name before deletion.
- **Search & Filtering**:
  - Real-time text search across student names and emails.
  - Class filter dropdown (`All Classes`, `10-A`, `10-B`, `9-A`, `9-B`).
  - Sorting options (`Highest Marks`, `Lowest Marks`, `Highest Attendance`, `Name A-Z`).
- Graceful loading spinners, error banners with retry buttons, and empty states.

---

## 🌐 Deployment (Static Frontend)

The application is built to be deployed seamlessly to platforms like **Vercel**, **Netlify**, or **Cloudflare Pages**.

### 1. Build for Production
```bash
npm run build
```
This produces an optimized production bundle inside the `dist/` directory.

### 2. Configure Backend API Endpoint
By default, the application connects to `http://localhost:5000`. In production, supply your API URL using the `VITE_API_URL` environment variable:

```bash
# In your Vercel / Netlify environment variables:
VITE_API_URL=https://your-api-domain.com
```

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel
```
Ensure rewrite rules redirect all paths to `index.html` (for client-side routing):
Create `vercel.json` if needed:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 4. Deploy to Netlify
When deploying to Netlify, add a `_redirects` file or `netlify.toml`:
```
/*    /index.html   200
```

> **Offline & Fallback Resilience**: The service layer includes a built-in localStorage fallback cache. Even if deployed as a standalone static demo without an active json-server backend, all CRUD operations and calculations remain fully functional and interactive in the user's browser!

---

## 📊 Seed Data Summary (`db.json`)

- **12 Students** evenly distributed across `10-A`, `10-B`, `9-A`, and `9-B`.
- Seed student profiles feature realistic Kerala-style names:
  1. *Lakshmi Iyer* (10-A) — 97% Marks, 96% Attendance (Grade A)
  2. *Meera Menon* (10-A) — 94% Marks, 95% Attendance (Grade A)
  3. *Aarav Nair* (10-A) — 88% Marks, 92% Attendance (Grade B)
  4. *Joel Mathew* (9-A) — 84% Marks, 90% Attendance (Grade B)
  5. *Divya Pillai* (10-B) — 81% Marks, 91% Attendance (Grade B)
  6. *Rohan Varghese* (9-B) — 76% Marks, 88% Attendance (Grade C)
  7. *Ananya Kurian* (10-B) — 71% Marks, 89% Attendance (Grade C)
  8. *Gautham Krishna* (9-A) — 68% Marks, 86% Attendance (Grade D)
  9. *Sneha Nambiar* (9-B) — 63% Marks, 93% Attendance (Grade D)
  10. *Ashwin Panicker* (10-B) — 58% Marks, 84% Attendance (Grade D)
  11. *Fathima Beevi* (9-A) — 50% Marks, 87% Attendance (Grade D)
  12. *Rahul Namboodiri* (9-B) — 34% Marks, 77% Attendance (Grade F — *Remedial support needed*)

---

## 📜 License

Licensed under the MIT License. Developed for Vedha School Staff.
