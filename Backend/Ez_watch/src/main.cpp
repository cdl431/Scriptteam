#include "crow.h"
#include "DatabaseManager.h"
#include "AuthManager.h"
#include "UserManager.h"
#include "ProductManager.h"
#include "CartManager.h"

int main() {
    crow::SimpleApp app;

    // Connect to database
    DatabaseManager db("data.json");

    // Managers
    AuthManager authManager(db);
    UserManager userManager(db);
    ProductManager productManager(db);
    CartManager cartManager(db);

    // Routes!

    CROW_ROUTE(app, "/api/test")
    ([]() {
        return crow::response(200, "Backend is working!");
    });

    CROW_ROUTE(app, "/api/signup").methods("POST"_method)
    ([&](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string username = body["username"].s();
        std::string email = body["email"].s();
        std::string password = body["password"].s();

        if (userManager.registerUser(username, email, password)) {
            return crow::response(201, "User registered successfully.");
        } else {
            return crow::response(409, "User already exists.");
        }
    });

    CROW_ROUTE(app, "/api/login").methods("POST"_method)
    ([&](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        std::string email = body["email"].s();
        std::string password = body["password"].s();

        if (authManager.login(email, password)) {
            return crow::response(200, "Login successful.");
        } else {
            return crow::response(401, "Invalid credentials.");
        }
    });

    app.port(52520).multithreaded().run();
}
