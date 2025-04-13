#include "cart_manager.h"
#include <iostream>

CartManager::CartManager(sql::Connection* dbConn) {
    conn = dbConn;
}

bool CartManager::addItem(int userId, const std::string& productName, double price, int quantity) {
    try {
        
        sql::PreparedStatement* checkStmt = conn->prepareStatement(
            "SELECT quantity FROM cart WHERE user_id = ? AND product_name = ?"
        );
        checkStmt->setInt(1, userId);
        checkStmt->setString(2, productName);
        sql::ResultSet* res = checkStmt->executeQuery();

        if (res->next()) {
            
            int currentQty = res->getInt("quantity");
            delete res;
            delete checkStmt;

            sql::PreparedStatement* updateStmt = conn->prepareStatement(
                "UPDATE cart SET quantity = ?, price = ? WHERE user_id = ? AND product_name = ?"
            );
            updateStmt->setInt(1, currentQty + quantity);
            updateStmt->setDouble(2, price);
            updateStmt->setInt(3, userId);
            updateStmt->setString(4, productName);
            updateStmt->execute();
            delete updateStmt;
        } else {
            delete res;
            delete checkStmt;

            sql::PreparedStatement* insertStmt = conn->prepareStatement(
                "INSERT INTO cart (user_id, product_name, price, quantity) VALUES (?, ?, ?, ?)"
            );
            insertStmt->setInt(1, userId);
            insertStmt->setString(2, productName);
            insertStmt->setDouble(3, price);
            insertStmt->setInt(4, quantity);
            insertStmt->execute();
            delete insertStmt;
        }

        std::cout << "Added " << quantity << " x " << productName << " to cart.\n";
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Error adding to cart: " << e.what() << std::endl;
        return false;
    }
}

void CartManager::viewCart(int userId) {
    try {
        sql::PreparedStatement* stmt = conn->prepareStatement(
            "SELECT product_name, price, quantity FROM cart WHERE user_id = ?"
        );
        stmt->setInt(1, userId);
        sql::ResultSet* res = stmt->executeQuery();

        std::cout << "Cart for user " << userId << ":\n";
        while (res->next()) {
            std::cout << "- " << res->getString("product_name")
                      << " | $" << res->getDouble("price")
                      << " x" << res->getInt("quantity") << "\n";
        }

        delete res;
        delete stmt;
    } catch (sql::SQLException& e) {
        std::cerr << "Error viewing cart: " << e.what() << std::endl;
    }
}

#include <iostream>
#include "cart_manager.h"

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        sql::Connection* conn = driver->connect("tcp://127.0.0.1:3306", "your_user", "your_pass");
        conn->setSchema("your_database");

        CartManager cart(conn);
        int userId = 1;

        // Add items
        cart.addItem(userId, "Laptop", 999.99, 1);
        cart.addItem(userId, "Laptop", 999.99, 1); // adds quantity
        cart.addItem(userId, "Mouse", 25.00, 2);

        // View cart
        cart.viewCart(userId);

        delete conn;
    } catch (sql::SQLException& e) {
        std::cerr << "Connection error: " << e.what() << std::endl;
    }

    return 0;
}