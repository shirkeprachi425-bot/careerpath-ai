import requests

url = "http://127.0.0.1:5000/api/student-profile"

data = {
    "userId": 1,
    "education": "Graduation",
    "skills": "Python, React, SQL",
    "experience": "Fresher",
    "studyTime": "2 hours",
    "interests": "AI, Web Development"
}

response = requests.post(url, json=data)

print("STATUS:", response.status_code)
print("RESPONSE:", response.json())