#include "DatabaseManager.h"
#include <jdbc/mysql_driver.h>         
#include <jdbc/cppconn/statement.h>

DatabaseManager::DatabaseManager(const std::string& host,
                                 const std::string& user,
                                 const std::string& passwd,
                                 const std::string& schema)
{
    driver_ = get_driver_instance();

    conn_.reset(driver_->connect(host, user, passwd));
    conn_->setSchema(schema);
}
