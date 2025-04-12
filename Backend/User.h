#pragma once
#include "Database.h"
#include <string>
#include <crow_all.h>

namespace std {

class User {
private:
    Database* db;

public:
    User(Database* database);
    crow::json::wvalue login(const std::string& email, const std::string& password);
    crow::json::wvalue registerUser(const std::string& name, const std::string& email, const std::string& password);
    crow::json::wvalue updateProfile(int userID, const std::string& name, const std::string& email);
};

}
