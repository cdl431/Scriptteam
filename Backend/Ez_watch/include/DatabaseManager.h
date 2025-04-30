#pragma once

#include <memory>
#include <string>

#include <jdbc/cppconn/driver.h>
#include <jdbc/cppconn/connection.h>

class DatabaseManager {
public:
    DatabaseManager(const std::string& host   = "tcp://127.0.0.1:3306",
                    const std::string& user   = "root",
                    const std::string& passwd = "Jdtxb9873",
                    const std::string& schema = "ez_watch");

    std::shared_ptr<sql::Connection> connection() { return conn_; }

private:
    sql::Driver*                    driver_{nullptr};
    std::shared_ptr<sql::Connection> conn_;
};
