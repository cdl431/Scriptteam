#include "UserManager.h"
#include "DatabaseManager.h"
#include <nlohmann/json.hpp>
#include <fstream>
#include <iostream>

using json = nlohmann::json;

UserManager::UserManager(DatabaseManager& dbManager) : db(dbManager) {}

bool UserManager::registerUser(const std::string& username, const std::string& email, const std::string& password) {
    json data = db.readJson();
    for (const auto& user : data["users"]) {
        if (user["email"] == email) {
            return false; // user already exists
        }
    }
    json newUser = {
        {"id", static_cast<int>(data["users"].size()) + 1},
        {"username", username},
        {"email", email},
        {"password", password}
    };
    data["users"].push_back(newUser);
    db.writeJson(data);
    return true;
}

std::optional<User> UserManager::loginUser(const std::string& email, const std::string& password) {
    json data = db.readJson();
    for (const auto& u : data["users"]) {
        if (u["email"] == email && u["password"] == password) {
            return User{
                u["id"],
                u["username"],
                u["email"],
                u["password"]
            };
        }
    }
    return std::nullopt;
}

std::vector<User> UserManager::getAllUsers() const {
    json data = db.readJson();
    std::vector<User> users;
    for (const auto& u : data["users"]) {
        users.push_back(User{
            u["id"],
            u["username"],
            u["email"],
            u["password"]
        });
    }
    return users;
}
