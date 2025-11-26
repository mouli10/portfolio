# 📚 Complete Setup Guide

This guide will walk you through setting up and running your portfolio website step by step.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Steps](#installation-steps)
3. [Running the Application](#running-the-application)
4. [Customization Guide](#customization-guide)
5. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

Before you begin, make sure you have the following installed:

1. **Python 3.8 or higher**
   - Check version: `python --version` or `python3 --version`
   - Download: [python.org](https://www.python.org/downloads/)

2. **Node.js 16 or higher**
   - Check version: `node --version`
   - Download: [nodejs.org](https://nodejs.org/)

3. **npm** (comes with Node.js)
   - Check version: `npm --version`

## Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd "/Users/moulivunnam/Documents/new start/portfolio"
```

### Step 2: Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Create a Python virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows (Command Prompt):
# venv\Scripts\activate.bat

# On Windows (PowerShell):
# venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3: Set Up Frontend

Open a new terminal window/tab and:

```bash
# Navigate to frontend directory from project root
cd "/Users/moulivunnam/Documents/new start/portfolio/frontend"

# Install Node.js dependencies
npm install
```

This will install all required packages including React, Vite, TailwindCSS, and more.

## Running the Application

You need to run both backend and frontend simultaneously. Use two terminal windows.

### Terminal 1 - Start Backend Server

```bash
# Navigate to backend directory
cd "/Users/moulivunnam/Documents/new start/portfolio/backend"

# Activate virtual environment
source venv/bin/activate

# Start the FastAPI server
python main.py
```

You should see output like:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

The backend API is now running at `http://localhost:8000`

### Terminal 2 - Start Frontend Development Server

```bash
# Navigate to frontend directory
cd "/Users/moulivunnam/Documents/new start/portfolio/frontend"

# Start Vite development server
npm run dev
```

You should see output like:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

The frontend is now running at `http://localhost:5173`

### Access Your Portfolio

Open your web browser and visit:
```
http://localhost:5173
```

You should see your portfolio website with all sections:
- Hero section with your name and title
- About section with your story
- Projects section with sample projects
- Skills section with your tech stack
- Contact form
- Footer

## Customization Guide

### 1. Update Your Personal Information

#### Update Name and Title

Edit `frontend/src/components/Hero.jsx`:

```jsx
// Find and replace:
<h1 className="text-5xl md:text-7xl font-bold mb-6">
  <span className="text-gradient">Your Name</span>  {/* Change this */}
</h1>

<p className="text-xl md:text-2xl text-gray-400 mb-8">
  Full Stack Developer | UI/UX Enthusiast | Problem Solver  {/* Change this */}
</p>
```

#### Update Social Media Links

In `Hero.jsx`, find the `socialLinks` array:

```jsx
const socialLinks = [
  { icon: FaGithub, href: 'https://github.com/yourusername', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com/in/yourusername', label: 'LinkedIn' },
  // ... update URLs
]
```

### 2. Add Your Projects

Edit `backend/main.py`, find `projects_db` and update:

```python
projects_db = [
    {
        "id": 1,
        "title": "Your Project Name",
        "description": "Your project description",
        "technologies": ["React", "Node.js", "MongoDB"],
        "github_url": "https://github.com/yourusername/project",
        "live_url": "https://yourproject.com",
        "image_url": "https://your-image-url.com/image.jpg",
        "featured": True
    },
    # Add more projects...
]
```

### 3. Update Your Skills

In `backend/main.py`, find `skills_db`:

```python
skills_db = [
    {"id": 1, "name": "Python", "category": "Backend", "level": 90, "icon": "🐍"},
    {"id": 2, "name": "JavaScript", "category": "Frontend", "level": 95, "icon": "⚡"},
    # Add your skills...
]
```

### 4. Update Contact Information

Edit `frontend/src/components/Contact.jsx`:

```jsx
const contactInfo = [
  {
    icon: FaEnvelope,
    label: 'Email',
    value: 'your.real.email@example.com',  // Change this
    href: 'mailto:your.real.email@example.com',
  },
  // ... update phone and location
]
```

Also update the Footer (`frontend/src/components/Footer.jsx`) with the same information.

### 5. Customize Colors

Edit `frontend/tailwind.config.js` to change the color scheme:

```js
colors: {
  primary: {
    // Change these values to your preferred colors
    500: '#0ea5e9',  // Main primary color
    600: '#0284c7',
    // ...
  },
}
```

## Troubleshooting

### Backend Issues

**Problem**: `ModuleNotFoundError: No module named 'fastapi'`

**Solution**: Make sure you activated the virtual environment and installed dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Problem**: Port 8000 is already in use

**Solution**: Kill the process using port 8000 or change the port in `main.py`:
```python
uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
```

### Frontend Issues

**Problem**: `Cannot find module` errors

**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules
npm install
```

**Problem**: Port 5173 is already in use

**Solution**: The dev server will automatically use the next available port, or you can specify one in `vite.config.js`.

**Problem**: API calls failing (CORS errors)

**Solution**: Make sure:
1. Backend is running on port 8000
2. The proxy is configured in `vite.config.js`
3. CORS is properly configured in `backend/main.py`

### General Issues

**Problem**: Changes not reflecting

**Solution**: 
- For frontend: Vite has hot reload, but you can restart with `Ctrl+C` then `npm run dev`
- For backend: FastAPI has auto-reload enabled. If not working, restart the server.

## Next Steps

1. **Customize all content** with your real information
2. **Add your own projects** and skills
3. **Test the contact form** (currently logs to console)
4. **Deploy your portfolio** (see deployment section in README.md)
5. **Add your own images** (replace placeholder images)

## Need Help?

- Check the main `README.md` for more details
- Review the FastAPI docs: [fastapi.tiangolo.com](https://fastapi.tiangolo.com/)
- Review the React docs: [react.dev](https://react.dev/)
- Review the Vite docs: [vitejs.dev](https://vitejs.dev/)

---

Happy coding! 🚀

