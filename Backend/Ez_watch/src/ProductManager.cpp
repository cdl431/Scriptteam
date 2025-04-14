#include "ProductManager.h"
#include "../storage/database.h"
#include "json.hpp"

using json = nlohmann::json;

namespace ProductManager {
    crow::response getProducts(const crow::request&) {
        return crow::response(200, database::readAll("products"));
    }

    crow::response addProduct(const crow::request& req) {
        json data = json::parse(req.body);
        database::add("products", data);
        return crow::response(200, "Product added");
    }

    crow::response updateProduct(const crow::request& req, int id) {
        json data = json::parse(req.body);
        database::update("products", id, data);
        return crow::response(200, "Product edited");
    }

    crow::response getProductById(const crow::request& req, int id) {
        json all = database::readAll("products");
        for (const auto& product : all) {
            if (product["id"] == id) {
                return crow::response(200, product.dump());
            }
        }
        return crow::response(404, "Product not found");
    }
    
    crow::response getAdminProducts(const crow::request& req) {
        return getProducts(req);
    }
    
    crow::response deleteProduct(const crow::request& req, int id) {
        bool success = database::remove("products", id);
        if (success)
            return crow::response(200, "Product deleted");
        else
            return crow::response(404, "Product not found");
    }
    
}
