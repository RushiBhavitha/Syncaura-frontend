# Syncaura Frontend 🚀

Syncaura Frontend is a modern, scalable **React-based frontend application** built using **Vite** and **Tailwind CSS**.
It provides a dashboard-driven user interface for managing projects, tasks, chats, attendance, meetings, and more.

The project follows a **clean modular architecture** to ensure maintainability and smooth team collaboration.

---

## 📁 Repository Structure

This section explains the frontend folder structure and the purpose of each directory and important file.

```bash
FRONTEND/
│
├── public/
│   ├── background/        # Background images used across the app
│   ├── fonts/             # Custom fonts
│   ├── images/            # Static images
│   └── vite.svg
│
├── src/
│   ├── assets/            # Icons, images, and other static assets
│   │
│   ├── components/        # Reusable UI components
│   │   ├── admin        #admin component   
│   │   ├── AttendanceLeave/   #Attendance Leave component
│   │   ├── auth/          # Authentication components (SignIn, SignUp)
│   │   ├── chats/         # Chat components
│   │   ├── complaints/    # complaint components
│   │   ├── dashboard/     # Admin dashboard components
│   │   ├── Document/      # Documnet components
│   │   ├── Meeting/       # Meeting components
│   │   ├── notice/       # Notice components
│   │   ├── projects/      # Projects components
│   │   ├── userdashboard/ # User dashboard components
│   │   ├── FilterDropdown.jsx # animated reusable dropdown component
│   │   ├── SupportChatbot.jsx # Chatbot Component
│   │   └── MobileSidebar.jsx 
│   │ 
│   ├── constant/          # constant reusable folder
│   │   └── constant.js    # constant data
│   │ 
│   ├── layouts/           # Layout components
│   │   └── MainLayout.jsx # Common layout wrapper (Header, Sidebar)
│   │
│   ├── pages/             # Page-level components
│   │   ├── Attendance.jsx
│   │   ├── Admin.jsx
│   │   ├── Chat.jsx
│   │   ├── Complaints.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Documents.jsx
│   │   ├── Home.jsx
│   │   ├── Meetings.jsx
│   │   ├── Notice.jsx
│   │   ├── Projects.jsx
│   │   ├── Settings.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── Tasks.jsx
│   │   └── UserDashboard.jsx
│   │
│   ├── redux/             # Global state management
│   │   ├── slices 
│   │   │   └── themeSlice.js  # Theme (dark/light) Slice 
│   │   └── store.js # reduc store store
│   │
│   ├── App.jsx            # Root React component
│   └── main.jsx           # Application entry point
│
├── .gitignore             # Git ignored files and folders
├── eslint.config.js       # ESLint configuration
├── index.html             # HTML entry file
├── package.json           # Project dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── README.md              # Project documentation
└── vite.config.js         # Vite configuration
```

---

## Routes
* "/normal-dashboard" => **Normal dashboard Page**
* "/sign-up" => **Sign-Up Page**
* "/user-dashboard" => **User dashboard Page**
* "/meetings" => **Meeting Page**
* "/chat" => **Chat Page**
* "/complaints" => **Complaint Page**
* "/projects" => **Projects Page**
* "/attendance-leave" => **Attendance Leave Page**
* "/settings" => **Setting Page**
* "/" => **Home Page**
* "/notice" => **Notice Page**
* "/settings" => **Setting Page**
* "/admin" => **Admin Page**

## 🧩 Features Overview

### 📊 Dashboard

* Admin and User dashboards
* Statistics cards
* Interactive charts using **Chart.js**
* Fully responsive layouts

### 🔐 Authentication

* Sign In & Sign Up UI
* Role-based pages (Admin / User)
* Ready for JWT-based authentication

### 💬 Chat Module

* Real-time chat UI
* Designed for Socket.IO backend integration

### 📁 Project & Task Management

* Project listing and overview
* Task management UI
* Clean and intuitive design

### 📅 Attendance & Meetings

* Attendance tracking interface
* Meetings scheduling UI

### 🌗 Theme Support

* Light / Dark mode
* Global theme management using Zustand
* Tailwind CSS + CSS variables

---

## 🛠 Tech Stack

* **React.js**
* **Vite**
* **Tailwind CSS**
* **Zustand** (State Management)
* **Chart.js**
* **React Chart.js 2**
* **JavaScript (ES6+)**
* **HTML5 & CSS3**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone "https://github.com/your-org/syncaura-frontend.git"
cd  Syncaura-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

---

## 🔗 Backend Integration

This frontend is designed to work with the **Syncaura Backend** mono-repository, including:

* Authentication APIs
* CRUD services
* Attendance & leave management
* Real-time chat (Socket.IO)

API base URLs can be configured using environment variables.

---

## 👥 Team Collaboration Rules

* Single Git repository for frontend
* Follow the modular folder structure
* **Do not commit** `node_modules`
* Always pull before pushing:

```bash
git pull origin main
```

---

## 🚫 Ignored Files

The following files are excluded using `.gitignore`:

* `node_modules/`
* `dist/`
* `.env`
* IDE/editor configuration files

---

## 📌 Future Enhancements

* Backend API integration
* Protected routes & role-based access
* Mobile responsiveness improvements
* Performance optimization
* PWA support
* Unit & integration testing

---

## 📄 License

This project is developed for **educational and internal purposes**.
License information can be added if required.

---

## 🤝 Contributors

Developed and maintained by the **Syncaura Frontend Team**.

⭐ If you find this project useful, consider starring the repository!
hello
