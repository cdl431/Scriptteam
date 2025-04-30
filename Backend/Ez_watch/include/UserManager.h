#pragma once
#include <vector>
#include <string>

struct User {
    int         id;
    std::string username;
    std::string email;
    std::string password;       // unhashed for brevity – *hash in prod!*
};

class DatabaseManager;

class UserManager {
public:
    explicit UserManager(DatabaseManager& db);

    bool           addUser(const std::string& username,
                           const std::string& email,
                           const std::string& password);

    std::vector<User> getAllUsers();
private:
    DatabaseManager& db_;
};
