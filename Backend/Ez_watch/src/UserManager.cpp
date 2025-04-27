#include "UserManager.h"
#include <nlohmann/json.hpp>

UserManager::UserManager(DatabaseManager& dbManager) : db(dbManager) {}

bool UserManager::registerUser(const std::string& username, const std::string& email, const std::string& password) {
    auto data = db.readJson();
    int newId = data["users"].size() + 1;

    for (const auto& user : data["users"]) {
        if (user["email"] == email) {
            return false; // Email already exists
        }
    }

    data["users"].push_back({
        {"id", newId},
        {"username", username},
        {"email", email},
        {"password", password}
    });

    db.writeJson(data);
    return true;
}

std::vector<User> UserManager::getAllUsers() const {
    auto data = db.readJson();
    std::vector<User> users;
    for (const auto& item : data["users"]) {
        users.push_back({
            item["id"],
            item["username"],
            item["email"],
            item["password"]
        });
    }
    return users;
}
