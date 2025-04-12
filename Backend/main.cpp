#include "crow_all.h"
#include "Database.h"
#include "User.h"
#include "Admin.h"
#include "SupportRequest.h"
#include "Product.h"

using namespace std;

int main() {
    string conninfo = "host=localhost port=5432 dbname=EZ-Watch user=postgres password=AJ88sql";
    Database db(conninfo);

    if (!db.isConnected()) {
        cerr << "Could not connect to DB." << endl;
        return 1;
    }

    crow::SimpleApp app;
    User user(&db);
    Admin admin(&db);
    SupportRequest supportRequest(&db);
    Product product(&db);

    // user routes
    CROW_ROUTE(app, "/api/login").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        auto email = body["email"].s();
        auto password = body["password"].s();
        
        string result = user.login(email, password);
        if (result == "approve") {
            return crow::response(200, "Login approved");
        } else {
            return crow::response(401, "Login denied");
        }
    });

    CROW_ROUTE(app, "/api/register").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        auto name = body["name"].s();
        auto email = body["email"].s();
        auto password = body["password"].s();
        

        string registrationStatus = user.registerUser(name, email, password);
        return crow::response(200, registrationStatus);  // Return registration status
    });

    CROW_ROUTE(app, "/api/updateProfile").methods("POST"_method)([&user](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        string name = body["name"].s();
        string email = body["email"].s();
        

        string updateStatus = user.updateProfile(userID, name, email);
        return crow::response(200, updateStatus);  // Return profile update status
    });


    // admin routes
    CROW_ROUTE(app, "/api/admin/approveUser").methods("POST"_method)([&admin](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        return crow::response(admin.approveUser(userID));
    });

    CROW_ROUTE(app, "/api/admin/disableUser").methods("POST"_method)([&admin](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        return crow::response(admin.disableUser(userID));
    });

    CROW_ROUTE(app, "/api/admin/viewTransactions")([&admin]() {
        return crow::response(admin.viewTransactions());
    });

    CROW_ROUTE(app, "/api/admin/removeProduct").methods("POST"_method)([&admin](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int productID = stoi(body["productID"].s());
        return crow::response(admin.removeProduct(productID));
    });

    CROW_ROUTE(app, "/api/admin/viewRequests")([&admin]() {
        return crow::response(admin.viewRequests());
    });

    CROW_ROUTE(app, "/api/admin/resetPassword").methods("POST"_method)([&admin](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        string newPassword = body["newPassword"].s();
        return crow::response(admin.resetPassword(userID, newPassword));
    });

    // support request routes
    CROW_ROUTE(app, "/api/support/createRequest").methods("POST"_method)([&supportRequest](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        string description = body["description"].s();
        return crow::response(supportRequest.createRequest(userID, description));
    });

    CROW_ROUTE(app, "/api/support/viewRequests")([&supportRequest]() {
        return crow::response(supportRequest.viewRequests());
    });

    CROW_ROUTE(app, "/api/support/updateStatus").methods("POST"_method)([&supportRequest](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int requestID = stoi(body["requestID"].s());
        string status = body["status"].s();
        return crow::response(supportRequest.updateIssueStatus(requestID, status));
    });

    CROW_ROUTE(app, "/api/support/addResponse").methods("POST"_method)([&supportRequest](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int requestID = stoi(body["requestID"].s());
        string response = body["response"].s();
        return crow::response(supportRequest.addResponse(requestID, response));
    });

    CROW_ROUTE(app, "/api/support/viewUserRequests").methods("POST"_method)([&supportRequest](const crow::request& req) {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "Invalid JSON");

        int userID = stoi(body["userID"].s());
        return crow::response(supportRequest.viewUserRequests(userID));
    });

    //product routes
    CROW_ROUTE(app, "/api/products")([&product]() {
    return crow::response(product.getAllProducts());
    });

    CROW_ROUTE(app, "/api/products/<int>")([&product](int productID) {
    return crow::response(product.getProductByID(productID));
    });


    app.port(18080).multithreaded().run();
}
