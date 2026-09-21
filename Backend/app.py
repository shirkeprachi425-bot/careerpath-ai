from flask_cors import CORS
from flask import Flask, request, jsonify
import sqlite3

from flask import Flask, request, jsonify
import sqlite3
DB_NAME = "careerpath.db"
def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()
from datetime import datetime

app = Flask(__name__)
CORS(app)
# ============================================================
# CAREER DATABASE
# ============================================================

CAREERS = {
    "AI/ML Engineer": {
        "skills": [
            "Python",
            "NumPy",
            "Pandas",
            "Statistics",
            "Machine Learning",
            "Deep Learning"
        ],
        "roadmap": [
            "Python",
            "NumPy & Pandas",
            "Statistics",
            "Machine Learning"
        ],
        "courses": [
            "Python fundamentals course",
            "Data analysis exercises",
            "Statistics problem set",
            "Machine Learning"
        ],
        "projects": [
            "Build a Python calculator",
            "Analyze a student dataset",
            "Create a statistics report",
            "Build a simple prediction model"
        ]
    },

    "Data Scientist": {
        "skills": [
            "Python",
            "SQL",
            "Statistics",
            "Pandas",
            "Machine Learning",
            "Data Visualization"
        ],
        "roadmap": [
            "Python for data analysis",
            "Pandas & SQL",
            "Statistics",
            "Machine Learning"
        ],
        "courses": [
            "Python for Data Science",
            "SQL query practice",
            "Statistics fundamentals",
            "Machine Learning"
        ],
        "projects": [
            "Data cleaning project",
            "Analyze a public dataset",
            "Statistical analysis report",
            "Build a prediction model"
        ]
    },

    "Data Analyst": {
        "skills": [
            "Excel",
            "SQL",
            "Python",
            "Statistics",
            "Power BI",
            "Data Visualization"
        ],
        "roadmap": [
            "Excel",
            "SQL",
            "Statistics",
            "Power BI"
        ],
        "courses": [
            "Advanced Excel",
            "SQL challenges",
            "Statistics basics",
            "Power BI"
        ],
        "projects": [
            "Create a sales dashboard",
            "Database analysis",
            "Data insights report",
            "Interactive business dashboard"
        ]
    },

    "Full Stack Developer": {
        "skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "SQL",
            "Git"
        ],
        "roadmap": [
            "HTML & CSS",
            "JavaScript",
            "React",
            "Node.js & SQL"
        ],
        "courses": [
            "Web development fundamentals",
            "JavaScript challenges",
            "Build a React dashboard",
            "Backend development"
        ],
        "projects": [
            "Build a portfolio website",
            "Build an interactive web app",
            "Build a React dashboard",
            "Build a full-stack application"
        ]
    },

    "DevOps": {
        "skills": [
            "Linux",
            "Git",
            "Docker",
            "AWS",
            "CI/CD",
            "Kubernetes"
        ],
        "roadmap": [
            "Linux & Git",
            "Docker",
            "AWS",
            "CI/CD"
        ],
        "courses": [
            "Linux fundamentals",
            "Container challenges",
            "Cloud fundamentals",
            "Deployment pipeline"
        ],
        "projects": [
            "Create a Git-based project",
            "Containerize an application",
            "Deploy a web application",
            "Create a CI/CD pipeline"
        ]
    }
}


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def normalize_skills(skills):
    if not isinstance(skills, list):
        return set()

    return {
        str(skill).strip().lower()
        for skill in skills
        if str(skill).strip()
    }


def calculate_skill_gap(career, user_skills):
    required = CAREERS[career]["skills"]
    normalized = normalize_skills(user_skills)

    matched = [
        skill for skill in required
        if skill.lower() in normalized
    ]

    missing = [
        skill for skill in required
        if skill.lower() not in normalized
    ]

    score = round((len(matched) / len(required)) * 100)

    if score < 40:
        priority = "High"
    elif score < 70:
        priority = "Medium"
    else:
        priority = "Low"

    return {
        "required": required,
        "matched": matched,
        "missing": missing,
        "score": score,
        "priority": priority
    }


