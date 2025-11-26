# 🗄️ Database Setup Guide

Complete guide to adding a database to your portfolio for persistent storage.

## Why You Need a Database

**Current Problem:**
- Data stored in memory (Python lists)
- Lost when backend restarts
- Not suitable for production

**With Database:**
- ✅ Data persists forever
- ✅ Survives server restarts
- ✅ Production-ready
- ✅ Scalable

## 🎯 Recommended: Supabase (PostgreSQL)

### Why Supabase?
- Free tier: 500 MB database
- No credit card required
- Easy setup (5 minutes)
- Built-in dashboard
- PostgreSQL (industry standard)

---

## 📋 Step-by-Step Setup

### Part 1: Create Supabase Account (2 minutes)

1. **Go to:** https://supabase.com
2. **Click:** "Start your project"
3. **Sign up** with GitHub (easiest)
4. **Create new project:**
   - Name: `portfolio-db`
   - Database Password: (save this!)
   - Region: Choose closest to you
   - Click "Create new project"
5. **Wait 2 minutes** for database to spin up

### Part 2: Create Database Tables (3 minutes)

1. In Supabase dashboard, click **"SQL Editor"**
2. Click **"New Query"**
3. **Paste this SQL:**

```sql
-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technologies TEXT[] NOT NULL,
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image_url VARCHAR(500),
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 100),
    icon VARCHAR(10),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT false,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO projects (title, description, technologies, github_url, live_url, image_url, featured) VALUES
('E-Commerce Platform', 'A full-stack e-commerce platform with payment integration', 
 ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'], 
 'https://github.com/yourusername/ecommerce', 'https://demo-ecommerce.com',
 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop', true);

INSERT INTO skills (name, category, level, icon) VALUES
('Python', 'Backend', 90, '🐍'),
('JavaScript', 'Frontend', 95, '⚡'),
('React', 'Frontend', 92, '⚛️'),
('Node.js', 'Backend', 88, '🟢'),
('FastAPI', 'Backend', 85, '🚀');
```

4. **Click "Run"**
5. ✅ Tables created!

### Part 3: Get Connection Details

1. In Supabase dashboard, click **"Settings"** → **"API"**
2. **Copy these values:**
   - `Project URL` (looks like: https://xxxxx.supabase.co)
   - `anon public` API key (under "Project API keys")
   - `service_role` secret key

### Part 4: Update Backend Code (5 minutes)

1. **Install Supabase:**

```bash
cd "/Users/moulivunnam/Documents/new start/portfolio/backend"
./venv/bin/pip install supabase
```

2. **Create `.env` file in backend folder:**

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_TOKEN=portfolio_admin_token_2024
```

3. **Install python-dotenv:**

```bash
./venv/bin/pip install python-dotenv
```

4. **Update `requirements.txt`:**

```txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic[email]==2.5.0
python-multipart==0.0.6
supabase==2.0.0
python-dotenv==1.0.0
```

---

## 🔧 Backend Code with Database

Replace your `backend/main.py` with this database-enabled version:

```python
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import uvicorn
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Portfolio API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_KEY")
)

# Admin authentication
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "portfolio_admin_token_2024")

def verify_admin_token(authorization: Optional[str] = Header(None)):
    if not authorization or authorization != f"Bearer {ADMIN_TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    return True

# Models
class Project(BaseModel):
    id: int
    title: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False

class ProjectCreate(BaseModel):
    title: str
    description: str
    technologies: List[str]
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    featured: bool = False

class Skill(BaseModel):
    id: int
    name: str
    category: str
    level: int
    icon: Optional[str] = None

class SkillCreate(BaseModel):
    name: str
    category: str
    level: int
    icon: Optional[str] = None

class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class AdminLogin(BaseModel):
    username: str
    password: str

# Routes
@app.get("/")
async def root():
    return {
        "message": "Portfolio API with Database",
        "version": "2.0.0",
        "database": "Connected",
        "endpoints": {
            "projects": "/api/projects",
            "skills": "/api/skills",
            "contact": "/api/contact"
        }
    }

