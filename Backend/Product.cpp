#include "Product.h"
#include <sstream>

namespace std {

Product::Product(Database* db) {
    this->db = db;
}

string Product::getAllProducts() {
    PGresult* res = db->executeQuery("SELECT * FROM Products");
    stringstream ss;
    int rows = PQntuples(res);
    for (int i = 0; i < rows; ++i) {
        ss << "Product ID: " << PQgetvalue(res, i, 0)
           << ", Seller ID: " << PQgetvalue(res, i, 1)
           << ", Name: " << PQgetvalue(res, i, 2)
           << ", Description: " << PQgetvalue(res, i, 3)
           << ", Price: $" << PQgetvalue(res, i, 4)
           << ", Category: " << PQgetvalue(res, i, 5)
           << ", Image URL: " << PQgetvalue(res, i, 6) << "\n";
    }
    PQclear(res);
    return ss.str();
}

string Product::getProductByID(int productID) {
    string query = "SELECT * FROM Products WHERE productID = " + to_string(productID);
    PGresult* res = db->executeQuery(query);
    stringstream ss;
    if (PQntuples(res) > 0) {
        ss << "Product ID: " << PQgetvalue(res, 0, 0)
           << ", Seller ID: " << PQgetvalue(res, 0, 1)
           << ", Name: " << PQgetvalue(res, 0, 2)
           << ", Description: " << PQgetvalue(res, 0, 3)
           << ", Price: $" << PQgetvalue(res, 0, 4)
           << ", Category: " << PQgetvalue(res, 0, 5)
           << ", Image URL: " << PQgetvalue(res, 0, 6);
    } else {
        ss << "Product not found.";
    }
    PQclear(res);
    return ss.str();
}

}
