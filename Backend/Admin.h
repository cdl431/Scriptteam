#ifndef ADMIN_H
#define ADMIN_H

#include "Database.h"
#include <string>

namespace std {

class Admin {
private:
    Database* db;

public:
    Admin(Database* db);

    std::string approveUser(int userID);
    std::string disableUser(int userID);
    std::string viewTransactions();
    std::string removeProduct(int productID);
    std::string viewRequests();
    std::string resetPassword(int userID, const std::string& newPassword);
    std::string updatePrice(int productID, double newPrice);
    std::string updateDescription(int productID, const std::string& newDescription);

};

}

#endif
