import requests

url = "http://localhost:5000/register"
veri = {
    "username": "example",
    "password": "example1",
    "confirm_password": "example1"
}

response = requests.post(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())