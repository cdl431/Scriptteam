#ifndef CHECKOUT_MANAGER_H
#define CHECKOUT_MANAGER_H

#include <string>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>

class CheckoutManager {
public:
    CheckoutManager(sql::Connection* dbConn);
    bool addToCart(int userId, const std::string& product, double price, int quantity);
    bool checkout(int userId);
    bool simulatePayment(int orderId);

private:
    sql::Connection* conn;
};
