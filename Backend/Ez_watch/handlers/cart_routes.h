#pragma once
#include "crow.h"
#include "../include/CartManager.h"

void setupCartRoutes(crow::SimpleApp& app, CartManager& cartManager) {

    CROW_ROUTE(app, "/cart/<int>")
    .methods(crow::HTTPMethod::GET)([&cartManager](int userId) {
        return crow::response(cartManager.viewCart(userId));
    });

    CROW_ROUTE(app, "/cart/<int>/add")
    .methods(crow::HTTPMethod::POST)([&cartManager](const crow::request& req, int userId) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }
        int productId = body["productId"].i();
        cartManager.addToCart(userId, productId);
        return crow::response(201, "Product added to cart!");
    });

    CROW_ROUTE(app, "/cart/<int>/remove")
    .methods(crow::HTTPMethod::POST)([&cartManager](const crow::request& req, int userId) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }
        int productId = body["productId"].i();
        cartManager.removeFromCart(userId, productId);
        return crow::response(200, "Product removed from cart!");
    });
}
