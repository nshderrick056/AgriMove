# AgriMove - Agricultural Logistics & Smart Transportation Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-0C0D0E?style=flat&logo=render&logoColor=white)](https://agrimove-0n1y.onrender.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)

---

## 1. Project Title

# AgriMove

**AgriMove** is a full-stack smart agricultural logistics platform connecting farmers with produce transporters, streamlining farm-to-market supply chains through real-time tracking, intelligent route visualization, job dispatching, and digital proof of delivery.

---

## 2. Project Description

**AgriMove** exists to bridge the logistical gap between rural farmers and commercial agricultural transporters. Smallholder farmers often struggle with high transport costs, unreliable pickup schedules, and limited visibility into produce delivery. Transporters, on the other hand, struggle to optimize vehicle capacity and manage job schedules efficiently.

AgriMove solves these problems by providing:
- A **Farmer Portal** to post cargo dispatch requests, calculate delivery costs, and track real-time driver locations on interactive maps.
- A **Transporter / Driver Portal** featuring a job discovery map, turn-by-turn Drive Mode navigation, digital proof of delivery upload, and earnings tracking.
- An **Admin Command Dashboard** for platform oversight, driver/farmer user status management, system activity logs, and complaint resolution.

---

## 3. Features

### 🌾 Farmer Features
- **Cargo Dispatch Requests:** Specify cargo type, weight (kg), pickup location, and destination.
- **Live Interactive Map Tracking:** Track assigned driver location and route progression in real time.
- **Cost Estimation:** Automated shipping cost calculation displayed in local currency (RWF).
- **Delivery Milestone Notifications:** Real-time alerts when cargo is dispatched, en route, nearby, or delivered.
- **Complaint & Support Desk:** Submit issues directly to system administrators.

### 🚚 Transporter / Driver Features
- **Job Discovery Map:** Explore unassigned delivery requests geographically on an interactive map.
- **Job Acceptance & Management:** Accept or reject jobs with one click.
- **Drive Mode Navigation:** Integrated map navigation interface showing active routes, turn-by-turn context, and live driver updates.
- **Digital Proof of Delivery:** Capture and upload photo proof of completed deliveries directly via camera or file upload.
- **Earnings & Trip Analytics:** Monitor completed trips, earnings overview, and trip history.

### 🛡️ Admin Features
- **Executive Metrics Dashboard:** Overview of total deliveries, active drivers, total revenue, and registered users.
- **User Management:** Monitor, activate, or suspend Farmer and Transporter accounts.
- **Delivery Oversight:** Full visibility across all active, pending, and past deliveries with cancellation/deletion controls.
- **Complaint Resolution Workspace:** Resolve customer tickets and monitor support health.
- **Audit System Logs:** Track system-level activities and security events.

---


## 5. Tech Stack

### Frontend
- **Framework & Build:** React 18, Vite 6, TypeScript
- **Styling & UI:** Tailwind CSS v4, Radix UI Primitives, Lucide React Icons, Framer Motion
- **Maps & Geolocation:** Mapbox GL JS, Leaflet, React Leaflet, React Map GL
- **Form & State Management:** React Router v7, React Hook Form
- **Data Visualization:** Recharts

### Backend
- **Runtime & Framework:** Node.js, Express.js (v5), TypeScript (`tsx`)
- **Database & ORM:** PostgreSQL, Prisma ORM (v7) with `@prisma/adapter-pg`
- **Authentication:** JSON Web Tokens (JWT), Bcrypt.js, CORS middleware
- **File Uploads:** Multer (Digital Proof of Delivery media storage)
- **Notifications & Mail:** Nodemailer (SMTP email verification & password resets)

---

## 6. Project Structure

