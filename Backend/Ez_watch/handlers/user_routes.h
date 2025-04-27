#pragma once
#include <crow.h>
#include "UserManager.h"
#include "middleware/auth_guard.h"

inline void registerUserRoutes(crow::SimpleApp& app, UserManager& userManager) {
    CROW_ROUTE(app, "/api/register").methods(crow::HTTPMethod::POST)
    ([&userManager](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        std::string username = body["username"].s();
        std::string email = body["email"].s();
        std::string password = body["password"].s();

        bool success = userManager.registerUser(username, email, password);
        if (!success) return crow::response(409, "User already exists");

        return crow::response(201, "User registered");
    });

    CROW_ROUTE(app, "/api/login").methods(crow::HTTPMethod::POST)
    ([&userManager](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        std::string email = body["email"].s();
        std::string password = body["password"].s();

        auto user = userManager.loginUser(email, password);
        if (!user) return crow::response(401, "Invalid credentials");

        Middleware::login(user->username);
        return crow::response(200, "Login successful");
    });

    CROW_ROUTE(app, "/api/logout").methods(crow::HTTPMethod::POST)
    ([] {
        Middleware::logout();
        return crow::response(200, "Logged out");
    });

    CROW_ROUTE(app, "/api/me").methods(crow::HTTPMethod::GET)
    ([] {
        if (!Middleware::isAuthenticated()) {
            return crow::response(401, "Unauthorized");
        }
        return crow::response{Middleware::getCurrentUser()};
    });
}
