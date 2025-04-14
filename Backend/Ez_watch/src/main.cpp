#include "crow/include/crow.h"
#include "ProductManager.h"
#include "CartManager.h"
#include "UserManager.h"
#include "AuthManager.h"

int main()
{
    crow::SimpleApp app;

    // Test root
    CROW_ROUTE(app, "/")([]() {
        return "Ez_watch backend is up and running!";
    });

    // Homepage + Product Listing
    CROW_ROUTE(app, "/api/products")
    .methods("GET"_method)(ProductManager::getProducts);

    CROW_ROUTE(app, "/api/products/<string>")
    .methods("GET"_method)(ProductManager::getProductById);

    // Add/Edit Product
    CROW_ROUTE(app, "/api/products")
    .methods("POST"_method)(ProductManager::addProduct);

    CROW_ROUTE(app, "/api/products/<string>")
    .methods("PUT"_method)(ProductManager::updateProduct);

    // Admin Controls
    CROW_ROUTE(app, "/api/admin/products")
    .methods("GET"_method)(ProductManager::getAdminProducts);

    CROW_ROUTE(app, "/api/products/<string>")
    .methods("DELETE"_method)(ProductManager::deleteProduct);

    // Cart
    CROW_ROUTE(app, "/api/cart/<string>")
    .methods("GET"_method)(CartManager::getCart);

    CROW_ROUTE(app, "/api/cart/add")
    .methods("POST"_method)(CartManager::addToCart);

    CROW_ROUTE(app, "/api/cart/remove")
    .methods("POST"_method)(CartManager::removeFromCart);

    // Auth
    CROW_ROUTE(app, "/api/auth/login")
    .methods("POST"_method)(AuthManager::login);

    CROW_ROUTE(app, "/api/auth/signup")
    .methods("POST"_method)(AuthManager::signup);

    CROW_ROUTE(app, "/api/auth/logout")
    .methods("POST"_method)(AuthManager::logout);

    // Account
    CROW_ROUTE(app, "/api/user/<string>")
    .methods("GET"_method)(UserManager::getUserProfile);

    CROW_ROUTE(app, "/api/user/<string>")
    .methods("PUT"_method)(UserManager::updateUserProfile);

    app.port(18080).multithreaded().run();
}
