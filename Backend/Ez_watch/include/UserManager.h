#pragma once
#include "crow/include/crow.h"

namespace UserManager {
    crow::response getUserProfile(const crow::request& req, const std::string& userId);
    crow::response updateUserProfile(const crow::request& req, const std::string& userId);

    crow::response getAllUsers(const crow::request& req); 
}
