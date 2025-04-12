#include "Database.h"
#include <iostream>

namespace std {

Database::Database(const std::string& conninfo) {
    conn = PQconnectdb(conninfo.c_str());
    if (PQstatus(conn) != CONNECTION_OK) {
        std::cerr << "Database connection failed: " << PQerrorMessage(conn) << std::endl;
        conn = nullptr;
    }
}

Database::~Database() {
    if (conn) {
        PQfinish(conn);
    }
}

bool Database::isConnected() const {
    return conn != nullptr;
}

PGresult* Database::executeQuery(const std::string& query) {
    if (!conn) return nullptr;
    return PQexec(conn, query.c_str());
}

PGresult* Database::executePrepared(const std::string& stmtName, int nParams, const char* const* paramValues) {
    if (!conn) return nullptr;
    return PQexecPrepared(conn, stmtName.c_str(), nParams, paramValues, nullptr, nullptr, 0);
}

}
