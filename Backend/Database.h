#ifndef DATABASE_H
#define DATABASE_H

#include <libpq-fe.h>
#include <string>

class Database {
private:
    PGconn* conn;

public:
    Database(const std::string& conninfo);
    ~Database();

    PGresult* executeQuery(const std::string& query);
    PGresult* executePrepared(const std::string& stmtName, int nParams, const char* const* paramValues);

    bool isConnected() const;
};

#endif
