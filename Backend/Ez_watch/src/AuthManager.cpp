#include "AuthManager.h"

AuthManager::AuthManager(DatabaseManager& dbManager)
    : db(dbManager) {}

bool AuthManager::login(const std::string& email, const std::string& password) {
    auto data = db.readJson();
    for (const auto& user : data["users"]) {
        if (user["email"] == email && user["password"] == password) {
            return true;
        }
    }
    return false;
}