```
AgriMove/
│
├── AgriMove/                 # Frontend Web Application (React + Vite)
│   ├── public/               # Static assets & icons
│   ├── src/
│   │   ├── components/       # Reusable UI components & map layers
│   │   ├── pages/            # Role-based views (Farmer, Driver, Admin)
│   │   ├── services/         # API integration services
│   │   ├── context/          # Auth & App state contexts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── App.tsx           # Route setup & navigation
│   │   └── main.tsx          # Application entry point
│   ├── .env.example          # Frontend environment variables template
│   ├── package.json          # Frontend dependencies & scripts
│   ├── vite.config.ts        # Vite bundle configuration
│   └── README.md             # Project documentation
│
└── backend/                  # Backend REST API Server (Express + Prisma)
    ├── prisma/
    │   └── schema.prisma     # Database schema, enums & models
    ├── src/
    │   ├── controllers/      # Auth, Farmer, Driver & Admin logic
    │   ├── middleware/       # JWT auth & role validation middleware
    │   ├── routes/           # Express API route declarations
    │   ├── lib/              # Database client & seed utilities
    │   └── index.ts          # Express server entry point
    ├── uploads/              # Proof of delivery media storage
    ├── .env                  # Backend environment secrets
    ├── package.json          # Backend dependencies & scripts
    └── tsconfig.json         # TypeScript configuration
```

---

## 7. Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database engine installed and running local/remote
- Git CLI

### Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/nshderrick056/AgriMove.git
   cd AgriMove
   ```

2. **Configure & Start Backend:**
   ```bash
   cd backend
   npm install

   # Generate Prisma Client & Migrate Database Schema
   npx prisma generate
   npx prisma db push
   ```

3. **Configure & Start Frontend:**
   ```bash
   cd ../AgriMove
   npm install
   ```

---

## 8. Environment Variables

### Frontend Configuration (`AgriMove/.env`)
Create a `.env` file inside the `AgriMove` directory:
```env
# Mapbox public access token (https://account.mapbox.com)
VITE_MAPBOX_TOKEN=pk.your_mapbox_public_token_here

# Backend REST API Endpoint URL
VITE_API_URL=http://localhost:5000/api
```

### Backend Configuration (`backend/.env`)
Create a `.env` file inside the `backend` directory:
```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/agrimove?schema=public"

# Authentication & Server configuration
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=5000

# SMTP Server settings for email notifications & password reset
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password
```

---

## 9. Running the Application

### 1. Start the Backend API Server
```bash
cd backend
npm run dev
```
> The API server will start on `http://localhost:5000`.

### 2. Start the Frontend Application
In a separate terminal window:
```bash
cd AgriMove
npm run dev
```
> The React application will start on `http://localhost:5173`.

---

## 10. Usage

1. **Register / Login:**
   - Create an account and select either **Farmer** or **Transporter (Driver)** role.

2. **As a Farmer:**
   - Navigate to the **New Delivery** tab.
   - Enter your cargo details (e.g., 500kg Maize), specify pickup & destination locations.
   - Submit the order and watch the real-time status as a driver accepts and transports your goods.

3. **As a Transporter (Driver):**
   - Access **Available Jobs** on your interactive job map.
   - Accept an order and switch to **Drive Mode**.
   - Navigate to the pickup/drop-off locations, update delivery status (`EN_ROUTE` -> `DELIVERED`), and attach a photo proof of delivery.

4. **As an Admin:**
   - Log in using administrative credentials.
   - Monitor live system performance, user statuses, resolve complaints, and inspect audit logs.

---

## 11. API Documentation

### 🔑 Authentication (`/api/auth`)
| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/auth/signup` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `POST` | `/api/auth/forgot-password` | Request password reset token via email |
| `POST` | `/api/auth/reset-password` | Reset password using valid token |
| `POST` | `/api/auth/verify-email` | Confirm user email address |

### 🌾 Farmer Endpoints (`/api/farmer`) *(Requires JWT + FARMER Role)*
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/farmer/dashboard` | Get farmer statistics & summary |
| `GET` | `/api/farmer/deliveries` | List all farmer deliveries |
| `POST` | `/api/farmer/deliveries` | Create a new delivery request |
| `DELETE` | `/api/farmer/deliveries/:id` | Cancel a pending delivery request |
| `GET` | `/api/farmer/track/:id` | Track delivery status & driver coordinates |
| `POST` | `/api/farmer/complaints` | Submit a service complaint ticket |

