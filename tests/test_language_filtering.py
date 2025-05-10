import requests

url = "http://localhost:5000/snippet-dil-filtreleme"
veri = {
    "username": "example",
    "language": "Python"
}

response = requests.post(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())