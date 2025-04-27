#pragma once

#include "DatabaseManager.h"
#include <vector>
#include <string>

struct User {
    int id;
    std::string username;
    std::string email;
    std::string password;
};

class UserManager {
private:
    DatabaseManager& db;

public:
    UserManager(DatabaseManager& dbManager);

    bool registerUser(const std::string& username, const std::string& email, const std::string& password);
    std::vector<User> getAllUsers() const;
};
