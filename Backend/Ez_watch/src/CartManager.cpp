#include "CartManager.h"
#include <nlohmann/json.hpp>

CartManager::CartManager(DatabaseManager& dbManager) : db(dbManager) {}

void CartManager::addToCart(int userId, int productId, int quantity) {
    auto data = db.readJson();
    auto& carts = data["carts"];
    bool found = false;
    for (auto& item : carts) {
        if (item["userId"] == userId && item["productId"] == productId) {
            item["quantity"] = item["quantity"].get<int>() + quantity;
            found = true;
            break;
        }
    }
    if (!found) {
        carts.push_back({
            {"userId", userId},
            {"productId", productId},
            {"quantity", quantity}
        });
    }
    db.writeJson(data);
}

void CartManager::removeFromCart(int userId, int productId) {
    auto data = db.readJson();
    auto& carts = data["carts"];
    for (auto it = carts.begin(); it != carts.end(); ++it) {
        if ((*it)["userId"] == userId && (*it)["productId"] == productId) {
            carts.erase(it);
            break;
        }
    }
    db.writeJson(data);
}

std::vector<CartItem> CartManager::getCartItems(int userId) const {
    auto data = db.readJson();
    std::vector<CartItem> items;
    for (const auto& item : data["carts"]) {
        if (item["userId"] == userId) {
            items.push_back({
                item["productId"],
                item["quantity"]
            });
        }
    }
    return items;
}
