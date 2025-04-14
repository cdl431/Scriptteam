#pragma once
#include "crow/include/crow.h"

namespace CartManager {
    crow::response getCart(const crow::request& req, const std::string& userId);
    crow::response addToCart(const crow::request& req);
    crow::response removeFromCart(const crow::request& req);
}
