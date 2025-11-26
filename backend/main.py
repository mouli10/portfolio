from fastapi import FastAPI, HTTPException, Depends, Header, UploadFile, File
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

app = FastAPI(title="Portfolio API with Database", version="2.0.0")

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
def verify_admin_token(authorization: Optional[str] = Header(None)):
    """Verify admin authentication token using Supabase Auth"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        # Extract token from "Bearer <token>"
        token = authorization.split(" ")[1]
        user = supabase.auth.get_user(token)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except Exception as e:
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

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
    subject: Optional[str] = None
    message: str

class Experience(BaseModel):
    id: int
    title: str
    company: str
    date: str
    description: str
    logo_url: Optional[str] = None

class ExperienceCreate(BaseModel):
    title: str
    company: str
    date: str
    description: str
    logo_url: Optional[str] = None

class Education(BaseModel):
    id: int
    institution: str
    degree: str
    date: str
    description: str
    cgpa: Optional[str] = None
    logo_url: Optional[str] = None

class EducationCreate(BaseModel):
    institution: str
    degree: str
    date: str
    description: str
    cgpa: Optional[str] = None
    logo_url: Optional[str] = None

class Certificate(BaseModel):
    id: int
    title: str
    issuer: str
    date: str
    description: str
    credential_url: Optional[str] = None
    logo_url: Optional[str] = None

class CertificateCreate(BaseModel):
    title: str
    issuer: str
    date: str
    description: str
    credential_url: Optional[str] = None
    logo_url: Optional[str] = None

class SiteSettings(BaseModel):
    id: int
    full_name: str
    title: str
    tagline: str
    bio: str
    profile_image_url: Optional[str]
    resume_url: Optional[str]
    logo_url: Optional[str] = None # Added field
    email: Optional[str]
    phone: Optional[str]
    location: Optional[str]
    social_links: List[dict]
    years_experience: str
    projects_completed: str
    lines_of_code: str
    site_title: str
    site_description: Optional[str]

class SiteSettingsUpdate(BaseModel):
    full_name: Optional[str] = None
    title: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    resume_url: Optional[str] = None
    logo_url: Optional[str] = None # Added field
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    social_links: Optional[List[dict]] = None
    years_experience: Optional[str] = None
    projects_completed: Optional[str] = None
    lines_of_code: Optional[str] = None
    site_title: Optional[str] = None
    site_description: Optional[str] = None

class AboutMe(BaseModel):
    id: int
    journey_title: str
    journey_text: str
    highlights: List[dict]

class AboutMeUpdate(BaseModel):
    journey_title: Optional[str] = None
    journey_text: Optional[str] = None
    highlights: Optional[List[dict]] = None

class SkillCategory(BaseModel):
    id: int
    name: str

class SkillCategoryCreate(BaseModel):
    name: str

class AdminLogin(BaseModel):
    username: str
    password: str

# Routes
@app.get("/")
async def root():
    return {
        "message": "Portfolio API with Database",
        "version": "2.0.0",
        "database": "Supabase Connected ✅",
        "endpoints": {
            "projects": "/api/projects",
            "skills": "/api/skills",
            "experience": "/api/experience",
            "contact": "/api/contact",
            "admin": "/api/admin/*"
        }
    }

# Projects endpoints
@app.get("/api/projects", response_model=List[Project])
async def get_projects(featured: Optional[bool] = None):
    """Get all projects or filter by featured status"""
    try:
        query = supabase.table("projects").select("*").order("id")
        if featured is not None:
            query = query.eq("featured", featured)
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}", response_model=Project)
async def get_project(project_id: int):
    """Get a specific project by ID"""
    try:
        response = supabase.table("projects").select("*").eq("id", project_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Experience endpoints
@app.get("/api/experience", response_model=List[Experience])
async def get_experience():
    """Get all experience items"""
    try:
        response = supabase.table("experience").select("*").order("id", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching experience: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Skills endpoints
@app.get("/api/skills", response_model=List[Skill])
async def get_skills(category: Optional[str] = None):
    """Get all skills or filter by category"""
    try:
        query = supabase.table("skills").select("*").order("id")
        if category:
            query = query.eq("category", category)
        response = query.execute()
        return response.data
    except Exception as e:
        print(f"Error fetching skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/skill-categories", response_model=List[SkillCategory])
async def get_skill_categories():
    """Get all skill categories"""
    try:
        response = supabase.table("skill_categories").select("*").order("name").execute()
        return response.data
    except Exception as e:
        print(f"Error fetching skill categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/skills/categories")
async def get_skill_categories_legacy():
    """Get all unique skill categories"""
    try:
        response = supabase.table("skills").select("category").execute()
        categories = list(set(skill["category"] for skill in response.data))
        return {"categories": categories}
    except Exception as e:
        print(f"Error fetching categories: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Contact endpoint
@app.post("/api/contact")
async def submit_contact(message: ContactMessage):
    """Handle contact form submission"""
    try:
        data = {
            "name": message.name,
            "email": message.email,
            "subject": message.subject,
            "message": message.message,
            "read": False
        }
        response = supabase.table("contact_messages").insert(data).execute()
        
        print(f"✅ New contact message from {message.name} ({message.email})")
        print(f"   Subject: {message.subject}")
        
        return {
            "success": True,
            "message": "Thank you for your message! I'll get back to you soon.",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error saving contact message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Admin endpoints


@app.get("/api/admin/messages", dependencies=[Depends(verify_admin_token)])
async def get_all_messages():
    """Get all contact messages (admin only)"""
    try:
        response = supabase.table("contact_messages").select("*").order("timestamp", desc=True).execute()
        return response.data
    except Exception as e:
        print(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.patch("/api/admin/messages/{message_id}/read", dependencies=[Depends(verify_admin_token)])
async def mark_message_read(message_id: int):
    """Mark a message as read"""
    try:
        response = supabase.table("contact_messages").update({"read": True}).eq("id", message_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error marking message as read: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/messages/{message_id}", dependencies=[Depends(verify_admin_token)])
async def delete_message(message_id: int):
    """Delete a contact message"""
    try:
        response = supabase.table("contact_messages").delete().eq("id", message_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error deleting message: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/projects", dependencies=[Depends(verify_admin_token)])
async def create_project(project: ProjectCreate):
    """Create a new project"""
    try:
        data = project.dict()
        response = supabase.table("projects").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def update_project(project_id: int, project: ProjectCreate):
    """Update an existing project"""
    try:
        data = project.dict()
        response = supabase.table("projects").update(data).eq("id", project_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Project not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/projects/{project_id}", dependencies=[Depends(verify_admin_token)])
async def delete_project(project_id: int):
    """Delete a project"""
    try:
        response = supabase.table("projects").delete().eq("id", project_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error deleting project: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/skills", dependencies=[Depends(verify_admin_token)])
async def create_skill(skill: SkillCreate):
    """Create a new skill"""
    try:
        data = skill.dict()
        response = supabase.table("skills").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error creating skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/skills/{skill_id}", dependencies=[Depends(verify_admin_token)])
async def update_skill(skill_id: int, skill: SkillCreate):
    """Update an existing skill"""
    try:
        data = skill.dict()
        response = supabase.table("skills").update(data).eq("id", skill_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Skill not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/skills/{skill_id}", dependencies=[Depends(verify_admin_token)])
async def delete_skill(skill_id: int):
    """Delete a skill"""
    try:
        response = supabase.table("skills").delete().eq("id", skill_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error deleting skill: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/experience", dependencies=[Depends(verify_admin_token)])
async def create_experience(experience: ExperienceCreate):
    """Create a new experience item"""
    try:
        data = experience.dict()
        response = supabase.table("experience").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error creating experience: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/experience/{experience_id}", dependencies=[Depends(verify_admin_token)])
async def update_experience(experience_id: int, experience: ExperienceCreate):
    """Update an existing experience item"""
    try:
        data = experience.dict()
        response = supabase.table("experience").update(data).eq("id", experience_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Experience not found")
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating experience: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/experience/{experience_id}", dependencies=[Depends(verify_admin_token)])
async def delete_experience(experience_id: int):
    """Delete an experience item"""
    try:
        response = supabase.table("experience").delete().eq("id", experience_id).execute()
        return {"success": True}
    except Exception as e:
        print(f"Error deleting experience: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Education Endpoints
@app.get("/api/education", response_model=List[Education])
async def get_education():
    try:
        response = supabase.table("education").select("*").order("id", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/education", response_model=Education, dependencies=[Depends(verify_admin_token)])
async def create_education(education: EducationCreate):
    try:
        result = supabase.table("education").insert(education.dict()).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/education/{education_id}", response_model=Education, dependencies=[Depends(verify_admin_token)])
async def update_education(education_id: int, education: EducationCreate):
    try:
        result = supabase.table("education").update(education.dict()).eq("id", education_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Education entry not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/education/{education_id}", dependencies=[Depends(verify_admin_token)])
async def delete_education(education_id: int):
    try:
        result = supabase.table("education").delete().eq("id", education_id).execute()
        return {"message": "Education deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/skill-categories", dependencies=[Depends(verify_admin_token)])
async def create_skill_category(category: SkillCategoryCreate):
    """Create a new skill category"""
    try:
        data = category.dict()
        response = supabase.table("skill_categories").insert(data).execute()
        return response.data[0]
    except Exception as e:
        print(f"Error creating skill category: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/skill-categories/{category_id}", dependencies=[Depends(verify_admin_token)])
async def delete_skill_category(category_id: int, migrate_to: Optional[int] = None):
    """Delete a skill category, optionally migrating skills to another category"""
    try:
        # Check if category has skills
        category_response = supabase.table("skill_categories").select("name").eq("id", category_id).execute()
        if not category_response.data:
            raise HTTPException(status_code=404, detail="Category not found")
        
        category_name = category_response.data[0]["name"]
        skills_response = supabase.table("skills").select("*").eq("category", category_name).execute()
        
        if skills_response.data:
            # Has skills - require migration
            if not migrate_to:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Category has {len(skills_response.data)} skills. Please specify a target category to migrate to."
                )
            
            # Get target category name
            target_response = supabase.table("skill_categories").select("name").eq("id", migrate_to).execute()
            if not target_response.data:
                raise HTTPException(status_code=404, detail="Target category not found")
            
            target_name = target_response.data[0]["name"]
            
            # Migrate all skills to new category
            for skill in skills_response.data:
                supabase.table("skills").update({"category": target_name}).eq("id", skill["id"]).execute()
        
        # Delete category
        supabase.table("skill_categories").delete().eq("id", category_id).execute()
        return {"success": True, "migrated": len(skills_response.data) if skills_response.data else 0}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting skill category: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Certificate Endpoints
@app.get("/api/certificates", response_model=List[Certificate])
async def get_certificates():
    try:
        response = supabase.table("certificates").select("*").order("id", desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/admin/certificates", response_model=Certificate, dependencies=[Depends(verify_admin_token)])
async def create_certificate(certificate: CertificateCreate):
    try:
        result = supabase.table("certificates").insert(certificate.dict()).execute()
        return result.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/certificates/{certificate_id}", response_model=Certificate, dependencies=[Depends(verify_admin_token)])
async def update_certificate(certificate_id: int, certificate: CertificateCreate):
    try:
        result = supabase.table("certificates").update(certificate.dict()).eq("id", certificate_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Certificate not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/admin/certificates/{certificate_id}", dependencies=[Depends(verify_admin_token)])
async def delete_certificate(certificate_id: int):
    try:
        result = supabase.table("certificates").delete().eq("id", certificate_id).execute()
        return {"message": "Certificate deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Site Settings Endpoints
@app.get("/api/site-settings", response_model=SiteSettings)
async def get_site_settings():
    try:
        response = supabase.table("site_settings").select("*").eq("id", 1).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise HTTPException(status_code=404, detail="Site settings not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/site-settings", response_model=SiteSettings, dependencies=[Depends(verify_admin_token)])
async def update_site_settings(settings: SiteSettingsUpdate):
    try:
        # Only update fields that are provided
        update_data = {k: v for k, v in settings.dict().items() if v is not None}
        result = supabase.table("site_settings").update(update_data).eq("id", 1).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        raise HTTPException(status_code=404, detail="Site settings not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# About Me Endpoints
@app.get("/api/about-me", response_model=AboutMe)
async def get_about_me():
    try:
        response = supabase.table("about_me").select("*").eq("id", 1).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        raise HTTPException(status_code=404, detail="About me content not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/admin/about-me", response_model=AboutMe, dependencies=[Depends(verify_admin_token)])
async def update_about_me(about: AboutMeUpdate):
    try:
        # Only update fields that are provided
        update_data = {k: v for k, v in about.dict().items() if v is not None}
        result = supabase.table("about_me").update(update_data).eq("id", 1).execute()
        if result.data and len(result.data) > 0:
            return result.data[0]
        raise HTTPException(status_code=404, detail="About me content not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/stats", dependencies=[Depends(verify_admin_token)])
async def get_admin_stats():
    """Get statistics for admin dashboard"""
    try:
        projects = supabase.table("projects").select("*", count="exact").execute()
        featured = supabase.table("projects").select("*", count="exact").eq("featured", True).execute()
        skills = supabase.table("skills").select("*", count="exact").execute()
        try:
            experience = supabase.table("experience").select("*", count="exact").execute()
            experience_count = experience.count
        except:
            experience_count = 0

        messages = supabase.table("contact_messages").select("*", count="exact").execute()
        unread = supabase.table("contact_messages").select("*", count="exact").eq("read", False).execute()
        
        return {
            "total_projects": projects.count,
            "featured_projects": featured.count,
            "total_skills": skills.count,
            "total_experience": experience_count,
            "total_messages": messages.count,
            "unread_messages": unread.count
        }
    except Exception as e:
        print(f"Error fetching stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("🚀 Starting Portfolio API with Supabase Database...")
    print(f"📊 Database URL: {os.getenv('SUPABASE_URL')}")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
@app.post("/api/upload", dependencies=[Depends(verify_admin_token)])
async def upload_file(file: UploadFile = File(...)):
    """Upload a file to Supabase Storage"""
    try:
        # Create unique filename
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        bucket_name = "portfolio-assets"
        result = supabase.storage.from_(bucket_name).upload(
            path=filename,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(filename)
        
        return {"url": public_url}
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
