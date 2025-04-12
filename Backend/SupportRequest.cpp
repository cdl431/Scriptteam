#include "SupportRequest.h"
#include <sstream>

namespace std {

SupportRequest::SupportRequest(Database* db) {
    this->db = db;
}

std::string SupportRequest::createRequest(int userID, const std::string& description) {
    std::string query = "INSERT INTO SupportRequests (userID, requestDescription) VALUES (" + std::to_string(userID) + ", '" + description + "')";
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Request created.";
}

std::string SupportRequest::viewRequests() {
    PGresult* res = db->executeQuery("SELECT * FROM SupportRequests");
    std::stringstream ss;
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

std::string SupportRequest::updateIssueStatus(int requestID, const std::string& status) {
    std::string query = "UPDATE SupportRequests SET issueStatus = '" + status + "' WHERE requestID = " + std::to_string(requestID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Issue status updated.";
}

std::string SupportRequest::addResponse(int requestID, const std::string& response) {
    std::string query = "UPDATE SupportRequests SET response = '" + response + "' WHERE requestID = " + std::to_string(requestID);
    PGresult* res = db->executeQuery(query);
    PQclear(res);
    return "Response added.";
}

std::string SupportRequest::viewUserRequests(int userID) {
    std::string query = "SELECT * FROM SupportRequests WHERE userID = " + std::to_string(userID);
    PGresult* res = db->executeQuery(query);
    std::stringstream ss;
    int rows = PQntuples(res);
    for (int i = 0; i < rows; ++i) {
        ss << "Request ID: " << PQgetvalue(res, i, 0)
           << ", Description: " << PQgetvalue(res, i, 2)
           << ", Status: " << PQgetvalue(res, i, 3)
           << ", Response: " << PQgetvalue(res, i, 4) << "\n";
    }
    PQclear(res);
    return ss.str();
}

}
