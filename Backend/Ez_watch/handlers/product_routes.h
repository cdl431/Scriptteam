#pragma once
#include "crow.h"
#include "../include/ProductManager.h"

void setupProductRoutes(crow::SimpleApp& app, ProductManager& productManager) {
    
    CROW_ROUTE(app, "/products")
    .methods(crow::HTTPMethod::GET)([&productManager]() {
        return crow::response(productManager.listProducts());
    });

    CROW_ROUTE(app, "/products/add")
    .methods(crow::HTTPMethod::POST)([&productManager](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }
        productManager.addProduct(body);
        return crow::response(201, "Product added successfully!");
    });

    CROW_ROUTE(app, "/products/<int>")
    .methods(crow::HTTPMethod::PUT)([&productManager](const crow::request& req, int id) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }
        productManager.updateProduct(id, body);
        return crow::response(200, "Product updated successfully!");
    });

    CROW_ROUTE(app, "/products/<int>")
    .methods(crow::HTTPMethod::DELETE)([&productManager](int id) {
        productManager.deleteProduct(id);
        return crow::response(200, "Product deleted successfully!");
    });

}
