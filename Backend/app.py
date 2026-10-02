from flask import Flask, request, jsonify
import os
import json
from google import genai
from google.genai import types
from flask_cors import CORS
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

DB_NAME = "careerpath.db"

# ==============================
# GEMINI AI
# ==============================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

gemini_client = None

if GEMINI_API_KEY:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)

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

    # Assessment results table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessment_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            attempt_number INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            percentage INTEGER NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    # Assessment attempts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessment_attempts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            score INTEGER NOT NULL,
            total_questions INTEGER NOT NULL,
            percentage INTEGER NOT NULL,
            question_ids TEXT NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
# ASSESSMENT QUESTIONS API
# ==============================

@app.route("/api/assessment/questions/<int:user_id>", methods=["GET"])
def get_assessment_questions(user_id):

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

    # Count previous assessment attempts
    cursor.execute(
        """
        SELECT COUNT(*) AS attempt_count
        FROM assessment_attempts
        WHERE user_id = ?
        """,
        (user_id,)
    )

    attempt_count = cursor.fetchone()["attempt_count"]

    conn.close()

    # First attempt → first 10 questions
    # Second attempt → next 10 questions
    # Third attempt → first 10 again
    # This can later be expanded with more question sets.

    if attempt_count % 2 == 0:
        selected_questions = ASSESSMENT_QUESTIONS[:10]
    else:
        selected_questions = ASSESSMENT_QUESTIONS[10:20]

    questions = []

    for question in selected_questions:

        questions.append({
            "id": question["id"],
            "category": question["category"],
            "question": question["question"],
            "options": question["options"]
        })

    return jsonify({
        "success": True,
        "attemptNumber": attempt_count + 1,
        "questions": questions
    }), 200

# ==============================
# SUBMIT ASSESSMENT
# ==============================

