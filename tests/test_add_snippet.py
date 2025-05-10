import requests

url = "http://localhost:5000/snippet-ekle"
veri = {
    "username": "example", 
    "title": "example",
    "language": "Python",
    "code": "liste[::-1]"
}

response = requests.post(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())