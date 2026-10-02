import sqlite3

DB_NAME = "careerpath.db"

conn = sqlite3.connect(DB_NAME)
conn.row_factory = sqlite3.Row

cursor = conn.cursor()

cursor.execute("""
    SELECT
        id,
        user_id,
        education,
        skills,
        experience,
        study_time,
        interests
    FROM student_profiles
""")

profiles = cursor.fetchall()

print("\n========== STUDENT PROFILES ==========\n")

if not profiles:
    print("No student profiles found.")

else:
    for profile in profiles:
        print("Profile ID :", profile["id"])
        print("User ID    :", profile["user_id"])
        print("Education  :", profile["education"])
        print("Skills     :", profile["skills"])
        print("Experience :", profile["experience"])
        print("Study Time :", profile["study_time"])
        print("Interests  :", profile["interests"])
        print("--------------------------------------")

conn.close()