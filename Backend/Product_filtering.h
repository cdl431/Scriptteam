#ifndef PRODUCT_MANAGER_H
#define PRODUCT_MANAGER_H

#include <string>
#include <vector>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>

struct Product {
    int id;
    std::string name;
    std::string description;
    std::string category;
    double price;
};

class ProductManager {
public:
    ProductManager(sql::Connection* dbConn);

    bool addProduct(const std::string& name, const std::string& description,
                    const std::string& category, double price);
    
    std::vector<Product> filterProducts(const std::string& category = "",
                                        double minPrice = 0.0,
                                        double maxPrice = 1e9,
                                        const std::string& keyword = "");

    void displayProducts(const std::vector<Product>& products);

private:
    sql::Connection* conn;
};

#endif
