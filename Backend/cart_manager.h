#ifndef CART_MANAGER_H
#define CART_MANAGER_H

#include <string>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>

class CartManager {
public:
    CartManager(sql::Connection* dbConn);

    bool addItem(int userId, const std::string& productName, double price, int quantity);
    void viewCart(int userId);

private:
    sql::Connection* conn;
};

#endif