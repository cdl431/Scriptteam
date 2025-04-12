#ifndef USER_H
#define USER_H

#include "Database.h"
#include <string>

namespace std {

class User {
private:
    Database* db;

public:
    User(Database* db);

    std::string login(const std::string& email, const std::string& password);
    std::string registerUser(const std::string& name, const std::string& email, const std::string& password);
    std::string updateProfile(int userID, const std::string& name, const std::string& email);
};

}

#endif
