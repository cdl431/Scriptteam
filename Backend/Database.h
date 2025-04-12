#pragma once
#include <libpq-fe.h>
#include <string>

namespace std {

class Database {
private:
    PGconn* conn;

public:
    Database(const std::string& conninfo);
    ~Database();
    bool isConnected() const;
    PGconn* getConnection() const { return conn; }
    PGresult* executeQuery(const std::string& query);
    PGresult* executePrepared(const std::string& stmtName, int nParams, const char* const* paramValues);
};

}
