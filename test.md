# 📸 PhotoVault – Smart Online Photo Album Platform

<div align="center">

![PhotoVault](https://img.shields.io/badge/PhotoVault-v1.0.0-6366f1?style=for-the-badge&logo=image&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**A production-ready, full-stack photo album platform with modern UI, image processing, and analytics.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Architecture](#-architecture)

</div>

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with persistent login
- Password hashing with bcrypt
- Role-based access control (User / Admin)
- Forgot password / reset password flow
- Protected routes on both frontend and backend

### 📊 User Dashboard
- Real-time statistics (albums, photos, storage, favorites)
- Recent uploads gallery
- Activity timeline
- Upload activity charts

### 📁 Album Management
- Create, edit, delete albums
- Set cover photos
- Public/Private visibility toggle
- Search and sort albums
- Share albums with public links

### 🖼️ Photo Management
- Single and bulk photo upload
- Drag & drop upload interface
- Automatic image compression (Sharp)
- Thumbnail generation
- EXIF metadata extraction
- Favorite photos
- Download individual photos or entire albums as ZIP

### 🎨 Gallery Features
- Pinterest-style masonry layout
- Infinite scroll pagination
- Full-screen slideshow mode
- Image zoom and preview modal
- Search and filter by album, tags, favorites

### 💬 Social Features
- Like and comment on photos
- Share album links publicly
- Activity feed

### 📈 Analytics Dashboard
- Upload activity trends
- Monthly upload statistics
- Album growth over time
- Storage usage breakdown
- Most viewed photos

### 🛡️ Admin Panel
- User management (view, disable, delete)
- System-wide statistics
- Photo moderation
- Storage monitoring

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| React Router DOM | Routing |
| Axios | HTTP Client |
| Framer Motion | Animations |
| Chart.js | Analytics Charts |
| React Hot Toast | Notifications |
| React Dropzone | File Upload |
| React Masonry CSS | Gallery Layout |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MySQL | Database |
| JWT | Authentication |
| bcryptjs | Password Hashing |
| Multer | File Uploads |
| Sharp | Image Processing |
| Archiver | ZIP Downloads |
| Express Validator | Input Validation |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/photovault.git
cd photovault
```

### 2. Database Setup
```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE photovault;
USE photovault;

# Import schema
source backend/database/schema.sql;

# Import seed data (optional)
source backend/database/seed.sql;
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials
cp .env.example .env  # or edit the existing .env

# Start development server
npm run dev
```

The backend server will start at `http://localhost:5000`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start at `http://localhost:5173`

### 5. Default Accounts (from seed data)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@photovault.com | Admin123! |
| User | john@photovault.com | User123! |

---

## 🏗️ Architecture

### Project Structure
```
photovault/
├── frontend/                  # React + Vite Frontend
│   ├── src/
│   │   ├── assets/           # Static assets
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # Shared UI components
│   │   │   ├── album/        # Album-specific components
│   │   │   ├── photo/        # Photo-specific components
│   │   │   └── charts/       # Chart components
│   │   ├── context/          # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Route pages
│   │   ├── services/         # API service layer
│   │   └── utils/            # Utility functions
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                   # Node.js + Express Backend
│   ├── config/               # Database & upload config
│   ├── controllers/          # Route handlers
│   ├── database/             # SQL schema & seeds
│   ├── middleware/            # Auth, validation, error handling
│   ├── models/               # Database models (raw SQL)
│   ├── routes/               # Express route definitions
│   ├── services/             # Business logic services
│   ├── uploads/              # Uploaded files storage
│   │   ├── photos/           # Processed photos
│   │   ├── thumbnails/       # Generated thumbnails
│   │   └── avatars/          # User avatars
│   ├── utils/                # Helper utilities
│   ├── server.js             # Entry point
│   ├── .env                  # Environment variables
│   └── package.json
│
└── README.md
```

### MVC Pattern (Backend)
```
Request → Routes → Middleware → Controller → Model → Database
                                    ↕
                                Services
```

### Database Schema (ER Diagram)
```
users ─┬── albums ──── photos ─┬── comments
       │        │        │      └── likes
       │        │        └── photo_tags ── tags
       │        └── shared_links
       ├── activity_logs
       └── notifications
```

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/forgot-password` | Request password reset | No |
| POST | `/api/auth/reset-password` | Reset password with token | No |
| PUT | `/api/auth/change-password` | Change password | Yes |

### Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/profile` | Get profile | Yes |
| PUT | `/api/users/profile` | Update profile | Yes |
| PUT | `/api/users/avatar` | Update avatar | Yes |
| DELETE | `/api/users/account` | Delete account | Yes |

### Albums
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/albums` | Get user's albums | Yes |
| POST | `/api/albums` | Create album | Yes |
| GET | `/api/albums/:id` | Get album by ID | Yes |
| PUT | `/api/albums/:id` | Update album | Yes |
| DELETE | `/api/albums/:id` | Delete album | Yes |
| PUT | `/api/albums/:id/cover` | Set cover photo | Yes |
| PUT | `/api/albums/:id/privacy` | Toggle privacy | Yes |
| GET | `/api/albums/search` | Search albums | Yes |

### Photos
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/photos/upload` | Upload single photo | Yes |
| POST | `/api/photos/upload-multiple` | Upload multiple | Yes |
| GET | `/api/photos/album/:albumId` | Get album photos | Yes |
| GET | `/api/photos/:id` | Get photo by ID | Yes |
| DELETE | `/api/photos/:id` | Delete photo | Yes |
| GET | `/api/photos/:id/download` | Download photo | Yes |
| POST | `/api/photos/:id/favorite` | Toggle favorite | Yes |
| GET | `/api/photos/favorites` | Get favorites | Yes |
| GET | `/api/photos/recent` | Get recent | Yes |
| GET | `/api/photos/:id/exif` | Get EXIF data | Yes |

### Comments & Likes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/comments/:photoId` | Get comments | Yes |
| POST | `/api/comments/:photoId` | Add comment | Yes |
| DELETE | `/api/comments/:id` | Delete comment | Yes |
| POST | `/api/likes/:photoId/toggle` | Toggle like | Yes |
| GET | `/api/likes/:photoId` | Get likes | Yes |

### Analytics
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/analytics/uploads` | Upload activity | Yes |
| GET | `/api/analytics/monthly` | Monthly stats | Yes |
| GET | `/api/analytics/album-growth` | Album growth | Yes |
| GET | `/api/analytics/storage` | Storage usage | Yes |
| GET | `/api/analytics/most-viewed` | Top photos | Yes |

### Admin
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/users` | List all users | Admin |
| GET | `/api/admin/users/:id` | Get user details | Admin |
| DELETE | `/api/admin/users/:id` | Delete user | Admin |
| PUT | `/api/admin/users/:id/toggle-status` | Toggle status | Admin |
| GET | `/api/admin/stats` | System stats | Admin |
| GET | `/api/admin/analytics` | System analytics | Admin |

### Sharing
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/share/albums/:albumId` | Create share link | Yes |
| GET | `/api/share/public/:token` | View shared album | No |
| DELETE | `/api/share/:linkId` | Revoke link | Yes |
| GET | `/api/share/albums/:albumId/links` | Get album links | Yes |

---

## 🎨 Design System

- **Primary Colors**: Indigo (#6366f1) / Violet (#8b5cf6)
- **Accent**: Cyan (#06b6d4) / Amber (#f59e0b)
- **Typography**: Inter (Google Fonts)
- **Effects**: Glassmorphism, backdrop blur, gradient meshes
- **Animations**: Framer Motion page transitions, stagger effects
- **Themes**: Light / Dark mode with smooth transitions

---

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=photovault
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:5173
```

---

## 📋 Resume Highlights

This project demonstrates proficiency in:

- **Full-Stack Development**: React frontend + Node.js/Express backend
- **Database Design**: Normalized MySQL schema with 10+ tables
- **Authentication**: JWT-based auth with role-based access control
- **File Processing**: Image compression, thumbnails, EXIF extraction
- **API Design**: RESTful API with proper validation and error handling
- **Modern UI/UX**: Responsive design, dark mode, animations, glassmorphism
- **Data Visualization**: Interactive charts with Chart.js
- **Software Architecture**: MVC pattern, service layer, middleware pipeline
- **Performance**: Lazy loading, infinite scroll, image optimization
- **Security**: Input validation, password hashing, CORS, protected routes

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
Built with ❤️ using React, Node.js, Express, and MySQL
</div>
