#pragma once
#include "crow/include/crow.h"

namespace ProductManager {
    crow::response getProducts(const crow::request& req);
    crow::response getProductById(const crow::request& req, int id);
    crow::response addProduct(const crow::request& req);
    crow::response updateProduct(const crow::request& req, int id);
    crow::response getAdminProducts(const crow::request& req);
    crow::response deleteProduct(const crow::request& req, int id);
}