# ============================================================
# HOME
# ============================================================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "CareerPath AI Backend is running",
        "version": "3.0"
    })


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "status": "online",
        "service": "CareerPath AI Backend"
    })


# ============================================================
# CAREERS
# ============================================================

@app.route("/api/careers", methods=["GET"])
def get_careers():
    return jsonify({
        "success": True,
        "count": len(CAREERS),
        "careers": list(CAREERS.keys())
    })


# ============================================================
# PROFILE
# ============================================================

@app.route("/api/profile", methods=["POST"])
def create_profile():

    data = request.get_json() or {}

    name = str(data.get("name", "")).strip()
    education = str(data.get("education", "")).strip()
    skills = data.get("skills", [])

    return jsonify({
        "success": True,
        "profile": {
            "name": name,
            "education": education,
            "skills": skills
        }
    })


# ============================================================
# REQUIRED SKILLS
# ============================================================

@app.route("/api/career/<path:career>/skills", methods=["GET"])
def get_required_skills(career):

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    return jsonify({
        "success": True,
        "career": career,
        "required_skills": CAREERS[career]["skills"]
    })


# ============================================================
# SKILL GAP ANALYSIS
# ============================================================

@app.route("/api/analyze", methods=["POST"])
def analyze():

    data = request.get_json() or {}

    name = str(data.get("name", "")).strip()
    education = str(data.get("education", "")).strip()
    career = str(data.get("career", "")).strip()
    skills = data.get("skills", [])

    if not career:
        return jsonify({
            "success": False,
            "message": "Target career is required"
        }), 400

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    result = calculate_skill_gap(career, skills)

    return jsonify({
        "success": True,

        "profile": {
            "name": name,
            "education": education
        },

        "target_career": career,

        "required_skills": result["required"],

        "matched_skills": result["matched"],

        "missing_skills": result["missing"],

        "skill_gap_count": len(result["missing"]),

        "readiness_score": result["score"],

        "priority": result["priority"],

        "priority_skills": result["missing"][:3],

        "roadmap": CAREERS[career]["roadmap"],

        "courses": CAREERS[career]["courses"],

        "projects": CAREERS[career]["projects"],

        "timestamp": datetime.now().isoformat()
    })


# ============================================================
# COMPLETE CAREER ANALYSIS
# ============================================================

@app.route("/api/career-analysis", methods=["POST"])
def complete_analysis():

    data = request.get_json() or {}

    career = str(data.get("career", "")).strip()
    skills = data.get("skills", [])

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    result = calculate_skill_gap(career, skills)

    return jsonify({
        "success": True,

        "profile": {
            "name": data.get("name", ""),
            "education": data.get("education", "")
        },

        "career": career,

        "required_skills": result["required"],

        "matched_skills": result["matched"],

        "missing_skills": result["missing"],

        "skill_gap": {
            "total_required": len(result["required"]),
            "matched": len(result["matched"]),
            "missing": len(result["missing"])
        },

        "readiness": {
            "score": result["score"],
            "priority": result["priority"]
        },

        "roadmap": CAREERS[career]["roadmap"],

        "resources": {
            "courses": CAREERS[career]["courses"],
            "projects": CAREERS[career]["projects"]
        }
    })


# ============================================================
# PERSONALIZED ROADMAP
# ============================================================

@app.route("/api/roadmap", methods=["POST"])
def personalized_roadmap():

    data = request.get_json() or {}

    career = str(data.get("career", "")).strip()
    missing_skills = data.get("missing_skills", [])

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    roadmap = CAREERS[career]["roadmap"]

    return jsonify({
        "success": True,
        "career": career,
        "missing_skills": missing_skills,
        "roadmap": roadmap,
        "total_steps": len(roadmap)
    })


