#include "AuthManager.h"
#include "../storage/database.h"
#include "json.hpp"

using json = nlohmann::json;

namespace AuthManager {

    crow::response login(const crow::request& req) {
        json data = json::parse(req.data);
        std::string email = data["email"];
        std::string password = data["password"];
        
        json users = database::readAll("users");
        for (const auto& user : users) {
            if (user["email"] == email && user["password"] == password) {
                return crow::response(200, user.dump());
            }
        }
        return crow::response(401, "Invalid credentials");
    }

    crow::response signup(const crow::request& req) {
        json newUser = json::parse(req.data);
        std::string newEmail = newUser["email"];
        std::string newUsername = newUser["username"];

        json users = database::readAll("users");
        for (const auto& user : users) {
            if (user["email"] == newEmail || user["username"] == newUsername) {
                return crow::response(400, json({{"error", "User already exists"}}).dump());
            }
        }
    
        database::add("users", newUser);
        return crow::response(201, "User created");
    }
    

    crow::response logout(const crow::request& req) {
        
        return crow::response(200, "Logged out");
    }

}
