// New_Ez_Watch.cpp : This file contains the 'main' function. Program execution begins and ends there.
//

#include <iostream>
//#include "stdafx.h"

//include the below additional libraries
#include <iostream>
#include <windows.h>
#include <sqlext.h>
#include <sqltypes.h>
#include <sql.h>

//use the std namespace
using namespace std;
int main()
{
#define SQL_RESULT_LEN 240
#define SQL_RETURN_CODE_LEN 1000

    //define handles and variables
    SQLHANDLE sqlConnHandle;
    SQLHANDLE sqlStmtHandle;
    SQLHANDLE sqlEnvHandle;
    SQLWCHAR retconstring[SQL_RETURN_CODE_LEN];

    //initializations
    sqlConnHandle = NULL;
    sqlStmtHandle = NULL;

    //allocations
    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_ENV, SQL_NULL_HANDLE, &sqlEnvHandle))
        goto COMPLETED;

    if (SQL_SUCCESS != SQLSetEnvAttr(sqlEnvHandle, SQL_ATTR_ODBC_VERSION, (SQLPOINTER)SQL_OV_ODBC3, 0))
        goto COMPLETED;

    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_DBC, sqlEnvHandle, &sqlConnHandle))
        goto COMPLETED;

    //output
    cout << "Attempting connection to SQL Server...";
    cout << "\n";

    //connect to SQL Server	
    //I am using a trusted connection and port 14808
    //it does not matter if you are using default or named instance
    //just make sure you define the server name and the port
    //You have the option to use a username/password instead of a trusted connection
    //but is more secure to use a trusted connection
    switch (SQLDriverConnect(sqlConnHandle,
        NULL,
        (SQLWCHAR*)L"DRIVER={MySQL ODBC 9.2 Unicode Driver};SERVER=localhost;3306;DATABASE=ez_watch;UID=root;PWD=software;",
        //(SQLWCHAR*)L"DRIVER={SQL Server};SERVER=sql5.freesqldatabase.com, 3306;DATABASE=sql5773677;Trusted=true;",
        SQL_NTS,
        retconstring,
        1024,
        NULL,
        SQL_DRIVER_NOPROMPT)) {

    case SQL_SUCCESS:
        cout << "Successfully connected to SQL Server";
        cout << "\n";
        break;

    case SQL_SUCCESS_WITH_INFO:
        cout << "Successfully connected to SQL Server";
        cout << "\n";
        break;

    case SQL_INVALID_HANDLE:
        cout << "Could not connect to SQL Server";
        cout << "\n";
        goto COMPLETED;

    case SQL_ERROR:
        cout << "Could not connect to SQL Server";
        cout << "\n";
        goto COMPLETED;

    default:
        break;
    }

    //if there is a problem connecting then exit application
    if (SQL_SUCCESS != SQLAllocHandle(SQL_HANDLE_STMT, sqlConnHandle, &sqlStmtHandle))
        goto COMPLETED;

    //output
    cout << "\n";
    cout << "Executing T-SQL query...";
    cout << "\n";

    //if there is a problem executing the query then exit application
    //else display query result
    if (SQL_SUCCESS != SQLExecDirect(sqlStmtHandle, (SQLWCHAR*)L"SELECT @@VERSION", SQL_NTS)) {
        cout << "Error querying SQL Server";
        cout << "\n";
        goto COMPLETED;
    }
    else {

        //declare output variable and pointer
        SQLCHAR sqlVersion[SQL_RESULT_LEN];
        //SQLINTEGER ptrSqlVersion;
        SQLLEN ptrSqlVersion;
        while (SQLFetch(sqlStmtHandle) == SQL_SUCCESS) {

            SQLGetData(sqlStmtHandle, 1, SQL_CHAR, sqlVersion, SQL_RESULT_LEN, &ptrSqlVersion);

            //display query result
            cout << "\nQuery Result:\n\n";
            cout << sqlVersion << endl;
        }
    }
    if (SQL_SUCCESS != SQLExecDirect(sqlStmtHandle, (SQLWCHAR*)L"SELECT email FROM users", SQL_NTS)) {
        cout << "Error querying SQL Server";
        cout << "\n";
        goto COMPLETED;
    }
    else {

        //declare output variable and pointer
        SQLCHAR sqlVersion[SQL_RESULT_LEN];
        //SQLINTEGER ptrSqlVersion;
        SQLLEN ptrSqlVersion;
        while (SQLFetch(sqlStmtHandle) == SQL_SUCCESS) {

            SQLGetData(sqlStmtHandle, 1, SQL_CHAR, sqlVersion, SQL_RESULT_LEN, &ptrSqlVersion);

            //display query result
            cout << "\nQuery Result:\n\n";
            cout << sqlVersion << endl;
        }
    }

    //close connection and free resources
COMPLETED:
    SQLFreeHandle(SQL_HANDLE_STMT, sqlStmtHandle);
    SQLDisconnect(sqlConnHandle);
    SQLFreeHandle(SQL_HANDLE_DBC, sqlConnHandle);
    SQLFreeHandle(SQL_HANDLE_ENV, sqlEnvHandle);

    //pause the console window - exit when key is pressed
    cout << "\nPress any key to exit...";
    getchar();
}

// Run program: Ctrl + F5 or Debug > Start Without Debugging menu
// Debug program: F5 or Debug > Start Debugging menu

// Tips for Getting Started: 
//   1. Use the Solution Explorer window to add/manage files
//   2. Use the Team Explorer window to connect to source control
//   3. Use the Output window to see build output and other messages
//   4. Use the Error List window to view errors
//   5. Go to Project > Add New Item to create new code files, or Project > Add Existing Item to add existing code files to the project
//   6. In the future, to open this project again, go to File > Open > Project and select the .sln file
