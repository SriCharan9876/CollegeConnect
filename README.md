# CollegeConnect

CollegeConnect is a comprehensive web platform designed to streamline the college selection and admission process. It provides prospective students with tools to explore colleges, predict admission chances, compare institutions, and engage in community discussions. 

## Architecture

The project follows a standard Client-Server architecture, separated into two distinct environments:

- **Frontend Application:** A modern React-based application handling the user interface and client-side routing.
- **Backend API:** A RESTful API serving data, managing business logic, and handling database interactions securely.

This decoupling allows for scalable development, independent deployments, and clear separation of concerns.

## Tech Stack

### Frontend
- **Framework:** Next.js (version 16)
- **Library:** React (version 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (version 4)
- **HTTP Client:** Axios
- **Notifications:** React-Toastify

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js (version 5)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt for password hashing
- **Middleware:** CORS configured for secure cross-origin resource sharing

## Key Features

1. **College Exploration:** A dedicated section to browse and discover various colleges with detailed information.
2. **College Predictor:** An algorithm-driven feature that estimates admission chances based on user-provided academic metrics.
3. **Comparison Tool:** Allows users to select multiple colleges and compare them side-by-side across various parameters (e.g., fees, placement statistics, infrastructure).
4. **Community Discussion Forum:** A platform for students to ask questions, share experiences, and connect with peers or alumni.
5. **MySpace (User Dashboard):** A personalized dashboard managing user profiles, saved colleges, and forum activity.
6. **Secure Authentication:** Robust user signup, login, and session management using JWT.

## Novelty

CollegeConnect distinguishes itself by consolidating disjointed parts of the college application journey into a single unified platform. Typically, students must use separate websites for admission prediction, accessing college data, and participating in forums. CollegeConnect integrates an interactive predictor, a side-by-side comparison engine, and a community discussion board, ensuring a continuous and informed user experience without context switching.

## Usage and Setup Instructions

### Prerequisites
- Node.js (version 20 or higher recommended)
- PostgreSQL database (or Neon Serverless account)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   Create a `.env` file in the `backend` directory and configure the required variables:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_secure_secret"
   PORT=5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Environment Configuration:
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000/api"
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Access the application at `http://localhost:3000`.

## Project Structure

- `/frontend`: Contains the Next.js application, React components, pages, and client-side services.
- `/backend`: Contains the Express.js server, route definitions, controllers, middleware, and database configuration.
