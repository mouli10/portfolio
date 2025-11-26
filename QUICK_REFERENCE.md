# ⚡ Quick Reference Card

## 🌐 URLs

| What | URL | Notes |
|------|-----|-------|
| **Portfolio** | http://localhost:5173 | Your public portfolio website |
| **Admin Dashboard** | http://localhost:5173/admin | Manage content & view messages |
| **Backend API** | http://localhost:8000 | REST API server |
| **API Docs** | http://localhost:8000/docs | Interactive API documentation |

## 🔑 Admin Login

```
Username: admin
Password: admin123
```

## 🚀 Start Commands

### Start Backend
```bash
cd "/Users/moulivunnam/Documents/new start/portfolio/backend"
./venv/bin/python3 main.py
```

### Start Frontend
```bash
cd "/Users/moulivunnam/Documents/new start/portfolio/frontend"
npm run dev
```

## 📂 Key Files to Edit

| File | What to Change |
|------|----------------|
| `backend/main.py` | Projects data, skills data, admin credentials |
| `frontend/src/components/Hero.jsx` | Your name, title, social links |
| `frontend/src/components/About.jsx` | Your bio and story |
| `frontend/src/components/Contact.jsx` | Contact information |
| `frontend/src/components/Footer.jsx` | Footer contact info |

## 🎨 Admin Dashboard Features

| Tab | What You Can Do |
|-----|-----------------|
| **Dashboard** | View stats (projects, skills, messages) |
| **Messages** | Read contact submissions, reply, mark as read |
| **Projects** | Add/edit/delete projects |
| **Skills** | Add/edit/delete skills, adjust proficiency |

## 📊 Backend API Endpoints

### Public Endpoints
```
GET  /api/projects              # Get all projects
GET  /api/projects/{id}         # Get specific project
GET  /api/skills                # Get all skills
GET  /api/skills/categories     # Get skill categories
POST /api/contact               # Submit contact form
```

### Admin Endpoints (Require Authentication)
```
POST   /api/admin/login         # Admin login
GET    /api/admin/stats         # Get statistics
GET    /api/admin/messages      # Get all messages
PATCH  /api/admin/messages/{id}/read    # Mark message as read
DELETE /api/admin/messages/{id}         # Delete message
POST   /api/admin/projects      # Create project
PUT    /api/admin/projects/{id} # Update project
DELETE /api/admin/projects/{id} # Delete project
POST   /api/admin/skills        # Create skill
PUT    /api/admin/skills/{id}   # Update skill
DELETE /api/admin/skills/{id}   # Delete skill
```

## 🔧 Common Tasks

### Add a New Project
1. Go to http://localhost:5173/admin
2. Login
3. Click "Projects" tab
4. Click "Add New Project"
5. Fill form and save

### View Contact Messages
1. Go to Admin Dashboard
2. Click "Messages" tab
3. Click any message to view details
4. Reply or mark as read

### Change Your Name
1. Edit `frontend/src/components/Hero.jsx`
2. Find line with `<span className="text-gradient">Your Name</span>`
3. Replace "Your Name" with your actual name
4. Save (auto-reloads)

### Add a Skill
1. Admin Dashboard → Skills tab
2. Click "Add New Skill"
3. Enter name, category, level, icon
4. Click "Save Skill"

### Update Backend Data Permanently
1. Edit `backend/main.py`
2. Modify `projects_db` or `skills_db` arrays
3. Restart backend server
4. Changes will be the new defaults

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't access admin | Make sure you're at `/admin` URL and backend is running |
| Changes not showing | Check both servers are running, try browser refresh |
| `python: command not found` | Use `python3` instead on macOS |
| Port already in use | Stop other instances or change port in config |
| 401 Unauthorized | Logout and login again to get fresh token |

## 📱 Ports Used

- **Frontend:** 5173 (Vite dev server)
- **Backend:** 8000 (FastAPI server)

## 🔄 Restart Servers

### Stop Servers
Press `Ctrl + C` in each terminal

### Full Restart
```bash
# Terminal 1
cd backend
./venv/bin/python3 main.py

# Terminal 2
cd frontend
npm run dev
```

## 📚 Documentation Files

- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `ADMIN_GUIDE.md` - Complete admin dashboard guide
- `QUICK_START.md` - 5-minute quick start
- `QUICK_REFERENCE.md` - This file!

## 💡 Pro Tips

1. **Keep both servers running** while working
2. **Use the admin dashboard** instead of editing code for content changes
3. **Backup your data** before major changes (copy `main.py`)
4. **Test contact form** by filling it out yourself
5. **View site in incognito** to see visitor experience

---

**Bookmark this page for quick reference!** 🔖

