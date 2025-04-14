#ifndef ACCOUNT_MANAGER_H
#define ACCOUNT_MANAGER_H

#include <string>
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/statement.h>
#include <cppconn/prepared_statement.h>

class AccountManager {
public:
    AccountManager(const std::string& host, const std::string& user,
                   const std::string& password, const std::string& database);
    ~AccountManager();

    bool createUser(const std::string& username, const std::string& password);
    bool loginUser(const std::string& username, const std::string& password);

private:
    sql::mysql::MySQL_Driver* driver;
    sql::Connection* conn;

    void initializeDatabase();
};

#endif