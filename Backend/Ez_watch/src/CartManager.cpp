#include "CartManager.h"
#include "../storage/database.h"
#include "json.hpp"

using json = nlohmann::json;

namespace CartManager {

    crow::response getCart(const crow::request& req, const std::string& userId) {
        json cart = database::readAll("cart");

        json userCart = json::array();
        for (const auto& item : cart) {
            if (item["userId"] == userId) {
                userCart.push_back(item);
            }
        }

        return crow::response(200, userCart.dump());
    }

    crow::response addToCart(const crow::request& req) {
        json data = json::parse(req.body);
        database::add("cart", data);
        return crow::response(200, "Added to cart");
    }

    crow::response removeFromCart(const crow::request& req) {
        json data = json::parse(req.body);
        std::string userId = data["userId"];
        int productId = data["productId"];

        bool removed = database::remove("cart", [&](const json& item) {
            return item["userId"] == userId && item["productId"] == productId;
        });

        if (removed)
            return crow::response(200, "Removed from cart");
        else
            return crow::response(404, "Item not found in cart");
    }

}
