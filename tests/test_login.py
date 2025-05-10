import requests

url = "http://localhost:5000/login"
veri = {
    "username": "example", 
    "password": "example"          
}

response = requests.post(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())