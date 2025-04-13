#include "View_product_details.h"
#include <iostream>

ProductDetail::ProductDetail(sql::Connection* dbConn) {
    conn = dbConn;
}

void ProductDetail::viewProductById(int productId) {
    try {
        auto* stmt = conn->prepareStatement("SELECT * FROM products WHERE id = ?");
        stmt->setInt(1, productId);
        auto* res = stmt->executeQuery();

        if (res->next()) {
            displayResult(res);
        } else {
            std::cout << "Product not found.\n";
        }

        delete res;
        delete stmt;
    } catch (sql::SQLException& e) {
        std::cerr << "Error viewing product by ID: " << e.what() << std::endl;
    }
}

void ProductDetail::viewProductByName(const std::string& name) {
    try {
        auto* stmt = conn->prepareStatement("SELECT * FROM products WHERE name = ?");
        stmt->setString(1, name);
        auto* res = stmt->executeQuery();

        if (res->next()) {
            displayResult(res);
        } else {
            std::cout << "Product not found.\n";
        }

        delete res;
        delete stmt;
    } catch (sql::SQLException& e) {
        std::cerr << "Error viewing product by name: " << e.what() << std::endl;
    }
}

void ProductDetail::displayResult(sql::ResultSet* res) {
    std::cout << "\n--- Product Details ---\n";
    std::cout << "ID:         " << res->getInt("id") << "\n";
    std::cout << "Name:       " << res->getString("name") << "\n";
    std::cout << "Category:   " << res->getString("category") << "\n";
    std::cout << "Price:      $" << res->getDouble("price") << "\n";
    std::cout << "Description:\n" << res->getString("description") << "\n";
    std::cout << "------------------------\n";
}

#include <iostream>
#include "View_product_details.h"

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        sql::Connection* conn = driver->connect("tcp://127.0.0.1:3306", "your_user", "your_pass");
        conn->setSchema("your_database");

        ProductDetail viewer(conn);

      
        viewer.viewProductById(1);

        
        viewer.viewProductByName("Gaming Mouse");

        delete conn;
    } catch (sql::SQLException& e) {
        std::cerr << "Connection error: " << e.what() << std::endl;
    }

    return 0;
}