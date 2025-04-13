#include "User_Registration_logincode.h"
#include <iostream>
#include <sstream>
#include <iomanip>
#include <openssl/sha.h>  // For password hashing

UserAuth::UserAuth(sql::Connection* dbConn) {
    conn = dbConn;
}

// Simple SHA-256 hash function
std::string UserAuth::hashPassword(const std::string& password) {
    unsigned char hash[SHA256_DIGEST_LENGTH];
    SHA256(reinterpret_cast<const unsigned char*>(password.c_str()), password.length(), hash);

    std::stringstream ss;
    for (int i = 0; i < SHA256_DIGEST_LENGTH; i++)
        ss << std::hex << std::setw(2) << std::setfill('0') << (int)hash[i];
    
    return ss.str();
}

bool UserAuth::registerUser(const std::string& username, const std::string& password) {
    try {
        // Check if user exists
        auto* checkStmt = conn->prepareStatement("SELECT id FROM users WHERE username = ?");
        checkStmt->setString(1, username);
        auto* res = checkStmt->executeQuery();

        if (res->next()) {
            std::cerr << "Username already exists.\n";
            delete res;
            delete checkStmt;
            return false;
        }

        delete res;
        delete checkStmt;

        // Insert new user
        auto* stmt = conn->prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
        stmt->setString(1, username);
        stmt->setString(2, hashPassword(password));
        stmt->execute();
        delete stmt;

        std::cout << "User registered successfully!\n";
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Registration error: " << e.what() << std::endl;
        return false;
    }
}

bool UserAuth::loginUser(const std::string& username, const std::string& password) {
    try {
        auto* stmt = conn->prepareStatement("SELECT password FROM users WHERE username = ?");
        stmt->setString(1, username);
        auto* res = stmt->executeQuery();

        if (res->next()) {
            std::string storedHash = res->getString("password");
            delete res;
            delete stmt;

            if (storedHash == hashPassword(password)) {
                std::cout << "Login successful!\n";
                return true;
            } else {
                std::cerr << "Incorrect password.\n";
                return false;
            }
        } else {
            std::cerr << "Username not found.\n";
            delete res;
            delete stmt;
            return false;
        }
    } catch (sql::SQLException& e) {
        std::cerr << "Login error: " << e.what() << std::endl;
        return false;
    }
}

#include <iostream>
#include "User_Registration_logincode.h"

int main() {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        sql::Connection* conn = driver->connect("tcp://127.0.0.1:3306", "your_user", "your_pass");
        conn->setSchema("your_database");

        UserAuth auth(conn);

        // Test Registration
        std::string username = "testuser";
        std::string password = "secret123";
        auth.registerUser(username, password);

        // Test Login
        auth.loginUser(username, password);

        // Wrong password
        auth.loginUser(username, "wrongpass");

        delete conn;
    } catch (sql::SQLException& e) {
        std::cerr << "Database error: " << e.what() << std::endl;
    }

    return 0;
}