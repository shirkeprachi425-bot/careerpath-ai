import urllib.request
import json

url = "https://127.0.0.1:5000/api/auth/signup"

data = {
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123"
}

json_data = json.dumps(data).encode("utf-8")

request = urllib.request.Request(
    url,
    data=json_data,
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(request) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode("utf-8"))

except urllib.error.HTTPError as error:
    print("Status:", error.code)
    print("Response:", error.read().decode("utf-8"))