#include "ProductManager.h"
#include <nlohmann/json.hpp>

ProductManager::ProductManager(DatabaseManager& dbManager) : db(dbManager) {}

bool ProductManager::addProduct(const Product& product) {
    auto data = db.readJson();
    int newId = data["products"].size() + 1;

    data["products"].push_back({
        {"id", newId},
        {"name", product.name},
        {"description", product.description},
        {"price", product.price}
    });

    db.writeJson(data);
    return true;
}

std::vector<Product> ProductManager::getAllProducts() const {
    auto data = db.readJson();
    std::vector<Product> products;
    for (const auto& item : data["products"]) {
        products.push_back({
            item["id"],
            item["name"],
            item["description"],
            item["price"]
        });
    }
    return products;
}
