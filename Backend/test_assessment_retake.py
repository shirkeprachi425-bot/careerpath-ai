
import requests
import json

BASE_URL = "http://127.0.0.1:5000"

# Change this to an existing user's ID from your database
USER_ID = 5


def print_response(title, response):
    print("\n" + "-" * 40)
    print(title)
    print("Status:", response.status_code)

    try:
        print(json.dumps(response.json(), indent=2))
    except Exception:
        print(response.text)


# ==========================================
# 1. CHECK BACKEND
# ==========================================

print("=" * 40)
print("TESTING CAREERPATH BACKEND")
print("=" * 40)

response = requests.get(f"{BASE_URL}/")
print_response("Backend Home", response)


# ==========================================
# 2. GET ASSESSMENT QUESTIONS
# ==========================================

response = requests.get(
    f"{BASE_URL}/api/assessment/questions/{USER_ID}"
)

print_response(
    f"GET QUESTIONS FOR USER {USER_ID}",
    response
)

if response.status_code != 200:
    print("\n❌ Could not fetch questions.")
    print("Check USER_ID and make sure the backend is running.")
    exit()


data = response.json()

questions = data["questions"]
attempt_number = data["attemptNumber"]

print("\nAttempt Number:", attempt_number)
print("Number of Questions:", len(questions))


# ==========================================
# 3. DISPLAY QUESTIONS
# ==========================================

print("\nQUESTIONS RECEIVED:")

for question in questions:
    print(
        f'{question["id"]}. {question["question"]}'
    )


# ==========================================
# 4. CREATE ANSWERS
# ==========================================
#
# For testing, intentionally submit the
# FIRST OPTION for every question.
#
# This is NOT real user behavior.
# We only want to verify that submission works.
#

answers = []

for question in questions:

    answers.append({
        "questionId": question["id"],
        "answer": question["options"][0]
    })


# ==========================================
# 5. SUBMIT ASSESSMENT
# ==========================================

response = requests.post(
    f"{BASE_URL}/api/assessment/submit",
    json={
        "userId": USER_ID,
        "answers": answers
    }
)

print_response(
    "SUBMIT ASSESSMENT",
    response
)


# ==========================================
# 6. GET LATEST RESULT
# ==========================================

response = requests.get(
    f"{BASE_URL}/api/assessment/{USER_ID}"
)

print_response(
    "GET LATEST RESULT",
    response
)


# ==========================================
# 7. GET ASSESSMENT HISTORY
# ==========================================

response = requests.get(
    f"{BASE_URL}/api/assessment/{USER_ID}/history"
)

print_response(
    "GET ASSESSMENT HISTORY",
    response
)


# ==========================================
# 8. GET USER STATUS
# ==========================================

response = requests.get(
    f"{BASE_URL}/api/user/{USER_ID}/status"
)

print_response(
    "GET USER STATUS",
    response
)


# ==========================================
# 9. TEST RETAKE
# ==========================================
#
# Ask backend for questions again.
# If the first attempt was saved successfully,
# the question set should change.
#

response = requests.get(
    f"{BASE_URL}/api/assessment/questions/{USER_ID}"
)

print_response(
    "GET QUESTIONS FOR RETAKE",
    response
)

if response.status_code == 200:

    retake_data = response.json()

    print(
        "\nRetake Attempt Number:",
        retake_data["attemptNumber"]
    )

    print(
        "Retake Question IDs:",
        [q["id"] for q in retake_data["questions"]]
    )

print("\n" + "=" * 40)
print("TEST COMPLETED")
print("=" * 40)