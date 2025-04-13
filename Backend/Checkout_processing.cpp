#include "checkout_manager.h"
#include <iostream>

CheckoutManager::CheckoutManager(sql::Connection* dbConn) {
    conn = dbConn;
}

bool CheckoutManager::addToCart(int userId, const std::string& product, double price, int quantity) {
    try {
        auto* stmt = conn->prepareStatement(
            "INSERT INTO cart (user_id, product_name, price, quantity) VALUES (?, ?, ?, ?)"
        );
        stmt->setInt(1, userId);
        stmt->setString(2, product);
        stmt->setDouble(3, price);
        stmt->setInt(4, quantity);
        stmt->execute();
        delete stmt;
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Add to cart failed: " << e.what() << std::endl;
        return false;
    }
}

bool CheckoutManager::checkout(int userId) {
    try {
        // 1. Calculate total
        auto* selectStmt = conn->prepareStatement(
            "SELECT price, quantity FROM cart WHERE user_id = ?"
        );
        selectStmt->setInt(1, userId);
        auto* result = selectStmt->executeQuery();

        double total = 0.0;
        while (result->next()) {
            total += result->getDouble("price") * result->getInt("quantity");
        }

        delete result;
        delete selectStmt;

        if (total == 0.0) {
            std::cerr << "Cart is empty.\n";
            return false;
        }

        // 2. Create order
        auto* orderStmt = conn->prepareStatement(
            "INSERT INTO orders (user_id, total) VALUES (?, ?)"
        );
        orderStmt->setInt(1, userId);
        orderStmt->setDouble(2, total);
        orderStmt->execute();
        delete orderStmt;

        // 3. Clear cart
        auto* clearStmt = conn->prepareStatement("DELETE FROM cart WHERE user_id = ?");
        clearStmt->setInt(1, userId);
        clearStmt->execute();
        delete clearStmt;

        std::cout << "Checkout complete. Total: $" << total << std::endl;
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Checkout failed: " << e.what() << std::endl;
        return false;
    }
}

bool CheckoutManager::simulatePayment(int orderId) {
    try {
        auto* stmt = conn->prepareStatement(
            "UPDATE orders SET status = 'Paid' WHERE id = ?"
        );
        stmt->setInt(1, orderId);
        stmt->execute();
        delete stmt;
        std::cout << "Payment simulated for order #" << orderId << std::endl;
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Payment failed: " << e.what() << std::endl;
        return false;
    }
}

#include <iostream>
#include "Managing_my_Account.h"
#include "checkout_manager.h"

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        sql::Connection* conn = driver->connect("tcp://127.0.0.1:3306", "your_user", "your_pass");
        conn->setSchema("your_database");

        AccountManager account(conn);
        CheckoutManager checkout(conn);

        int userId = 1;

       
        checkout.addToCart(userId, "Mouse", 25.99, 1);
        checkout.addToCart(userId, "Keyboard", 55.50, 1);

     
        checkout.checkout(userId);

      
        checkout.simulatePayment(1);

        delete conn;
    } catch (sql::SQLException& e) {
        std::cerr << "Connection error: " << e.what() << std::endl;
    }

    return 0;
}