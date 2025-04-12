#ifndef PRODUCT_H
#define PRODUCT_H

#include "Database.h"
#include <string>

namespace std {

class Product {
private:
    Database* db;

public:
    Product(Database* db);

    std::string getAllProducts();
    std::string getProductByID(int productID);
};

}

#endif