### 🚚 Transporter Endpoints (`/api/driver`) *(Requires JWT + TRANSPORTER Role)*
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/driver/dashboard` | Get driver earnings & performance dashboard |
| `GET` | `/api/driver/jobs` | Browse unassigned delivery requests |
| `POST` | `/api/driver/jobs/:id/accept` | Accept a delivery request job |
| `PATCH` | `/api/driver/active/:id/status` | Update active delivery status (`EN_ROUTE`, `DELIVERED`) |
| `POST` | `/api/driver/active/:id/proof` | Upload proof of delivery photo |
| `GET` | `/api/driver/earnings` | Fetch driver earnings breakdown |

### 🛡️ Admin Endpoints (`/api/admin`) *(Requires JWT + ADMIN Role)*
| Method | Endpoint | Description |
|:---|:---|:---|
| `GET` | `/api/admin/dashboard` | System-wide statistics & platform health |
| `GET` | `/api/admin/users` | List registered platform users |
| `PATCH` | `/api/admin/users/:id/status` | Update user status (`Active` / `Suspended`) |
| `GET` | `/api/admin/complaints` | View open user complaint tickets |
| `PATCH` | `/api/admin/complaints/:id/resolve` | Resolve a complaint ticket |
| `GET` | `/api/admin/logs` | Retrieve system audit logs |

---

## 12. Testing

```bash
# Run backend test suite
cd backend
npm test

# Verify frontend build compilation
cd AgriMove
npm run build
```

---

## 13. Deployment

🌐 **Live Application URL:** [https://agrimove-0n1y.onrender.com/](https://agrimove-0n1y.onrender.com/)

AgriMove is deployed and running live on **Render**.

### Live Environment Details
- **Production Site:** [https://agrimove-0n1y.onrender.com/](https://agrimove-0n1y.onrender.com/)
- **Hosting Platform:** Render

### Deployment Process

#### Frontend Deployment (Render)
1. Build the production output bundle:
   ```bash
   cd AgriMove
   npm run build
   ```
2. Deploy the generated `dist/` static output directory to Render Web Service / Static Site.
3. Configure environment variables (`VITE_MAPBOX_TOKEN`, `VITE_API_URL`) in the Render environment settings dashboard.

#### Backend Deployment (Render)
1. Deploy the `backend/` project directory as a Node.js Web Service on Render.
2. Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `SMTP_*`).
3. Run database migrations on deployment build/start command:
   ```bash
   npx prisma db push
   npm start
   ```

---

## 14. Contributing

Contributions to **AgriMove** are warmly welcomed!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git checkout -b feature/AmazingFeature`).
5. Open a Pull Request.

---

## 15. License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 16. Author

**Derrick Gatete**

- **GitHub:** [nshderrick056](https://github.com/nshderrick056)
- **Repository:** [AgriMove](https://github.com/nshderrick056/AgriMove)

---

## 17. Future Improvements

- 📱 **Mobile Application:** React Native / Flutter cross-platform app for driver offline tracking.
- 🤖 **AI Route & Batching Optimization:** Smart grouping of neighboring farm pickups to optimize vehicle loading.
- 💬 **SMS Alert System:** Integration with Twilio / Africa's Talking for instant offline notifications.
- 📄 **PDF Report Exporting:** Export delivery histories, financial receipts, and audit logs.
- 🌐 **Multi-Language Support:** Localized interfaces in Kinyarwanda, French, and English.

---

## 18. Acknowledgements

- [React](https://react.dev/) & [Vite](https://vitejs.dev/) - Modern web framework & lightning-fast build tool
- [Prisma ORM](https://www.prisma.io/) - Next-generation Node.js & TypeScript ORM
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework for Node.js
- [Mapbox GL JS](https://www.mapbox.com/) & [Leaflet](https://leafletjs.com/) - Interactive mapping solutions
- [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/) - Responsive styling & accessible UI components
- [Lucide Icons](https://lucide.dev/) - Beautiful, consistent icon set