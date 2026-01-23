🌍 Safarify — A Trip Note & Travel Planning App

Safarify is a modern trip note and travel planning web application that helps users plan, organize, and track their trips efficiently.
It focuses on providing a clean user experience, structured trip management, and seamless interaction through an intuitive dashboard with light and dark themes.

Safarify is designed as a real-world, product-style project, showcasing frontend UI/UX excellence, backend logic, and database design.

✨ Key Highlights

User-centric UI/UX with light & dark mode

Structured trip planning and tracking

Clean dashboard experience

Scalable frontend and backend architecture

Resume-ready, real-world project design

🚀 Core Features
🧳 Trip Management

Create and manage trips

View recent and ongoing trips

Detailed trip overview with itinerary

Public itinerary view & trip sharing

🗺️ Planning & Discovery

City search functionality

Activity search and selection

Budget view for trip planning

Activity duration handling with proper validation

👤 User Profile & Settings

User profile dashboard

Profile image upload

Editable personal details

Profile settings management

🎨 UI / UX Experience

Fully responsive layout

Light & Dark mode toggle

Clean navigation with intuitive flow

Password visibility toggle (eye icon)

Branding with custom logo and visuals

⚙️ Backend & Database

Well-structured API routes

Service-based backend architecture

Prisma ORM with schema design

Database seeding support

Optimized activity and city workflows

🛠 Tech Stack
Frontend

React (Vite)

JavaScript (ES6+)

HTML5

CSS3 (Global styling)

Context API (Theme & User state)

Backend

Node.js

Express.js

Prisma ORM

Database

PostgreSQL

📂 Project Folder Structure
Project_0.1/
│
├── frontend/
│   ├── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   ├── context/
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── UserContext.jsx
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   ├── trips/
│   │   │   │   ├── TripList.jsx
│   │   │   │   ├── TripDetails.jsx
│   │   │   │   ├── CreateTrip.jsx
│   │   │   │   ├── ItineraryView.jsx
│   │   │   │   ├── PublicItinerary.jsx
│   │   │   │   ├── ShareTrip.jsx
│   │   │   │   ├── CitySearch.jsx
│   │   │   │   ├── ActivitySearch.jsx
│   │   │   │   ├── BudgetView.jsx
│   │   │   ├── profile/
│   │   │   │   ├── ProfileSettings.jsx
│   │   ├── styles/
│   │   │   ├── global.css
│   │   ├── main.jsx
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   ├── seed.js
│   ├── routes/
│   │   ├── activity.routes.js
│   │   ├── city.routes.js
│   ├── services/
│   │   ├── activity.service.js
│   │   ├── city.service.js
│   ├── api/
│   │   ├── activities.api.js
│
├── README.md
└── .gitignore

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/manvithknm54/travel-platform-project.git

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

3️⃣ Backend Setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm start

🧩 Development Phases
🔹 Phase 1 — Foundation

Project setup

Basic routing and UI structure

Initial trip modules

🔹 Phase 2 — Core Features

Trip dashboards (recent & ongoing)

Trip creation workflow

Profile management & image upload

Bug fixes and UX refinements

🔹 Phase 3 — Backend & Database

Prisma schema improvements

API and service layer optimization

Activity & city workflows

Database seeding

🔹 Phase 4 — UI/UX & Theming

Light & Dark mode implementation

Global UI/UX overhaul

Improved navigation & accessibility

Branding with logo and visuals

📌 Future Enhancements

Authentication & authorization (JWT)

Payment integration

Trip analytics dashboard

Notifications & reminders

Mobile-first optimization

Cloud deployment

👨‍💻 Developer

Project Name: Safarify
Type: Trip Note & Travel Planning Web App

This project was built as a portfolio and learning project, focusing on real-world development practices, clean architecture, and user-focused design.

⭐ Why Safarify?

Safarify is not just a UI project — it demonstrates:

Product thinking

Full-stack development skills

Database & backend knowledge

Professional Git workflow

Scalable and maintainable design
