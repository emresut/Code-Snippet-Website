import requests

url = "http://localhost:5000/snippet-guncelle"
veri = {
    "_id": "example",
    "new_title": "example2",
    "new_code": "exampleCode",
    "new_language": "Java"
}

response = requests.put(url, json=veri)
print("Status code:", response.status_code)
print("Incoming Response:", response.json())