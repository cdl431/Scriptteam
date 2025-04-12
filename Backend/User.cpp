#include "User.h"
#include "Database.h"
#include <iostream>
#include <libpq-fe.h>

namespace std {

User::User(Database* db) : db(db) {}

std::string User::login(const std::string& email, const std::string& password) {
    // Prepare query for login validation with status check
    std::string query = "SELECT userID, name, status FROM Users WHERE email = '" + email + "' AND password = '" + password + "'";

    // Execute query
    PGresult* res = db->executeQuery(query);

    // Check if the query executed successfully and if a user was found
    if (PQntuples(res) == 0) {
        PQclear(res);
        return "deny";  // Return deny if no user found or credentials are incorrect
    }

    // If credentials are valid, check the user's status
    std::string userID = PQgetvalue(res, 0, 0);
    std::string userName = PQgetvalue(res, 0, 1);
    std::string userStatus = PQgetvalue(res, 0, 2);

    PQclear(res);

    // Return 'approve' or 'deny' based on user status
    if (userStatus == "approved") {
        return "approve";  // User is approved
    } else {
        return "deny";  // User is not approved (could be pending or denied)
    }
}

std::string User::registerUser(const std::string& name, const std::string& email, const std::string& password) {
    // Prepare query to insert a new user into the database
    std::string query = "INSERT INTO Users (name, email, password, role, status) VALUES ('" + name + "', '" + email + "', '" + password + "', 'Guest', 'pending')";

    // Execute query
    PGresult* res = db->executeQuery(query);
    PQclear(res);

    return "Registration successful.";
}

std::string User::updateProfile(int userID, const std::string& name, const std::string& email) {
    // Prepare query to update user profile
    std::string query = "UPDATE Users SET name = '" + name + "', email = '" + email + "' WHERE userID = " + std::to_string(userID);

    // Execute query
    PGresult* res = db->executeQuery(query);
    PQclear(res);

    return "Profile updated successfully.";
}

}
