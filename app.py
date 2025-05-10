from flask import Flask, jsonify, request
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId
from flask_cors import CORS
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)

load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
client = pymongo.MongoClient(mongo_uri)
db = client["gorev_veritabani"]
kullanici_collection = db["kullanicilar"]
snippets_collection = db["snippets"]


@app.route("/register", methods=["POST"])
def register():
    veri = request.get_json()
    username = veri.get("username")
    password = veri.get("password")
    confirm_password = veri.get("confirm_password")

    if not username or not password or not confirm_password:
        return jsonify({"hata": "You must fill in all fields."}), 400

    if password != confirm_password:
        return jsonify({"hata": "Passwords do not match."}), 400

    if kullanici_collection.find_one({"username": username}):
        return jsonify({"hata": "This username is already taken."}), 409

    password_hash = generate_password_hash(password)
    kullanici_collection.insert_one({
        "username": username,
        "password_hash": password_hash
    })

    return jsonify({"mesaj": "Registration successful!"}), 201


@app.route("/login", methods=["POST"])
def login():
    veri = request.get_json()
    username = veri.get("username")
    password = veri.get("password")

    if not username or not password:
        return jsonify({"hata": "Username and password are required."}), 400

    kullanici = kullanici_collection.find_one({"username": username})

    if not kullanici:
        return jsonify({"hata": "User not found."}), 404

    if not check_password_hash(kullanici["password_hash"], password):
        return jsonify({"hata": "Password is incorrect."}), 401

    return jsonify({"mesaj": f"Welcome {username}!"}), 200


@app.route("/snippet-ekle", methods=["POST"])
def snippet_ekle():
    veri = request.get_json()
    username = veri.get("username")
    title = veri.get("title")
    language = veri.get("language")
    code = veri.get("code")

    if not all([username, title, language, code]):
        return jsonify({"hata": "You must fill in all fields."}), 400

    if not kullanici_collection.find_one({"username": username}):
        return jsonify({"hata": "User not found."}), 404

    snippet = {
        "username": username,
        "title": title,
        "language": language,
        "code": code
    }

    result = snippets_collection.insert_one(snippet)

    return jsonify({
        "mesaj": "Snippet added successfully!",
        "snippet": {
            "_id": str(result.inserted_id),
            "username": username,
            "title": title,
            "language": language,
            "code": code
        }
    }), 201



@app.route("/snippetler", methods=["POST"])
def snippet_listele():
    veri = request.get_json()
    username = veri.get("username")

    if not username:
        return jsonify({"hata": "Username required."}), 400

    if not kullanici_collection.find_one({"username": username}):
        return jsonify({"hata": "User not found."}), 404

    snippetler_raw = snippets_collection.find({"username": username})
    snippetler = []

    for snippet in snippetler_raw:
        snippet["_id"] = str(snippet["_id"])
        snippetler.append(snippet)

    return jsonify({"snippets": snippetler}), 200


@app.route("/snippet-guncelle", methods=["PUT"])
def snippet_guncelle():
    veri = request.get_json()
    snippet_id = veri.get("_id")
    new_title = veri.get("new_title")
    new_code = veri.get("new_code")
    new_language = veri.get("new_language")

    if not all([snippet_id, new_title, new_code, new_language]):
        return jsonify({"hata": "All fields are required."}), 400

    try:
        _id_obj = ObjectId(snippet_id)
    except:
        return jsonify({"hata": "Invalid _id format."}), 400

    filtre = {"_id": _id_obj}
    new_veri = {
        "$set": {
            "title": new_title,
            "code": new_code,
            "language": new_language
        }
    }

    sonuc = snippets_collection.update_one(filtre, new_veri)

    if sonuc.matched_count == 0:
        return jsonify({"hata": "No snippets found."}), 404

    return jsonify({"mesaj": "The snippet is updated successfully."}), 200


@app.route("/snippet-sil", methods=["DELETE"])
def snippet_sil():
    veri = request.get_json()
    snippet_id = veri.get("_id")

    if not snippet_id:
        return jsonify({"hata": "_id field is required."}), 400

    try:
        _id_obj = ObjectId(snippet_id)
    except:
        return jsonify({"hata": "Invalid _id format."}), 400

    sonuc = snippets_collection.delete_one({"_id": _id_obj})

    if sonuc.deleted_count == 0:
        return jsonify({"hata": "No snippets found to delete."}), 404

    return jsonify({"mesaj": "The snippet is deleted successfully."}), 200


@app.route("/snippet-language-filtreleme", methods=["POST"])
def snippet_language_filtreleme():
    veri = request.get_json()
    username = veri.get("username")
    language = veri.get("language")

    if not all([username, language]):
        return jsonify({"hata": "Username and language fields are required."}), 400

    if not kullanici_collection.find_one({"username": username}):
        return jsonify({"hata": "User not found."}), 404

    snippetler_raw = snippets_collection.find(
        {"username": username, "language": language}
    )
    
    snippetler = []
    for snippet in snippetler_raw:
        snippet["_id"] = str(snippet["_id"])
        snippetler.append(snippet)

    return jsonify({"snippetler": snippetler}), 200


if __name__ == "__main__":
    app.run(debug=False)