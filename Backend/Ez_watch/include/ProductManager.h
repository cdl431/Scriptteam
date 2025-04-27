#pragma once

#include "DatabaseManager.h"
#include <vector>
#include <string>

struct Product {
    int id;
    std::string name;
    std::string description;
    double price;
};

class ProductManager {
private:
    DatabaseManager& db;

public:
    ProductManager(DatabaseManager& dbManager);

    bool addProduct(const Product& product);
    std::vector<Product> getAllProducts() const;
};
