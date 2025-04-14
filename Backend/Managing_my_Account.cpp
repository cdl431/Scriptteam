#include "Managing_my_Account.h"
#include <iostream>

AccountManager::AccountManager(const std::string& host, const std::string& user,
                               const std::string& password, const std::string& database) {
    driver = sql::mysql::get_mysql_driver_instance();
    conn = driver->connect(host, user, password);
    conn->setSchema(database);
    initializeDatabase();
}

AccountManager::~AccountManager() {
    delete conn;
}

void AccountManager::initializeDatabase() {
    sql::Statement* stmt = conn->createStatement();
    stmt->execute(
        "CREATE TABLE IF NOT EXISTS users ("
        "id INT AUTO_INCREMENT PRIMARY KEY, "
        "username VARCHAR(255) UNIQUE NOT NULL, "
        "password VARCHAR(255) NOT NULL)"
    );
    delete stmt;
}

bool AccountManager::createUser(const std::string& username, const std::string& password) {
    try {
        sql::PreparedStatement* pstmt = conn->prepareStatement(
            "INSERT INTO users (username, password) VALUES (?, ?)"
        );
        pstmt->setString(1, username);
        pstmt->setString(2, password);
        pstmt->execute();
        delete pstmt;
        return true;
    } catch (sql::SQLException& e) {
        std::cerr << "Error creating user: " << e.what() << std::endl;
        return false;
    }
}

bool AccountManager::loginUser(const std::string& username, const std::string& password) {
    sql::PreparedStatement* pstmt = conn->prepareStatement(
        "SELECT * FROM users WHERE username = ? AND password = ?"
    );
    pstmt->setString(1, username);
    pstmt->setString(2, password);

    sql::ResultSet* res = pstmt->executeQuery();
    bool found = res->next();

    delete res;
    delete pstmt;
    return found;
}

int main() {
    AccountManager manager("tcp://127.0.0.1:3306", "your_mysql_user", "your_mysql_password", "your_database");

    std::string username, password;

    std::cout << "Register a new account\nUsername: ";
    std::cin >> username;
    std::cout << "Password: ";
    std::cin >> password;

    if (manager.createUser(username, password)) {
        std::cout << "User registered successfully!\n";
    } else {
        std::cout << "Failed to register user. Username may already exist.\n";
    }

    std::cout << "\nLogin to your account\nUsername: ";
    std::cin >> username;
    std::cout << "Password: ";
    std::cin >> password;

    if (manager.loginUser(username, password)) {
        std::cout << "Login successful!\n";
    } else {
        std::cout << "Login failed. Incorrect credentials.\n";
    }

    return 0;
}