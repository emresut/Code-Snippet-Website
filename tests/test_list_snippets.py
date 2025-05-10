import requests

url = "http://localhost:5000/snippetler"
veri = {
    "username": "example"
}

response = requests.post(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())