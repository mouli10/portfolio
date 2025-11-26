# 🧪 Database Testing Guide

Complete guide to testing your Supabase database connection.

## ✅ Quick Visual Tests

### Test 1: Verify Backend Connection (30 seconds)

**Open your browser and visit:**
```
http://localhost:8000
```

**You should see:**
```json
{
  "message": "Portfolio API with Database",
  "database": "Supabase Connected ✅"
}
```

✅ If you see this, database is connected!

---

### Test 2: View Projects from Database (30 seconds)

**Visit:**
```
http://localhost:8000/api/projects
```

**You should see:** JSON data with 4 projects loaded from Supabase

---

### Test 3: View Skills from Database (30 seconds)

**Visit:**
```
http://localhost:8000/api/skills
```

**You should see:** JSON data with 12 skills loaded from Supabase

---

## 📧 Test 4: Contact Form → Database (2 minutes)

### Step-by-Step:

1. **Go to your portfolio:**
   ```
   http://localhost:5173
   ```

2. **Scroll down to "Get In Touch" section**

3. **Fill out the form:**
   - Name: `Your Name`
   - Email: `your.email@test.com`
   - Subject: `Testing Database`
   - Message: `This is a test message to verify database is working!`

4. **Click "Send Message"**
   - You should see "Thank you" message

5. **Go to Admin Dashboard:**
   ```
   http://localhost:5173/admin
   ```

6. **Login:**
   - Username: `admin`
   - Password: `admin123`

7. **Click "Messages" tab**

8. **✅ You should see your message!**
   - Name, email, subject, message
   - Timestamp
   - Unread status

9. **Click on the message to view details**

10. **Click "Mark as Read"**
    - Status changes to "Read"

11. **Refresh the page**
    - ✅ Message still there (persisted in database!)

---

## 🎨 Test 5: Add/Edit Projects via Admin (3 minutes)

### Add a New Project:

