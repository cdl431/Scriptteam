#pragma once
#include "crow/include/crow.h"

namespace AuthManager {
    crow::response login(const crow::request& req);
    crow::response signup(const crow::request& req);
    crow::response logout(const crow::request& req);
}
