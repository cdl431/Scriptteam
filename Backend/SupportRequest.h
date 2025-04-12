#ifndef SUPPORTREQUEST_H
#define SUPPORTREQUEST_H

#include "Database.h"
#include <string>

namespace std {

class SupportRequest {
private:
    Database* db;

public:
    SupportRequest(Database* db);

    std::string createRequest(int userID, const std::string& description);
    std::string viewRequests();
    std::string updateIssueStatus(int requestID, const std::string& status);
    std::string addResponse(int requestID, const std::string& response);
    std::string viewUserRequests(int userID);
};

}

#endif