1. **Go to Admin Dashboard** (http://localhost:5173/admin)

2. **Click "Projects" tab**

3. **Click "Add New Project" button**

4. **Fill in the form:**
   - Title: `My Test Project`
   - Description: `Testing database functionality`
   - Technologies: `React, Supabase, FastAPI`
   - GitHub URL: `https://github.com/yourname/test`
   - Featured: ✓ (check it)

5. **Click "Save Project"**

6. **✅ Project appears in the list immediately**

7. **Go to your portfolio homepage:**
   ```
   http://localhost:5173
   ```

8. **Scroll to Projects section**
   - ✅ Your new project appears!
   - ✅ It's marked as "Featured"

### Edit the Project:

1. **Back to Admin → Projects**

2. **Click "Edit" on your test project**

3. **Change the title to:** `My Updated Project`

4. **Click "Save Project"**

5. **Refresh portfolio homepage**
   - ✅ Title is updated!

### Verify Persistence:

1. **Stop the backend server** (Ctrl+C in backend terminal)

2. **Restart it:**
   ```bash
   cd backend
   ./venv/bin/python3 main.py
   ```

3. **Refresh your portfolio page**
   - ✅ Your project is still there!
   - ✅ Data persisted through restart!

---

## 🛠️ Test 6: Add/Edit Skills via Admin (2 minutes)

1. **Admin Dashboard → Skills tab**

2. **Click "Add New Skill"**

3. **Fill in:**
   - Name: `Supabase`
   - Category: `Database`
   - Level: `85` (use slider)
   - Icon: `🗄️`

4. **Click "Save Skill"**

5. **✅ Skill appears in the grid**

6. **Go to portfolio homepage → Skills section**
   - ✅ New skill is visible!

7. **Click "Edit" on the skill**

8. **Change level to `95`**

9. **Save and refresh portfolio**
   - ✅ Progress bar updated to 95%!

---

## 🔍 Test 7: View Data in Supabase Dashboard (2 minutes)

1. **Go to:** https://supabase.com

2. **Login and open your project**

3. **Click "Table Editor" in sidebar**

4. **Click "projects" table**
   - ✅ See all your projects
   - ✅ Including the one you just added!

5. **Click "skills" table**
   - ✅ See all skills
   - ✅ Including Supabase skill you added!

6. **Click "contact_messages" table**
   - ✅ See all messages
   - ✅ Read/unread status visible

---

## 🔄 Test 8: Data Persistence Test (Critical!)

This proves your database works vs in-memory storage:

### Before (In-Memory):
Data lost on restart ❌

### Now (Supabase):
Data persists ✅

**Test it:**

1. **Add a message via contact form**

2. **Note the message details**

3. **Stop backend server** (Ctrl+C)

4. **Stop frontend server** (Ctrl+C)

5. **Restart both servers:**
   ```bash
   # Terminal 1
   cd backend
   ./venv/bin/python3 main.py

   # Terminal 2
   cd frontend
   npm run dev
   ```

6. **Go to Admin → Messages**
   - ✅ Your message is still there!
   - ✅ Data survived the restart!

7. **Go to Projects section**
   - ✅ All projects still there!

8. **✅ DATABASE PERSISTENCE CONFIRMED!**

---

## 🧮 Test 9: Statistics Panel (1 minute)

1. **Admin Dashboard → Dashboard tab**

2. **Check the stats:**
   - Total Projects: Should show count
   - Featured Projects: Should show count
   - Total Skills: Should show count
   - Total Messages: Should show count
   - Unread Messages: Should show count

3. **Add a new message via contact form**

4. **Click "Refresh Stats" button**
   - ✅ Numbers update!
   - ✅ Unread count increases!

---

## 🚀 Test 10: API Endpoints Test (Terminal)

Run these commands to test API directly:

### Test Projects API:
```bash
curl http://localhost:8000/api/projects
```
✅ Should return JSON with all projects

### Test Skills API:
```bash
curl http://localhost:8000/api/skills
```
✅ Should return JSON with all skills

### Test Contact API:
```bash
curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test",
    "email": "api@test.com",
    "subject": "Testing",
    "message": "Test from terminal"
  }'
```
✅ Should return success message

### Test Admin Stats (with auth):
```bash
# Login and get token
TOKEN=$(curl -s -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | \
  python3 -c "import sys, json; print(json.load(sys.stdin)['token'])")

# Get stats
curl -s http://localhost:8000/api/admin/stats \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool
```
✅ Should return statistics

---

## ✅ Success Checklist

Run through this checklist to confirm everything works:

- [ ] Backend shows "Supabase Connected ✅"
- [ ] Projects load from database
- [ ] Skills load from database  
- [ ] Contact form saves to database
- [ ] Messages appear in admin panel
- [ ] Can add new projects via admin
- [ ] Can edit existing projects
- [ ] Can delete projects
- [ ] Can add new skills via admin
- [ ] Can edit existing skills
- [ ] Can delete skills
- [ ] Data persists after server restart
- [ ] Can view data in Supabase dashboard
- [ ] Statistics update correctly
- [ ] Mark as read works for messages

If all checked: **✅ DATABASE FULLY WORKING!**

---

## 🆘 Troubleshooting

### "Cannot connect to database"

**Check:**
```bash
cd backend
cat .env
```
Verify SUPABASE_URL and SUPABASE_KEY are correct

**Solution:** Check Supabase dashboard → Settings → API for correct credentials

---

### "Table does not exist"

**Solution:** 
1. Go to Supabase dashboard → SQL Editor
2. Re-run the table creation SQL
3. Restart backend server

---

### "Data not showing"

**Check backend console for errors:**
```bash
cd backend
./venv/bin/python3 main.py
```
Look for error messages

**Check Supabase dashboard:**
- Table Editor → Verify tables exist
- Logs → Check for query errors

---

## 💡 Pro Tips

1. **Use Supabase Dashboard** - Easiest way to verify data
2. **Check Backend Console** - Shows all database operations
3. **Test After Changes** - Always verify new features work
4. **Backup Data** - Export from Supabase periodically
5. **Monitor Limits** - Free tier has 500 MB limit

---

## 🎓 Understanding the Flow

```
User Action (Contact Form)
         ↓
Frontend (React)
         ↓
POST /api/contact
         ↓
Backend (FastAPI)
         ↓
Supabase Client
         ↓
PostgreSQL Database (Supabase)
         ↓
Data Saved Permanently ✅
         ↓
Admin Can View It
```

---

## 📊 Database Schema

### Projects Table
```
- id (serial primary key)
- title (varchar 255)
- description (text)
- technologies (text array)
- github_url (varchar 500)
- live_url (varchar 500)
- image_url (varchar 500)
- featured (boolean)
- created_at (timestamp)
```

### Skills Table
```
- id (serial primary key)
- name (varchar 100)
- category (varchar 50)
- level (integer 1-100)
- icon (varchar 10)
- created_at (timestamp)
```

### Contact Messages Table
```
- id (serial primary key)
- name (varchar 255)
- email (varchar 255)
- subject (varchar 255)
- message (text)
- read (boolean)
- timestamp (timestamp)
```

---

**You now have a fully tested, production-ready database! 🎉**

