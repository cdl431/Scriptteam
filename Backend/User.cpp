#include "crow_all.h"
#include "Database.h"
#include "User.h"

using namespace std;

int main() {
    string conninfo = "host=localhost port=5432 dbname=ezwatch user=postgres password=yourpassword";
    Database db(conninfo);

    if (!db.isConnected()) {
        cerr << "Could not connect to DB." << endl;
        return 1;
    }

    // Prepare login statement
    PGresult* prepRes = PQprepare(db.executeQuery(""), "login_stmt",
        "SELECT userID, name, email FROM Users WHERE email = $1 AND password = $2",
        0, NULL);
    if (PQresultStatus(prepRes) != PGRES_COMMAND_OK) {
        cerr << "Prepared statement failed: " << PQresultErrorMessage(prepRes) << endl;
    }
    PQclear(prepRes);

    crow::SimpleApp app;
    User user(&db);

    CROW_ROUTE(app, "/api/login").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        auto email = body["email"].s();
        auto password = body["password"].s();
        auto result = user.login(email, password);
        return crow::response(result);
    });

    CROW_ROUTE(app, "/api/register").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        auto name = body["name"].s();
        auto email = body["email"].s();
        auto password = body["password"].s();
        auto result = user.registerUser(name, email, password);
        return crow::response(result);
    });

    CROW_ROUTE(app, "/api/updateProfile").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) {
            return crow::response(400, "Invalid JSON");
        }

        int userID = stoi(body["userID"].s());
        string name = body["name"].s();
        string email = body["email"].s();

        auto result = user.updateProfile(userID, name, email);
        return crow::response(result);
    });

    app.port(18080).multithreaded().run();
}
