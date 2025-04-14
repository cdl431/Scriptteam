#pragma once
#include <string>
#include "json.hpp"
using json = nlohmann::json;

namespace database {
    std::string readAll(const std::string& section);
    void add(const std::string& section, const nlohmann::json& item);
    void edit(const std::string& section, int id, const nlohmann::json& newData);
}
