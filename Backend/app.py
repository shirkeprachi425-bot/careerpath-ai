from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

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

    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Student profiles table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS student_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            education TEXT NOT NULL,
            skills TEXT NOT NULL,
            experience TEXT NOT NULL,
            study_time TEXT NOT NULL,
            interests TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()

#signup logic
@app.route("/api/auth/signup", methods=["POST"])
def signup():
    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Basic validation
    if not name or not email or not password:
        return jsonify({
            "error": "Name, email and password are required."
        }), 400

    if len(password) < 6:
        return jsonify({
            "error": "Password must contain at least 6 characters."
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check whether email already exists
    cursor.execute(
        "SELECT id FROM users WHERE email = ?",
        (email,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        conn.close()

        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    # Hash password before storing it
    password_hash = generate_password_hash(password)

    cursor.execute(
        """
        INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)
        """,
        (name, email, password_hash)
    )

    conn.commit()

    user_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "message": "Account created successfully.",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }), 201

# ==============================
# Login Logic
# ==============================

@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    # Basic validation
    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Find user by email
    cursor.execute(
        """
        SELECT id, name, email, password_hash
        FROM users
        WHERE email = ?
        """,
        (email,)
    )

    user = cursor.fetchone()

    if not user:
        conn.close()

        return jsonify({
            "error": "Invalid email or password."
        }), 401

    # Check password
    if not check_password_hash(user["password_hash"], password):
        conn.close()

        return jsonify({
            "error": "Invalid email or password."
        }), 401

    conn.close()

    return jsonify({
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 200

# ==============================
# STUDENT PROFILE
# ==============================

@app.route("/api/student-profile", methods=["POST"])
def save_student_profile():

    data = request.get_json() or {}

    user_id = data.get("userId")
    education = data.get("education", "").strip()
    skills = data.get("skills", "").strip()
    experience = data.get("experience", "").strip()
    study_time = data.get("studyTime", "").strip()
    interests = data.get("interests", "").strip()

    # Basic validation
    if not user_id:
        return jsonify({
            "error": "User ID is required."
        }), 400

    if not education or not skills or not experience or not study_time or not interests:
        return jsonify({
            "error": "All profile fields are required."
        }), 400

    conn = get_db()
    cursor = conn.cursor()

    # Check whether user exists
    cursor.execute(
        "SELECT id FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        conn.close()

        return jsonify({
            "error": "User not found."
        }), 404

    # Check whether profile already exists
    cursor.execute(
        """
        SELECT id
        FROM student_profiles
        WHERE user_id = ?
        """,
        (user_id,)
    )

    existing_profile = cursor.fetchone()

    if existing_profile:

        # Update existing profile
        cursor.execute(
            """
            UPDATE student_profiles
            SET education = ?,
                skills = ?,
                experience = ?,
                study_time = ?,
                interests = ?
            WHERE user_id = ?
            """,
            (
                education,
                skills,
                experience,
                study_time,
                interests,
                user_id
            )
        )

        message = "Student profile updated successfully."

    else:

        # Create new profile
        cursor.execute(
            """
            INSERT INTO student_profiles
            (
                user_id,
                education,
                skills,
                experience,
                study_time,
                interests
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                education,
                skills,
                experience,
                study_time,
                interests
            )
        )

        message = "Student profile created successfully."

    conn.commit()

    conn.close()

    return jsonify({
        "success": True,
        "message": message
    }), 200

# ==============================
# To get user profile info when he comes back
# ==============================

@app.route("/api/student-profile/<int:user_id>", methods=["GET"])
def get_student_profile(user_id):

    conn = get_db()

    profile = conn.execute(
        """
        SELECT
            user_id,
            education,
            skills,
            experience,
            study_time,
            interests
        FROM student_profiles
        WHERE user_id = ?
        """,
        (user_id,)
    ).fetchone()

    conn.close()

    if not profile:
        return jsonify({
            "success": True,
            "profile": None
        }), 200

    return jsonify({
        "success": True,
        "profile": {
            "userId": profile["user_id"],
            "education": profile["education"],
            "skills": profile["skills"],
            "experience": profile["experience"],
            "studyTime": profile["study_time"],
            "interests": profile["interests"]
        }
    }), 200
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