#pragma once

#include "DatabaseManager.h"
#include <vector>

struct CartItem {
    int productId;
    int quantity;
};

class CartManager {
private:
    DatabaseManager& db;

public:
    CartManager(DatabaseManager& dbManager);

    void addToCart(int userId, int productId, int quantity);
    void removeFromCart(int userId, int productId);
    std::vector<CartItem> getCartItems(int userId) const;
};
