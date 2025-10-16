# HireNow - Job Application Management System

A comprehensive full-stack job application management system built with React, Node.js, Express, and MongoDB Atlas. Features role-based access control, automated workflows, and real-time application tracking.

## 🚀 Live Demo

- **Production URL**: [https://hirenow-bh6v.vercel.app](https://hirenow-bh6v.vercel.app)
- **API Documentation**: Available via Postman collection (see API Testing section)

## ✨ Features

### 🔐 Authentication & Authorization
- **Multi-role System**: Applicant, Admin, Bot Mimic roles
- **JWT-based Authentication**: Secure token-based auth
- **Protected Routes**: Role-based access control
- **Session Management**: Persistent login sessions

### 📋 Job Management
- **Job Posting Creation**: Create and manage job listings
- **Job Categories**: Technical and Non-technical job types
- **Skill Requirements**: Tag-based skill matching
- **Job Search & Filtering**: Advanced search capabilities

### 📝 Application Management
- **Application Submission**: Easy application form with file uploads
- **Status Tracking**: Real-time application status updates
- **Cover Letter Support**: Rich text cover letter submission
- **Resume Upload**: PDF resume file handling

### 📊 Dashboard & Analytics
- **Role-specific Dashboards**: Customized views for each user type
- **Application Metrics**: Visual charts and statistics
- **Activity Timeline**: Complete audit trail of actions
- **Real-time Updates**: Live status changes

### 🤖 Automation Features
- **Bot Mimic System**: Automated application processing
- **Status Workflows**: Automated status transitions
- **Notification System**: Real-time alerts and updates
- **Bulk Operations**: Mass application management

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **React Query** - Data fetching and caching
- **Wouter** - Lightweight routing
- **Framer Motion** - Animation library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation

### Deployment
- **Vercel** - Frontend and API hosting
- **MongoDB Atlas** - Cloud database
- **Environment Variables** - Secure configuration

## 📁 Project Structure

```
HireNow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Base UI components (Radix UI)
│   │   │   └── examples/  # Example components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                 # Backend Express application
│   ├── auth.ts            # Authentication logic
│   ├── models.ts          # MongoDB models
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   ├── mongo.ts           # MongoDB connection
│   └── index.ts           # Server entry point
├── api/                   # Vercel serverless functions
│   └── index.ts           # API entry point for Vercel
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod validation schemas
├── vercel.json            # Vercel deployment config
├── package.json           # Root package configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/Baskar-U/Hirenow.git
cd HireNow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the `server` directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hirenow?retryWrites=true&w=majority&appName=ClusterName
NODE_ENV=development
PORT=5000
```

### 4. Start Development Server
```bash
# Start both frontend and backend
npm run dev

# Or start individually
npm run dev:client  # Frontend only
npm run dev:server  # Backend only
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking
```

### Database Setup
The application automatically seeds initial users on first run:

**Default Users:**
- **Applicant**: `applicant@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`
- **Bot Mimic**: `bot@example.com` / `password123`

## 🧪 API Testing

### Postman Collection
Import the following collection to test all APIs:

**Base URLs:**
- **Local**: `http://localhost:5000`
- **Production**: `https://hirenow-bh6v.vercel.app`

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Jobs
- `GET /api/jobs` - List all jobs
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs` - Create new job (Admin only)

#### Applications
- `GET /api/applications` - List applications
- `POST /api/applications` - Submit application
- `PATCH /api/applications/:id/status` - Update status
- `GET /api/applications/:id/activity` - Get activity log

#### Health Check
- `GET /api/health` - API health status

### Postman Environment Variables
```json
{
  "base_url": "https://hirenow-bh6v.vercel.app",
  "token": "{{jwt_token_from_login}}"
}
```

## 🚀 Deployment

### Vercel Deployment
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Set the following in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `NODE_ENV`: `production`
3. **Deploy**: Vercel will automatically deploy on push to main branch

### MongoDB Atlas Setup
1. **Create Cluster**: Set up a MongoDB Atlas cluster
2. **Database User**: Create a database user with read/write permissions
3. **Network Access**: Add your IP address or use `0.0.0.0/0` for all IPs
4. **Connection String**: Get your connection string and add to environment variables

## 🎨 UI Components

The application uses a comprehensive design system built on:
- **Radix UI Primitives**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Application-specific components
- **Dark/Light Theme**: Automatic theme switching
- **Responsive Design**: Mobile-first approach

### Component Library
- **Forms**: Input, Textarea, Select, Checkbox, Radio
- **Navigation**: Sidebar, Breadcrumbs, Tabs
- **Data Display**: Tables, Cards, Badges, Charts
- **Feedback**: Alerts, Toasts, Progress, Skeleton
- **Overlays**: Modals, Popovers, Tooltips, Dropdowns

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Zod schema validation
- **Role-based Access**: Granular permission system
- **Environment Variables**: Secure configuration management

## 📊 Database Schema

### Collections
- **users**: User accounts and profiles
- **jobs**: Job postings and requirements
- **applications**: Job applications and details
- **activitylogs**: Application activity history
- **counters**: Auto-incrementing ID sequences

### Key Relationships
- Users can have multiple applications
- Jobs can have multiple applications
- Applications track status changes via activity logs
- All entities have audit trails (createdAt, updatedAt)

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Baskar** - *Initial work* - [Baskar-U](https://github.com/Baskar-U)

## 🙏 Acknowledgments

- **Radix UI** - For accessible component primitives
- **Tailwind CSS** - For utility-first CSS framework
- **Vercel** - For seamless deployment platform
- **MongoDB Atlas** - For cloud database hosting

## 📞 Support

For support, email support@hirenow.com or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MongoDB Atlas**
