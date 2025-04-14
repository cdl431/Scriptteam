#ifndef USER_AUTH_H
#define USER_AUTH_H

#include <string>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>

class UserAuth {
public:
    UserAuth(sql::Connection* dbConn);

    bool registerUser(const std::string& username, const std::string& password);
    bool loginUser(const std::string& username, const std::string& password);

private:
    sql::Connection* conn;
    std::string hashPassword(const std::string& password);
};

#endif