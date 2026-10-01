from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3

app = Flask(__name__)
CORS(app)

DB_NAME = "careerpath.db"


# ==============================
# DATABASE CONNECTION
# ==============================

def get_db():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn


# ==============================
# CREATE DATABASE TABLES
# ==============================

def init_db():

    conn = get_db()
    cursor = conn.cursor()

    # Careers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS careers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            description TEXT
        )
    """)

    # Skills table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS skills (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id INTEGER,
            skill TEXT NOT NULL,
            FOREIGN KEY (career_id) REFERENCES careers(id)
        )
    """)

    # Resources table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id INTEGER,
            title TEXT NOT NULL,
            url TEXT NOT NULL,
            FOREIGN KEY (career_id) REFERENCES careers(id)
        )
    """)

    # Roadmap table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS roadmap (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            career_id INTEGER,
            week TEXT NOT NULL,
            skill TEXT NOT NULL,
            description TEXT,
            project TEXT,
            FOREIGN KEY (career_id) REFERENCES careers(id)
        )
    """)

    # Existing progress table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            skill TEXT NOT NULL,
            completed INTEGER DEFAULT 0
        )
    """)

    conn.commit()
    conn.close()


# ==============================
# CAREER DATA
# ==============================

CAREER_DATA = {

    "Web Development": {
        "description": "Build modern responsive websites and web applications.",

        "skills": [
            "HTML",
            "CSS",
            "JavaScript",
            "Responsive Web Design",
            "Git & GitHub",
            "React.js",
            "APIs",
            "Basic Databases / SQL",
            "Projects & Portfolio"
        ],

        "resources": [
            (
                "freeCodeCamp",
                "https://www.youtube.com/@freecodecamp"
            ),
            (
                "Full Stack Open",
                "https://fullstackopen.com"
            ),
            (
                "GitHub Skills",
                "https://skills.github.com"
            ),
            (
                "Frontend Mentor",
                "https://www.frontendmentor.io"
            ),
            (
                "JavaScript.info",
                "https://javascript.info"
            ),
            (
                "W3Schools",
                "https://www.w3schools.com"
            )
        ]
    },


    "Data Science": {
        "description": "Analyze data and build data-driven solutions.",

        "skills": [
            "Python",
            "SQL",
            "Statistics",
            "NumPy",
            "Pandas",
            "Data Cleaning",
            "Data Visualization",
            "Machine Learning Basics",
            "Projects"
        ],

        "resources": [
            (
                "Kaggle",
                "https://www.kaggle.com"
            ),
            (
                "freeCodeCamp",
                "https://www.freecodecamp.org/learn"
            )
        ]
    },


    "AI/ML": {
        "description": "Learn artificial intelligence and machine learning concepts.",

        "skills": [
            "Python",
            "Basic Mathematics",
            "Statistics",
            "NumPy & Pandas",
            "Machine Learning Concepts",
            "Supervised Learning",
            "Unsupervised Learning",
            "Neural Networks",
            "Model Evaluation",
            "AI Projects"
        ],

        "resources": [
            (
                "Kaggle Learn",
                "https://www.kaggle.com/learn"
            ),
            (
                "freeCodeCamp",
                "https://www.youtube.com/@freecodecamp"
            )
        ]
    },


    "Cyber Security": {
        "description": "Learn cybersecurity, networking and security testing.",

        "skills": [
            "Computer Fundamentals",
            "Networking",
            "Linux Basics",
            "Cyber Security Fundamentals",
            "Cryptography Basics",
            "Authentication & Access Control",
            "Web Security",
            "Security Monitoring",
            "Ethical / Security Testing Concepts",
            "Security Projects"
        ],

        "resources": [
            (
                "PortSwigger Web Security Academy",
                "https://portswigger.net/web-security"
            ),
            (
                "Professor Messer",
                "https://www.youtube.com/@professormesser"
            )
        ]
    },


    "Cloud Computing": {
        "description": "Learn cloud infrastructure, deployment and cloud security.",

        "skills": [
            "Computer Fundamentals",
            "Networking",
            "Linux",
            "Cloud Concepts",
            "AWS / Azure Basics",
            "Virtual Machines",
            "Storage",
            "Databases",
            "Cloud Security",
            "Deployment"
        ],

        "resources": [
            (
                "Cloud Computing Tutorial",
                "https://www.youtube.com/watch?v=nLQNFuSpLTk"
            )
        ]
    }
}


# ==============================
# INSERT CAREER DATA
# ==============================

def insert_career_data():

    conn = get_db()
    cursor = conn.cursor()

    for career_name, career_data in CAREER_DATA.items():

        # Check career
        cursor.execute(
            "SELECT id FROM careers WHERE name = ?",
            (career_name,)
        )

        career = cursor.fetchone()

        if career:
            career_id = career["id"]

        else:
            cursor.execute(
                """
                INSERT INTO careers (name, description)
                VALUES (?, ?)
                """,
                (
                    career_name,
                    career_data["description"]
                )
            )

            career_id = cursor.lastrowid


        # Add skills
        for skill in career_data["skills"]:

            cursor.execute(
                """
                SELECT id FROM skills
                WHERE career_id = ? AND skill = ?
                """,
                (career_id, skill)
            )

            if not cursor.fetchone():

                cursor.execute(
                    """
                    INSERT INTO skills (career_id, skill)
                    VALUES (?, ?)
                    """,
                    (career_id, skill)
                )


        # Add resources
        for title, url in career_data["resources"]:

            cursor.execute(
                """
                SELECT id FROM resources
                WHERE career_id = ? AND url = ?
                """,
                (career_id, url)
            )

            if not cursor.fetchone():

                cursor.execute(
                    """
                    INSERT INTO resources
                    (career_id, title, url)
                    VALUES (?, ?, ?)
                    """,
                    (
                        career_id,
                        title,
                        url
                    )
                )


    conn.commit()
    conn.close()


# ==============================
# HOME / HEALTH
# ==============================

@app.route("/")
def home():

    return jsonify({
        "success": True,
        "message": "CareerPath AI Backend is running"
    })


@app.route("/api/health")
def health():

    return jsonify({
        "success": True,
        "message": "Backend is healthy"
    })


# ==============================
# CAREERS API
# ==============================

@app.route("/api/careers")
def get_careers():

    conn = get_db()

    careers = conn.execute(
        "SELECT * FROM careers"
    ).fetchall()

    result = []

    for career in careers:

        result.append({
            "id": career["id"],
            "name": career["name"],
            "description": career["description"]
        })

    conn.close()

    return jsonify({
        "success": True,
        "careers": result
    })


# ==============================
# SKILLS API
# ==============================

@app.route("/api/careers/<int:career_id>/skills")
def get_skills(career_id):

    conn = get_db()

    skills = conn.execute(
        """
        SELECT skill
        FROM skills
        WHERE career_id = ?
        """,
        (career_id,)
    ).fetchall()

    conn.close()

    return jsonify({
        "success": True,
        "skills": [row["skill"] for row in skills]
    })


# ==============================
# RESOURCES API
# ==============================

@app.route("/api/careers/<int:career_id>/resources")
def get_resources(career_id):

    conn = get_db()

    resources = conn.execute(
        """
        SELECT title, url
        FROM resources
        WHERE career_id = ?
        """,
        (career_id,)
    ).fetchall()

    conn.close()

    return jsonify({
        "success": True,
        "resources": [
            {
                "title": row["title"],
                "url": row["url"]
            }
            for row in resources
        ]
    })


# ==============================
# PROFILE ANALYSIS
# ==============================

@app.route("/api/analyze", methods=["POST"])
def analyze():

    data = request.get_json() or {}

    career = data.get("career", "")
    skills = data.get("skills", "")
    education = data.get("education", "")
    experience = data.get("experience", "")
    interests = data.get("interests", "")
    study_time = data.get("studyTime", "")

    return jsonify({
        "success": True,
        "career": career,
        "skills": skills,
        "education": education,
        "experience": experience,
        "interests": interests,
        "studyTime": study_time,
        "readiness_score": 0,
        "message": "Profile analyzed successfully"
    })


# ==============================
# START SERVER
# ==============================

if __name__ == "__main__":

    init_db()
    insert_career_data()

    print("================================")
    print(" CareerPath AI Backend Started")
    print(" http://127.0.0.1:5000")
    print("================================")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )