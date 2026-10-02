import requests

url = "http://127.0.0.1:5000/api/assessment/submit"

data = {
    "userId": 5,
    "answers": [
        "Pandas",
        "HTML",
        "React",
        "SELECT",
        "Linear Regression",
        "Authentication",
        "AWS",
        "To solve a problem step by step",
        "Machine Learning",
        "T9#kL2@pQ7!"
    ]
}

response = requests.post(url, json=data)

print("Status:", response.status_code)
print("Response:", response.json())