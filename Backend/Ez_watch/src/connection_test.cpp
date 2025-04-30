#include "DatabaseManager.h"
#include <iostream>

int main()
{
    try
    {
        DatabaseManager db;                     
        auto conn = db.connection();

        if (conn && !conn->isClosed())
            std::cout << " MySQL connection successful!\n";
        else
            std::cout << "Connection object not open.\n";
    }
    catch (const sql::SQLException& ex)
    {
        std::cerr << "MySQL error: " << ex.what() << '\n';
        return 1;
    }
    return 0;
}
