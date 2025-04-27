#pragma once

#include "crow.h"
#include "DatabaseManager.h"

class AuthManager {
public:
    AuthManager(DatabaseManager& dbManager);
    bool login(const std::string& email, const std::string& password);

private:
    DatabaseManager& db;
};
