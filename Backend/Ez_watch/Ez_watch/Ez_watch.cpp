/*#include <iostream>
#include <fstream>
#include "json.hpp"

// MySQL includes
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <cppconn/resultset.h>

using json = nlohmann::json;

int main() {
    std::ifstream jsonFile("data.json");
    if (!jsonFile.is_open()) {
        std::cerr << "❌ Failed to open data.json\n";
        return 1;
    }

    json jsonData;
    try {
        jsonFile >> jsonData;
    }
    catch (const json::parse_error& e) {
        std::cerr << "❌ JSON parse error: " << e.what() << "\n";
        return 1;
    }

    std::cout << "✅ Parsed JSON:\n" << jsonData.dump(4) << "\n";

    if (!jsonData.contains("email")) {
        std::cerr << "❌ JSON does not contain 'email' field.\n";
        return 1;
    }

    std::string email = jsonData.at("email").get<std::string>();
    std::cout << "📧 Email from JSON: " << email << "\n";

    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();

        // This will throw if connection fails
        std::unique_ptr<sql::Connection> con(driver->connect("tcp://MySQL80:3306", "root", "software"));

        if (con && con->isValid()) {
                std::cout << "✅ Connection to MySQL successful.\n";
        

            con->setSchema("ez_watch");

            std::unique_ptr<sql::PreparedStatement> pstmt(con->prepareStatement(
                "SELECT * FROM users WHERE email = ?"));
            pstmt->setString(1, email);  // Correct index is 1, not 2

            std::unique_ptr<sql::ResultSet> res(pstmt->executeQuery());
            while (res->next()) {
                std::cout << "email: " << res->getString("email") << std::endl;
            }
        }
        else {
            std::cerr << "Connection object is null or invalid.\n";
        }
    }
    catch (sql::SQLException& e) {
        std::cerr << "❌ SQL Error: " << e.what() << "\n";
        std::cerr << "MySQL error code: " << e.getErrorCode() << "\n";
        std::cerr << "SQLState: " << e.getSQLState() << "\n";
    }
    */
#include <cppconn/driver.h>
#include <cppconn/exception.h>
#include <cppconn/connection.h>
#include <mysql_driver.h>
#include <iostream>
#include <memory>

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();

        sql::ConnectOptionsMap connection_properties;
        connection_properties["hostName"] = "localhost";
        connection_properties["userName"] = "root";
        connection_properties["password"] = "software"; // double-check this!
        connection_properties["schema"] = "ez_watch";
        connection_properties["OPT_SSL_MODE"] = sql::SSL_MODE_DISABLED;

        std::unique_ptr<sql::Connection> con;

        try {
            con.reset(driver->connect(connection_properties));
            if (!con || !con->isValid()) {
                std::cerr << "❌ Connection is invalid or null." << std::endl;
                return 1;
            }

            std::cout << "✅ Connected successfully." << std::endl;
        }
        catch (const sql::SQLException& e) {
            std::cerr << "❌ SQLException during connect:" << std::endl;
            std::cerr << "Message: " << e.what() << std::endl;
            std::cerr << "MySQL Error Code: " << e.getErrorCode() << std::endl;
            std::cerr << "SQLState: " << e.getSQLState() << std::endl;
            return 1;
        }

    }
    catch (const std::exception& e) {
        std::cerr << "❌ General exception: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}



 //   return 0;
//}
