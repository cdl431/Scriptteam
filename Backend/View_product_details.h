#ifndef PRODUCT_DETAIL_H
#define PRODUCT_DETAIL_H

#include <string>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>

class ProductDetail {
public:
    ProductDetail(sql::Connection* dbConn);

    void viewProductById(int productId);
    void viewProductByName(const std::string& name);

private:
    sql::Connection* conn;
    void displayResult(sql::ResultSet* res);
};

#endif