# ============================================================
# COURSES AND PROJECTS
# ============================================================

@app.route("/api/resources/<path:career>", methods=["GET"])
def get_resources(career):

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    return jsonify({
        "success": True,
        "career": career,
        "courses": CAREERS[career]["courses"],
        "projects": CAREERS[career]["projects"]
    })


# ============================================================
# PROGRESS TRACKING
# ============================================================

@app.route("/api/progress", methods=["POST"])
def track_progress():

    data = request.get_json() or {}

    try:
        completed = int(data.get("completed", 0))
        total = int(data.get("total", 0))
    except (ValueError, TypeError):

        return jsonify({
            "success": False,
            "message": "completed and total must be numbers"
        }), 400

    if total <= 0:
        completed = 0
        percentage = 0
    else:
        completed = max(0, min(completed, total))
        percentage = round((completed / total) * 100)

    if percentage == 100:
        status = "Completed"
    elif percentage >= 70:
        status = "Almost Complete"
    elif percentage >= 40:
        status = "In Progress"
    else:
        status = "Getting Started"

    return jsonify({
        "success": True,
        "completed": completed,
        "total": total,
        "percentage": percentage,
        "status": status
    })


# ============================================================
# ROADMAP ADAPTATION
# ============================================================

@app.route("/api/adapt-roadmap", methods=["POST"])
def adapt_roadmap():

    data = request.get_json() or {}

    career = str(data.get("career", "")).strip()
    missing_skills = data.get("missing_skills", [])

    try:
        score = int(data.get("score", 0))
    except (ValueError, TypeError):
        score = 0

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    score = max(0, min(score, 100))

    full_roadmap = CAREERS[career]["roadmap"]

    if score < 40:

        level = "Foundation"
        adapted = full_roadmap[:4]

        recommendation = (
            "Focus on fundamental concepts and core skills first."
        )

    elif score < 70:

        level = "Intermediate"
        adapted = full_roadmap[2:6]

        recommendation = (
            "Focus on missing skills and practical projects."
        )

    else:

        level = "Advanced"
        adapted = full_roadmap[4:]

        recommendation = (
            "Focus on advanced projects, portfolio and interviews."
        )

    return jsonify({
        "success": True,
        "career": career,
        "current_score": score,
        "learning_level": level,
        "missing_skills": missing_skills,
        "adapted_roadmap": adapted,
        "recommendation": recommendation
    })


# ============================================================
# AI EXPLANATION
# ============================================================

@app.route("/api/explanation", methods=["POST"])
def ai_explanation():

    data = request.get_json() or {}

    career = str(data.get("career", "")).strip()
    missing_skills = data.get("missing_skills", [])

    try:
        score = int(data.get("score", 0))
    except (ValueError, TypeError):
        score = 0

    if career not in CAREERS:
        return jsonify({
            "success": False,
            "message": "Career not found"
        }), 404

    score = max(0, min(score, 100))

    if score < 40:

        explanation = (
            f"Your current readiness for {career} is {score}%. "
            "The analysis shows that several required skills are "
            "missing, so the roadmap begins with foundational learning."
        )

    elif score < 70:

        explanation = (
            f"Your current readiness for {career} is {score}%. "
            "You already have some relevant skills. "
            "The next focus is on missing skills and practical projects."
        )

    else:

        explanation = (
            f"Your current readiness for {career} is {score}%. "
            "You have many of the listed required skills. "
            "The next focus is advanced projects, portfolio development "
            "and interview preparation."
        )

    return jsonify({
        "success": True,
        "career": career,
        "score": score,
        "missing_skills": missing_skills,
        "explanation": explanation
    })

@app.route("/api/progress", methods=["POST"])
def save_progress():
    data = request.get_json() or {}

    return jsonify({
        "message": "Progress saved",
        "skill": data.get("skill", ""),
        "completed": True
    })
# ============================================================
# RUN SERVER
# ============================================================
init_db()
if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )