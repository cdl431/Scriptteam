#include "Admin.h"
#include <sstream>

namespace std {

Admin::Admin(Database* db) {
    this->db = db;
}

// Set user to 'Buyer' or 'Seller' from Guest
string Admin::approveUser(int userID) {
    string query = "UPDATE Users SET role = 'Buyer' WHERE userID = " + to_string(userID) + " AND role = 'Guest'";
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "User approved.";
}

string Admin::disableUser(int userID) {
    string query = "DELETE FROM Users WHERE userID = " + to_string(userID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "User disabled.";
}

string Admin::viewTransactions() {
    PGresult* res = db->executeQuery("SELECT * FROM Transactions");
    stringstream ss;
    int rows = PQntuples(res);
    for (int i = 0; i < rows; ++i) {
        ss << "Transaction ID: " << PQgetvalue(res, i, 0)
           << ", Order ID: " << PQgetvalue(res, i, 1)
           << ", Amount: " << PQgetvalue(res, i, 2)
           << ", Date: " << PQgetvalue(res, i, 3) << "\n";
    }
    PQclear(res);
    return ss.str();
}

string Admin::removeProduct(int productID) {
    string query = "DELETE FROM Products WHERE productID = " + to_string(productID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Product removed.";
}

string Admin::viewRequests() {
    PGresult* res = db->executeQuery("SELECT * FROM SupportRequests");
    stringstream ss;
    int rows = PQntuples(res);
    for (int i = 0; i < rows; ++i) {
        ss << "Request ID: " << PQgetvalue(res, i, 0)
           << ", User ID: " << PQgetvalue(res, i, 1)
           << ", Description: " << PQgetvalue(res, i, 2)
           << ", Status: " << PQgetvalue(res, i, 3)
           << ", Response: " << PQgetvalue(res, i, 4) << "\n";
    }
    PQclear(res);
    return ss.str();
}

string Admin::resetPassword(int userID, const string& newPassword) {
    string query = "UPDATE Users SET password = '" + newPassword + "' WHERE userID = " + to_string(userID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Password reset.";
}

string Admin::updatePrice(int productID, double newPrice) {
    string query = "UPDATE Products SET price = " + to_string(newPrice) +
                   " WHERE productID = " + to_string(productID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Price updated.";
}

string Admin::updateDescription(int productID, const string& newDescription) {
    string query = "UPDATE Products SET description = '" + newDescription +
                   "' WHERE productID = " + to_string(productID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Description updated.";
}

}
