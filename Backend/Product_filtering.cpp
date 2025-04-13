#include "Product_filtering.h"
#include <iostream>

ProductManager::ProductManager(sql::Connection* dbConn) {
    conn = dbConn;
}

bool ProductManager::addProduct(const std::string& name, const std::string& description,
                                const std::string& category, double price) {
    try {
        auto* stmt = conn->prepareStatement(
            "INSERT INTO products (name, description, category, price) VALUES (?, ?, ?, ?)"
        );
        stmt->setString(1, name);
        stmt->setString(2, description);
        stmt->setString(3, category);
        stmt->setDouble(4, price);
        stmt->execute();
        delete stmt;
        std::cout << "Product added: " << name << "\n";
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Error adding product: " << e.what() << std::endl;
        return false;
    }
}

std::vector<Product> ProductManager::filterProducts(const std::string& category,
                                                    double minPrice,
                                                    double maxPrice,
                                                    const std::string& keyword) {
    std::vector<Product> result;
    try {
        std::string query = "SELECT * FROM products WHERE price BETWEEN ? AND ?";
        if (!category.empty()) query += " AND category = ?";
        if (!keyword.empty()) query += " AND name LIKE ?";

        auto* stmt = conn->prepareStatement(query);

        int paramIndex = 1;
        stmt->setDouble(paramIndex++, minPrice);
        stmt->setDouble(paramIndex++, maxPrice);
        if (!category.empty()) stmt->setString(paramIndex++, category);
        if (!keyword.empty()) stmt->setString(paramIndex++, "%" + keyword + "%");

        auto* res = stmt->executeQuery();

        while (res->next()) {
            Product p;
            p.id = res->getInt("id");
            p.name = res->getString("name");
            p.description = res->getString("description");
            p.category = res->getString("category");
            p.price = res->getDouble("price");
            result.push_back(p);
        }

        delete res;
        delete stmt;
    } catch (sql::SQLException& e) {
        std::cerr << "Error filtering products: " << e.what() << std::endl;
    }

    return result;
}

void ProductManager::displayProducts(const std::vector<Product>& products) {
    std::cout << "Product List:\n";
    for (const auto& p : products) {
        std::cout << "[" << p.id << "] " << p.name << " - $" << p.price
                  << " | " << p.category << "\n  " << p.description << "\n\n";
    }
}

#include <iostream>
#include "Product_filtering.h"

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        sql::Connection* conn = driver->connect("tcp://127.0.0.1:3306", "your_user", "your_pass");
        conn->setSchema("your_database");

        ProductManager products(conn);

       
        products.addProduct("Gaming Mouse", "RGB lights and high DPI", "Electronics", 49.99);
        products.addProduct("Wireless Keyboard", "Quiet keys", "Electronics", 69.99);
        products.addProduct("Coffee Mug", "Ceramic, 350ml", "Kitchen", 9.99);

        auto electronics = products.filterProducts("Electronics");
        std::cout << "\n-- Electronics --\n";
        products.displayProducts(electronics);

        
        auto keywordSearch = products.filterProducts("", 0.0, 100.0, "mouse");
        std::cout << "\n-- Keyword 'mouse' --\n";
        products.displayProducts(keywordSearch);

        delete conn;
    } catch (sql::SQLException& e) {
        std::cerr << "Connection error: " << e.what() << std::endl;
    }

    return 0;
}