@app.route("/api/assessment/submit", methods=["POST"])
def submit_assessment():

    data = request.get_json() or {}

    user_id = data.get("userId")
    answers = data.get("answers", [])

    # ------------------------------
    # Basic validation
    # ------------------------------

    if not user_id:
        return jsonify({
            "error": "User ID is required."
        }), 400

    if not isinstance(answers, list):
        return jsonify({
            "error": "Answers must be provided as a list."
        }), 400

    # ------------------------------
    # Check user
    # ------------------------------

    conn = get_db()
    cursor = conn.cursor()

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

    # ------------------------------
    # Determine current question set
    # ------------------------------

    cursor.execute(
        """
        SELECT COUNT(*) AS attempt_count
        FROM assessment_attempts
        WHERE user_id = ?
        """,
        (user_id,)
    )

    attempt_count = cursor.fetchone()["attempt_count"]

    if attempt_count % 2 == 0:
        current_questions = ASSESSMENT_QUESTIONS[:10]
    else:
        current_questions = ASSESSMENT_QUESTIONS[10:20]

    # ------------------------------
    # Check answer count
    # ------------------------------

    if len(answers) != len(current_questions):
        conn.close()

        return jsonify({
            "error": "Please answer all assessment questions."
        }), 400

    # ------------------------------
    # Calculate score
    # ------------------------------

    score = 0

    question_ids = []

    for item in answers:

        question_id = item.get("questionId")
        user_answer = item.get("answer")

        question_ids.append(question_id)

        matching_question = next(
            (
                question
                for question in current_questions
                if question["id"] == question_id
            ),
            None
        )

        if matching_question:

            if user_answer == matching_question["answer"]:
                score += 1

    total_questions = len(current_questions)

    percentage = round(
        (score / total_questions) * 100
    )

    # ------------------------------
    # Save assessment attempt
    # ------------------------------

    import json

    cursor.execute(
        """
        INSERT INTO assessment_attempts
        (
            user_id,
            score,
            total_questions,
            percentage,
            question_ids
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            score,
            total_questions,
            percentage,
            json.dumps(question_ids)
        )
    )

    # ------------------------------
    # Update latest result
    # ------------------------------

    attempt_number = attempt_count + 1

    cursor.execute( 
    """
        SELECT id
        FROM assessment_results
        WHERE user_id = ?
    """,
    (user_id,)
    )

    existing_result = cursor.fetchone()

    if existing_result:

        cursor.execute(
        """
        UPDATE assessment_results
        SET attempt_number = ?,
            score = ?,
            total_questions = ?,
            percentage = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE user_id = ?
        """,
        (
            attempt_number,
            score,
            total_questions,
            percentage,
            user_id
        )
    )

    else:

        cursor.execute(
        """
        INSERT INTO assessment_results
        (
            user_id,
            attempt_number,
            score,
            total_questions,
            percentage
        )
        VALUES (?, ?, ?, ?, ?)
        """,
        (
            user_id,
            attempt_number,
            score,
            total_questions,
            percentage
        )
    )
    conn.commit()

    # Get new attempt ID
    attempt_id = cursor.lastrowid

    conn.close()

    return jsonify({
        "success": True,
        "message": "Assessment submitted successfully.",
        "result": {
            "attemptId": attempt_id,
            "score": score,
            "total": total_questions,
            "percentage": percentage,
            "attemptNumber": attempt_count + 1
        }
    }), 200

# ==============================
# GET ASSESSMENT RESULT
# ==============================

@app.route("/api/assessment/<int:user_id>", methods=["GET"])
def get_assessment_result(user_id):

    conn = get_db()

    result = conn.execute(
        """
        SELECT
            user_id,
            score,
            total_questions,
            percentage,
            completed_at
        FROM assessment_results
        WHERE user_id = ?
        """,
        (user_id,)
    ).fetchone()

    conn.close()

    if not result:
        return jsonify({
            "success": True,
            "result": None
        }), 200

    return jsonify({
        "success": True,
        "result": {
            "userId": result["user_id"],
            "score": result["score"],
            "total": result["total_questions"],
            "percentage": result["percentage"],
            "completedAt": result["completed_at"]
        }
    }), 200

# ==============================
# GET ASSESSMENT HISTORY
# ==============================

@app.route("/api/assessment/<int:user_id>/history", methods=["GET"])
def get_assessment_history(user_id):

    conn = get_db()

    attempts = conn.execute(
        """
        SELECT
            id,
            score,
            total_questions,
            percentage,
            completed_at
        FROM assessment_attempts
        WHERE user_id = ?
        ORDER BY completed_at DESC
        """,
        (user_id,)
    ).fetchall()

    conn.close()

    return jsonify({
        "success": True,
        "attempts": [
            {
                "attemptId": attempt["id"],
                "score": attempt["score"],
                "total": attempt["total_questions"],
                "percentage": attempt["percentage"],
                "completedAt": attempt["completed_at"]
            }
            for attempt in attempts
        ]
    }), 200

# ==============================
# USER ONBOARDING STATUS
# ==============================

@app.route("/api/user/<int:user_id>/status", methods=["GET"])
def get_user_status(user_id):

    conn = get_db()

    cursor = conn.cursor()

    # Check user
    cursor.execute(
        "SELECT id, name, email FROM users WHERE id = ?",
        (user_id,)
    )

    user = cursor.fetchone()

    if not user:
        conn.close()

        return jsonify({
            "error": "User not found."
        }), 404

    # Check profile
    cursor.execute(
        """
        SELECT id
        FROM student_profiles
        WHERE user_id = ?
        """,
        (user_id,)
    )

    profile = cursor.fetchone()

    # Get latest assessment
    cursor.execute(
        """
        SELECT
            score,
            total_questions,
            percentage,
            completed_at
        FROM assessment_results
        WHERE user_id = ?
        """,
        (user_id,)
    )

    assessment = cursor.fetchone()

    conn.close()

    return jsonify({
        "success": True,

        "profileCompleted": profile is not None,

        "assessmentCompleted": assessment is not None,

        "assessment": (
            {
                "score": assessment["score"],
                "total": assessment["total_questions"],
                "percentage": assessment["percentage"],
                "completedAt": assessment["completed_at"]
            }
            if assessment
            else None
        )
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
# AI CAREER RECOMMENDATION
# ==============================

def generate_ai_recommendation(profile, assessment):

    if not gemini_client:
        raise Exception("GEMINI_API_KEY is not configured.")

    career_context = {}

    for career_name, career_data in CAREER_DATA.items():

        career_context[career_name] = {
            "description": career_data["description"],
            "skills": career_data["skills"],
            "resources": career_data["resources"]
        }

    prompt = f"""
You are CareerPath AI, an AI career guidance assistant.

Your task is to analyze a student's profile and assessment result
and recommend suitable technology career paths.

STUDENT PROFILE:

Education:
{profile["education"]}

Current Skills:
{profile["skills"]}

Experience:
{profile["experience"]}

Interests:
{profile["interests"]}

Available Study Time:
{profile["studyTime"]}


ASSESSMENT RESULT:

Score:
{assessment["score"]}/{assessment["total"]}

Percentage:
{assessment["percentage"]}%


AVAILABLE CAREERS:

{json.dumps(career_context, indent=2)}


IMPORTANT RULES:

1. Recommend ONE primary career.
2. You may mention up to TWO alternative careers.
3. Base the recommendation on BOTH the student profile and assessment.
4. Identify the student's current strengths.
5. Identify the most important skill gaps for the recommended career.
6. Recommend resources ONLY from the provided career data.
7. Create a practical short learning roadmap.
8. Do not invent resources or URLs.
9. Keep the response concise and suitable for displaying on a dashboard.
10. Return ONLY valid JSON.

Return JSON in exactly this structure:

{{
    "recommendedCareer": "career name",
    "confidence": 0,
    "reason": "short explanation",
    "strengths": [
        "strength 1",
        "strength 2",
        "strength 3"
    ],
    "skillGaps": [
        "skill gap 1",
        "skill gap 2",
        "skill gap 3"
    ],
    "recommendedResources": [
        {{
            "title": "resource title",
            "url": "resource url",
            "reason": "why this resource helps"
        }}
    ],
    "roadmap": [
        {{
            "step": 1,
            "title": "step title",
            "description": "short description"
        }},
        {{
            "step": 2,
            "title": "step title",
            "description": "short description"
        }},
        {{
            "step": 3,
            "title": "step title",
            "description": "short description"
        }}
    ]
}}
"""

    response = gemini_client.models.generate_content(
    model="gemini-3.5-flash",
    contents=prompt,
    config=types.GenerateContentConfig(
        response_mime_type="application/json",
        temperature=0.3
    )

)

    return json.loads(response.text)

# ==============================
# AI RECOMMENDATION API
# ==============================

@app.route("/api/ai/recommend/<int:user_id>", methods=["GET"])
def get_ai_recommendation(user_id):

    conn = get_db()
    cursor = conn.cursor()

    # Get student profile
    cursor.execute(
        """
        SELECT
            education,
            skills,
            experience,
            study_time,
            interests
        FROM student_profiles
        WHERE user_id = ?
        """,
        (user_id,)
    )

    profile_row = cursor.fetchone()

    if not profile_row:
        conn.close()

        return jsonify({
            "success": False,
            "error": "Student profile not found."
        }), 404

    # Get latest assessment
    cursor.execute(
        """
        SELECT
            score,
            total_questions,
            percentage
        FROM assessment_results
        WHERE user_id = ?
        """,
        (user_id,)
    )

    assessment_row = cursor.fetchone()

    conn.close()

    if not assessment_row:
        return jsonify({
            "success": False,
            "error": "Assessment not completed."
        }), 404

    profile = {
        "education": profile_row["education"],
        "skills": profile_row["skills"],
        "experience": profile_row["experience"],
        "studyTime": profile_row["study_time"],
        "interests": profile_row["interests"]
    }

    assessment = {
        "score": assessment_row["score"],
        "total": assessment_row["total_questions"],
        "percentage": assessment_row["percentage"]
    }

    try:

        recommendation = generate_ai_recommendation(
            profile,
            assessment
        )

        return jsonify({
            "success": True,
            "userId": user_id,
            "assessment": assessment,
            "recommendation": recommendation
        }), 200

    except Exception as e:

        print("AI ERROR:", str(e))

        return jsonify({
            "success": False,
            "error": "AI recommendation failed.",
            "details": str(e)
        }), 500
# ==============================
# ASSESSMENT QUESTIONS
# ==============================

ASSESSMENT_QUESTIONS = [

    {
        "id": 1,
        "category": "Data Science",
        "question": "Which Python library is commonly used for data analysis?",
        "options": [
            "Pandas",
            "React",
            "Express",
            "Bootstrap"
        ],
        "answer": "Pandas"
    },

    {
        "id": 2,
        "category": "Web Development",
        "question": "Which technology is mainly used to create the structure of a web page?",
        "options": [
            "HTML",
            "Python",
            "SQL",
            "MongoDB"
        ],
        "answer": "HTML"
    },

    {
        "id": 3,
        "category": "Web Development",
        "question": "Which JavaScript library is commonly used to build user interfaces?",
        "options": [
            "React",
            "Flask",
            "MySQL",
            "Pandas"
        ],
        "answer": "React"
    },

    {
        "id": 4,
        "category": "Data Science",
        "question": "Which SQL command is used to retrieve data from a table?",
        "options": [
            "GET",
            "SELECT",
            "FETCHALL",
            "OPEN"
        ],
        "answer": "SELECT"
    },

    {
        "id": 5,
        "category": "AI/ML",
        "question": "Which of the following is a machine learning algorithm?",
        "options": [
            "Linear Regression",
            "HTML",
            "CSS",
            "Git"
        ],
        "answer": "Linear Regression"
    },

    {
        "id": 6,
        "category": "Cyber Security",
        "question": "Which of the following is used to protect an account from unauthorized access?",
        "options": [
            "Authentication",
            "Compilation",
            "Rendering",
            "Sorting"
        ],
        "answer": "Authentication"
    },

    {
        "id": 7,
        "category": "Cloud Computing",
        "question": "Which of the following is a cloud computing platform?",
        "options": [
            "AWS",
            "HTML",
            "React",
            "Pandas"
        ],
        "answer": "AWS"
    },

    {
        "id": 8,
        "category": "Problem Solving",
        "question": "What is the main purpose of an algorithm?",
        "options": [
            "To solve a problem step by step",
            "To design a webpage",
            "To store passwords",
            "To create images"
        ],
        "answer": "To solve a problem step by step"
    },

    {
        "id": 9,
        "category": "AI/ML",
        "question": "What does ML stand for?",
        "options": [
            "Machine Learning",
            "Maximum Logic",
            "Modern Language",
            "Memory Layer"
        ],
        "answer": "Machine Learning"
    },

    {
        "id": 10,
        "category": "Cyber Security",
        "question": "Which of the following is an example of a strong password?",
        "options": [
            "123456",
            "password",
            "Dinesh123",
            "T9#kL2@pQ7!"
        ],
        "answer": "T9#kL2@pQ7!"
    },
    
    {
        "id": 11,
        "category": "Data Science",
        "question": "Which library is commonly used for numerical computing in Python?",
        "options": [
            "NumPy",
            "React",
            "Flask",
            "Express"
        ],
        "answer": "NumPy"
    },

    {
        "id": 12,
        "category": "Web Development",
        "question": "Which CSS property is used to change the text color?",
        "options": [
            "font-style",
            "color",
            "background",
            "text-size"
        ],
        "answer": "color"
    },

    {
        "id": 13,
        "category": "Web Development",
        "question": "Which HTTP method is commonly used to send data to a server?",
        "options": [
            "GET",
            "POST",
            "READ",
            "FETCH"
        ],
        "answer": "POST"
    },

    {
        "id": 14,
        "category": "Data Science",
        "question": "Which SQL clause is used to filter rows?",
        "options": [
            "ORDER BY",
            "GROUP BY",
            "WHERE",
            "SELECT"
        ],
        "answer": "WHERE"
    },

    {
        "id": 15,
        "category": "AI/ML",
        "question": "Which type of learning uses labeled training data?",
        "options": [
            "Supervised Learning",
            "Unsupervised Learning",
            "Random Learning",
            "Manual Learning"
        ],
        "answer": "Supervised Learning"
    },

    {
        "id": 16,
        "category": "Cyber Security",
        "question": "What does HTTPS provide for a website connection?",
        "options": [
            "Encrypted communication",
            "Faster CPU processing",
            "More storage",
            "Automatic backups"
        ],
        "answer": "Encrypted communication"
    },

    {
        "id": 17,
        "category": "Cloud Computing",
        "question": "What is cloud storage mainly used for?",
        "options": [
            "Storing data on remote servers",
            "Designing websites",
            "Writing CSS",
            "Compiling JavaScript"
        ],
        "answer": "Storing data on remote servers"
    },

    {
        "id": 18,
        "category": "Problem Solving",
        "question": "Which data structure follows the FIFO principle?",
        "options": [
            "Stack",
            "Queue",
            "Tree",
            "Graph"
        ],
        "answer": "Queue"
    },

    {
        "id": 19,
        "category": "AI/ML",
        "question": "Which of the following is commonly used to evaluate a classification model?",
        "options": [
            "Accuracy",
            "File Size",
            "Screen Resolution",
            "CPU Temperature"
        ],
        "answer": "Accuracy"
    },

    {
        "id": 20,
        "category": "Cyber Security",
        "question": "What is the purpose of authorization?",
        "options": [
            "To determine what an authenticated user is allowed to access",
            "To create a password",
            "To compress files",
            "To connect a database"
        ],
        "answer": "To determine what an authenticated user is allowed to access"
    }
]

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