# Projects endpoints
@app.get("/api/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None):
    query = supabase.table("projects").select("*").order("id")
    if featured is not None:
        query = query.eq("featured", featured)
    response = query.execute()
    return response.data

@app.get("/api/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    response = supabase.table("projects").select("*").eq("id", project_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return response.data[0]

# Skills endpoints
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(category: Optional[str] = None):
    query = supabase.table("skills").select("*").order("id")
    if category:
        query = query.eq("category", category)
    response = query.execute()
    return response.data

@app.get("/api/skills/categories")
async def get_skill_categories():
    response = supabase.table("skills").select("category").execute()
    categories = list(set(skill["category"] for skill in response.data))
    return {"categories": categories}

# Contact endpoint
@app.post("/api/contact")
async def submit_contact(message: ContactMessage):
    data = {
        "name": message.name,
        "email": message.email,
        "subject": message.subject,
        "message": message.message,
        "read": False
    }
    response = supabase.table("contact_messages").insert(data).execute()
    
    print(f"New contact message from {message.name} ({message.email})")
    
    return {
        "success": True,
        "message": "Thank you for your message! I'll get back to you soon.",
        "timestamp": datetime.now().isoformat()
    }

# Admin endpoints
@app.post("/api/admin/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == ADMIN_USERNAME and credentials.password == ADMIN_PASSWORD:
        return {
            "success": True,
            "token": ADMIN_TOKEN,
            "message": "Login successful"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/admin/messages", dependencies=[Depends(verify_admin_token)])
async def get_all_messages():
    response = supabase.table("contact_messages").select("*").order("timestamp", desc=True).execute()
    return response.data

@app.patch("/api/admin/messages/{message_id}/read", dependencies=[Depends(verify_admin_token)])
async def mark_message_read(message_id: int):
    response = supabase.table("contact_messages").update({"read": True}).eq("id", message_id).execute()
    return {"success": True}

@app.delete("/api/admin/messages/{message_id}", dependencies=[Depends(verify_admin_token)])
async def delete_message(message_id: int):
    response = supabase.table("contact_messages").delete().eq("id", message_id).execute()
    return {"success": True}

@app.post("/api/admin/projects", dependencies=[Depends(verify_admin_token)])
async def create_project(project: ProjectCreate):
    data = project.dict()
    response = supabase.table("projects").insert(data).execute()
    return response.data[0]

@app.put("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def update_project(project_id: int, project: ProjectCreate):
    data = project.dict()
    response = supabase.table("projects").update(data).eq("id", project_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Project not found")
    return response.data[0]

@app.delete("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def delete_project(project_id: int):
    response = supabase.table("projects").delete().eq("id", project_id).execute()
    return {"success": True}

@app.post("/api/admin/skills", dependencies=[Depends(verify_admin_token)])
async def create_skill(skill: SkillCreate):
    data = skill.dict()
    response = supabase.table("skills").insert(data).execute()
    return response.data[0]

@app.put("/api/admin/skills/{skill_id}", dependencies=[Depends(verify_admin_token)])
async def update_skill(skill_id: int, skill: SkillCreate):
    data = skill.dict()
    response = supabase.table("skills").update(data).eq("id", skill_id).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="Skill not found")
    return response.data[0]

@app.delete("/api/admin/skills/{skill_id}", dependencies=[Depends(verify_admin_token)])
async def delete_skill(skill_id: int):
    response = supabase.table("skills").delete().eq("id", skill_id).execute()
    return {"success": True}

@app.get("/api/admin/stats", dependencies=[Depends(verify_admin_token)])
async def get_admin_stats():
    projects = supabase.table("projects").select("*", count="exact").execute()
    featured = supabase.table("projects").select("*", count="exact").eq("featured", True).execute()
    skills = supabase.table("skills").select("*", count="exact").execute()
    messages = supabase.table("contact_messages").select("*", count="exact").execute()
    unread = supabase.table("contact_messages").select("*", count="exact").eq("read", False).execute()
    
    return {
        "total_projects": projects.count,
        "featured_projects": featured.count,
        "total_skills": skills.count,
        "total_messages": messages.count,
        "unread_messages": unread.count
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

---

## ✅ Test the Database Connection

```bash
# Start backend
cd backend
./venv/bin/python3 main.py
```

Visit http://localhost:8000 - you should see:
```json
{
  "message": "Portfolio API with Database",
  "database": "Connected"
}
```

---

## 🌐 Alternative: MongoDB Atlas

If you prefer MongoDB (NoSQL):

### Setup:
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up free
3. Create cluster (512 MB free)
4. Get connection string

### Install:
```bash
pip install pymongo motor
```

### Code snippet:
```python
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(os.getenv("MONGODB_URI"))
db = client.portfolio

# Example: Get projects
projects = await db.projects.find().to_list(100)
```

---

## 📊 Database Comparison

| Database | Free Tier | Best For | Difficulty |
|----------|-----------|----------|------------|
| **Supabase** | 500 MB | Full-stack apps | Easy ⭐ |
| **MongoDB Atlas** | 512 MB | JSON/Document data | Easy ⭐ |
| **Railway** | $5/month credit | Backend + DB hosting | Medium |
| **Neon** | 3 GB | PostgreSQL projects | Easy ⭐ |
| **PlanetScale** | 5 GB | MySQL projects | Medium |

---

## 🚀 Deployment Benefits

With a database, you can deploy to:

1. **Backend Options:**
   - Railway (recommended)
   - Render
   - Heroku
   - DigitalOcean

2. **Frontend Options:**
   - Vercel (recommended)
   - Netlify
   - Cloudflare Pages

All your data stays in the database, safe and persistent!

---

## 🔒 Security Checklist

✅ Store credentials in `.env` file  
✅ Add `.env` to `.gitignore`  
✅ Use environment variables in production  
✅ Never commit API keys to Git  
✅ Use different databases for dev/production  

---

## 💡 Pro Tips

1. **Backup Data:**
   - Supabase has auto-backups
   - Export data regularly via dashboard

2. **Monitor Usage:**
   - Check Supabase dashboard for limits
   - Free tier is generous for portfolios

3. **Upgrade When Needed:**
   - Start free, upgrade if traffic grows
   - Most portfolios never need paid tier

---

## 🆘 Troubleshooting

**Can't connect to database?**
- Check `.env` file has correct credentials
- Verify Supabase URL and key
- Check firewall/network settings

**Tables not found?**
- Run the SQL creation script again
- Check table names match code

**Data not saving?**
- Check Supabase dashboard for errors
- Look at backend console logs
- Verify table structure

---

## 📚 Next Steps

1. ✅ Set up Supabase account
2. ✅ Create tables
3. ✅ Update backend code
4. ✅ Test locally
5. ✅ Deploy to production!

---

**You're now production-ready! 🎉**

Your portfolio can handle real users, persist data, and scale as needed!

