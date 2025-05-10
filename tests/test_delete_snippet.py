import requests

url = "http://localhost:5000/snippet-sil"
veri = {
    "_id": "example"
}

response = requests.delete(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())