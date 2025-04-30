#include "UserManager.h"
#include "DatabaseManager.h"

#include <memory>
#include <stdexcept>

using sql::PreparedStatement;
using sql::ResultSet;

UserManager::UserManager(DatabaseManager& db) : db_(db) {}


bool UserManager::registerUser(const std::string& username,
                               const std::string& email,
                               const std::string& password)
{
    auto conn = db_.connection();                

    {
        std::unique_ptr<PreparedStatement> stmt(
            conn->prepareStatement(
                "SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1"));
        stmt->setString(1, username);
        stmt->setString(2, email);

        std::unique_ptr<ResultSet> rs(stmt->executeQuery());
        if (rs->next()) return false;            
    }

    std::unique_ptr<PreparedStatement> stmt(
        conn->prepareStatement(
            "INSERT INTO users(username,email,password) VALUES(?,?,?)"));
    stmt->setString(1, username);
    stmt->setString(2, email);
    stmt->setString(3, password);               
    stmt->execute();

    return true;
}
