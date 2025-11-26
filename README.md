# 🚀 Advanced Portfolio Website

A modern, full-stack portfolio website built with React, FastAPI, and TailwindCSS. Features a beautiful UI with smooth animations, responsive design, and a complete backend API.

![Portfolio Preview](https://via.placeholder.com/1200x600/0ea5e9/ffffff?text=Portfolio+Preview)

## ✨ Features

- 🎨 **Modern UI/UX**: Beautiful gradient designs with smooth animations using Framer Motion
- 📱 **Fully Responsive**: Optimized for all devices and screen sizes
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🔥 **Backend API**: FastAPI backend with RESTful endpoints
- 📊 **Dynamic Content**: Projects and skills loaded from API
- 📧 **Contact Form**: Functional contact form with backend integration
- 🎯 **Interactive**: Smooth scrolling, hover effects, and engaging animations
- 🌈 **Custom Theming**: TailwindCSS with custom color palette
- 🔐 **Admin Dashboard**: Complete admin interface to manage content and view messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Icons** - Icon library
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **Uvicorn** - ASGI server
- **Pydantic** - Data validation

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Footer.jsx
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.8+** installed on your system
- **Node.js 16+** and npm installed
- Basic knowledge of React and Python

### Installation

1. **Clone the repository** (or you're already here!)

```bash
cd portfolio
```

2. **Set up the Backend**

```bash
# Navigate to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. **Set up the Frontend**

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install
```

### Running the Application

You'll need two terminal windows - one for backend and one for frontend.

**Terminal 1 - Backend:**

```bash
cd backend
source venv/bin/activate  # Activate virtual environment
python main.py
```

The backend will start on `http://localhost:8000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### 🎉 That's it!

Open your browser and visit `http://localhost:5173` to see your portfolio!

### 🔐 Access Admin Dashboard

Visit `http://localhost:5173/admin` and login with:
- **Username:** admin
- **Password:** admin123

From the admin dashboard you can:
- View and manage contact form submissions
- Add, edit, and delete projects
- Manage your skills and proficiency levels
- View portfolio statistics

📖 See [ADMIN_GUIDE.md](ADMIN_GUIDE.md) for complete admin documentation.

## 📝 Customization

### Update Personal Information

1. **Hero Section** (`frontend/src/components/Hero.jsx`):
   - Change your name
   - Update your title/role
   - Modify social media links

2. **About Section** (`frontend/src/components/About.jsx`):
   - Update your bio and journey
   - Modify statistics

3. **Projects** (`backend/main.py`):
   - Edit the `projects_db` list to add your own projects
   - Update project images, descriptions, and links

4. **Skills** (`backend/main.py`):
   - Modify the `skills_db` list with your skills
   - Adjust skill levels and categories

5. **Contact Info** (`frontend/src/components/Contact.jsx` and `Footer.jsx`):
   - Update email, phone, and location
   - Modify social media links

### Styling

All styling is done with TailwindCSS. The color scheme can be customized in:
- `frontend/tailwind.config.js` - Color palette and theme settings
- `frontend/src/index.css` - Global styles and custom utilities

## 🔌 API Endpoints

The backend provides the following REST API endpoints:

- `GET /` - API information
- `GET /api/projects` - Get all projects (supports `?featured=true` filter)
- `GET /api/projects/{id}` - Get specific project
- `GET /api/skills` - Get all skills (supports `?category=` filter)
- `GET /api/skills/categories` - Get skill categories
- `POST /api/contact` - Submit contact form

## 🚢 Deployment

### Backend Deployment (Recommended: Railway, Heroku, or DigitalOcean)

1. Update CORS origins in `backend/main.py` with your frontend URL
2. Set up environment variables for production
3. Deploy using your preferred platform

### Frontend Deployment (Recommended: Vercel, Netlify, or Cloudflare Pages)

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Update the API endpoint in production (configure in `vite.config.js` or use environment variables)

3. Deploy the `dist` folder to your hosting service

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💖 Support

If you found this helpful, please give it a ⭐️!

---

Built with ❤️ using React and FastAPI

