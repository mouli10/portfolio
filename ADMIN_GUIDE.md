# 🔐 Admin Dashboard Guide

Complete guide to using your portfolio admin interface.

## 🌐 Accessing the Admin Dashboard

### Login URL
```
http://localhost:5173/admin
```

### Default Credentials
- **Username:** `admin`
- **Password:** `admin123`

> ⚠️ **IMPORTANT:** Change these credentials in `backend/main.py` before deploying to production!

## 📊 Dashboard Overview

Once logged in, you'll see 4 main sections:

### 1. **Dashboard** (Stats)
View key statistics about your portfolio:
- Total number of projects
- Featured projects count
- Total skills
- Contact messages (total and unread)

### 2. **Messages** 📧
Manage contact form submissions from visitors.

**Features:**
- View all messages in a list
- Filter by: All, Unread, Read
- Click a message to see full details including:
  - Sender name and email
  - Subject and full message
  - Timestamp
  - Read/Unread status
- **Actions:**
  - Mark as read
  - Reply via email (opens your email client)
  - Delete message

**Workflow:**
1. New messages appear with a blue indicator
2. Click to view details
3. Mark as read or reply
4. Delete after handling

### 3. **Projects** 💼
Add, edit, and manage your portfolio projects.

**Project Fields:**
- **Title** * (required) - Project name
- **Description** * (required) - Detailed description
- **Technologies** * (required) - Comma-separated list (e.g., "React, Node.js, MongoDB")
- **GitHub URL** - Link to source code
- **Live URL** - Link to deployed project
- **Image URL** - Screenshot or preview image
- **Featured** - Checkbox to mark as featured

**Actions:**
- **Add New Project** - Click the button at top right
- **Edit** - Click edit button on any project card
- **Delete** - Click delete button (confirms before deleting)

**Tips:**
- Use high-quality images (recommended: 800x600px)
- Featured projects show up first on your portfolio
- Technologies will display as tags

### 4. **Skills** 🛠️
Manage your technical skills and expertise levels.

**Skill Fields:**
- **Skill Name** * (required) - Technology or tool name
- **Category** * (required) - Frontend, Backend, Database, DevOps, or Tools
- **Proficiency Level** - Slider from 1-100%
- **Icon** - Emoji to represent the skill (optional)

**Features:**
- Filter skills by category
- Visual progress bars show proficiency
- Color-coded categories

**Actions:**
- **Add New Skill** - Click the button at top right
- **Edit** - Modify existing skills
- **Delete** - Remove skills you no longer want to display

**Tips:**
- Be honest with proficiency levels
- Use emojis that represent the technology (🐍 for Python, ⚛️ for React, etc.)
- Group related skills in appropriate categories

## 🔄 How Data Works

### Data Storage
- All data is currently stored **in memory** on the backend
- **Changes persist** while the server is running
- **Data resets** when you restart the backend server
- For permanent storage, you'll need to connect a database (PostgreSQL, MongoDB, etc.)

### Contact Form Flow
1. Visitor fills out contact form on your portfolio
2. Backend receives and stores the message
3. Message appears in Admin Dashboard "Messages" section
4. You can view, mark as read, reply, or delete

### Real-time Updates
- Changes are **immediate** - no page refresh needed
- After editing, the main portfolio updates automatically
- Stats refresh when switching between tabs

## 🔒 Security Notes

### For Development (Current Setup)
- Username/password authentication
- Token stored in browser localStorage
- Suitable for local development

### For Production (Before Deploying)

1. **Change Credentials** in `backend/main.py`:
```python
ADMIN_USERNAME = "your_secure_username"
ADMIN_PASSWORD = "your_secure_password_here"
ADMIN_TOKEN = "generate_a_random_secure_token"
```

2. **Use Environment Variables:**
```python
import os
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
```

3. **Add Password Hashing:**
   - Install `passlib` and `bcrypt`
   - Hash passwords before storing
   - Verify hashed passwords on login

4. **Use JWT Tokens:**
   - Install `python-jose`
   - Generate expiring JWT tokens
   - Add token refresh mechanism

5. **Add HTTPS:**
   - Use SSL certificates
   - Never send credentials over HTTP

## 🚀 Quick Actions

### Add Your First Project
1. Go to Admin Dashboard
2. Click "Projects" tab
3. Click "Add New Project"
4. Fill in the form:
   - Title: "My Awesome App"
   - Description: What the project does
   - Technologies: "React, FastAPI, PostgreSQL"
   - Add URLs and image
5. Check "Featured" if it's your best work
6. Click "Save Project"

### View Contact Messages
1. Go to "Messages" tab
2. See all messages listed (newest first)
3. Unread messages have a blue indicator
4. Click any message to see details
5. Click "Reply" to respond via email

### Update a Skill
1. Go to "Skills" tab
2. Find the skill you want to update
3. Click "Edit"
4. Adjust the proficiency level slider
5. Change category or icon if needed
6. Click "Save Skill"

## 🛟 Troubleshooting

### Can't Login
- Check username and password match `backend/main.py`
- Make sure backend server is running on port 8000
- Clear browser localStorage and try again

### Changes Not Showing
- Backend changes require server restart to see new default data
- Frontend changes update automatically with Vite's hot reload
- Try refreshing the browser

### "Unauthorized" Error
- Your token may have expired
- Click "Logout" and login again
- Check that backend CORS allows your frontend URL

### Messages Not Appearing
- Make sure someone has submitted the contact form
- Check backend console for logged messages
- Refresh the Messages panel

## 📱 Mobile Access

The admin dashboard is responsive but works best on:
- Desktop browsers (Chrome, Firefox, Safari)
- Tablet in landscape mode
- Screen width 1024px or wider recommended

## 🎯 Best Practices

1. **Regular Updates:**
   - Keep projects current
   - Update skill levels as you improve
   - Respond to messages promptly

2. **Content Quality:**
   - Use professional project descriptions
   - Add screenshots for all projects
   - Keep technology lists accurate

3. **Security:**
   - Logout when finished
   - Don't share admin credentials
   - Use strong passwords in production

4. **Organization:**
   - Mark messages as read after handling
   - Delete old/spam messages
   - Feature your best 2-3 projects

## 🔗 Quick Links

- **Portfolio:** http://localhost:5173/
- **Admin:** http://localhost:5173/admin
- **API Docs:** http://localhost:8000/docs
- **API Admin Endpoints:** http://localhost:8000/redoc

## 📞 Need Help?

If you encounter issues:
1. Check the terminal for error messages
2. Verify both frontend and backend are running
3. Clear browser cache and localStorage
4. Restart both servers

---

**Remember:** This is YOUR admin panel. Customize it, extend it, and make it your own! 🎨

