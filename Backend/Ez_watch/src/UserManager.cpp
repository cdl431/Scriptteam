#include "UserManager.h"
#include "../storage/database.h"
#include "json.hpp"

using json = nlohmann::json;

namespace UserManager {

    crow::response getUserProfile(const crow::request& req, const std::string& userId) {
        json users = database::readAll("users");
        for (const auto& user : users) {
            if (user["id"] == userId) {
                return crow::response(200, user.dump());
            }
        }
        return crow::response(404, "User not found");
    }

    crow::response updateUserProfile(const crow::request& req, const std::string& userId) {
        json newData = json::parse(req.body);
        bool updated = database::edit("users", userId, newData);
        if (updated)
            return crow::response(200, "User updated");
        else
            return crow::response(404, "User not found");
    }

}
