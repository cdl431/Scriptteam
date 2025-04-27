#pragma once

#include <nlohmann/json.hpp>
#include <string>

class DatabaseManager {
private:
    std::string filePath;

public:
    DatabaseManager(const std::string& path);
    nlohmann::json readJson() const;
    void writeJson(const nlohmann::json& data) const;
};
