# ⚡ Quick Start Guide

Get your portfolio up and running in 5 minutes!

## 🎯 Quick Setup

### 1. Backend Setup (2 minutes)

```bash
# Open Terminal 1
cd "/Users/moulivunnam/Documents/new start/portfolio/backend"

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend
python main.py
```

✅ Backend running at http://localhost:8000

### 2. Frontend Setup (2 minutes)

```bash
# Open Terminal 2 (new tab/window)
cd "/Users/moulivunnam/Documents/new start/portfolio/frontend"

# Install dependencies
npm install

# Start frontend
npm run dev
```

✅ Frontend running at http://localhost:5173

### 3. Open in Browser

Visit: **http://localhost:5173**

## 🎨 First Customizations

### Update Your Name
Edit `frontend/src/components/Hero.jsx` line 58:
```jsx
<span className="text-gradient">Your Name Here</span>
```

### Add Your Projects
Edit `backend/main.py` starting at line 32 - modify the `projects_db` list

### Update Skills
Edit `backend/main.py` starting at line 68 - modify the `skills_db` list

## 📱 Test Everything

- [ ] Scroll through all sections
- [ ] Click on navigation links
- [ ] Filter projects by "Featured"
- [ ] Filter skills by category
- [ ] Submit the contact form (check Terminal 1 for output)
- [ ] Test responsive design (resize browser)

## 🚀 What's Next?

- Read the full [README.md](README.md) for detailed information
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for comprehensive customization
- Start adding your real projects and information!

---

Need help? Check the Troubleshooting section in SETUP_GUIDE.md

