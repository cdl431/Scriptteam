#include "DatabaseManager.h"
#include <fstream>

DatabaseManager::DatabaseManager(const std::string& path) : filePath(path) {}

nlohmann::json DatabaseManager::readJson() const {
    std::ifstream file(filePath);
    nlohmann::json data;
    if (file.is_open()) {
        file >> data;
    }
    return data;
}

void DatabaseManager::writeJson(const nlohmann::json& data) const {
    std::ofstream file(filePath);
    if (file.is_open()) {
        file << data.dump(4);
    }
}
