#include "database.h"
#include <fstream>
#include "json.hpp"

using json = nlohmann::json;

static const std::string file_path = "data.json";

namespace database {
    json readJson() {
        std::ifstream f(file_path);
        json j;
        f >> j;
        return j;
    }

    void writeJson(const json& j) {
        std::ofstream f(file_path);
        f << j.dump(4);
    }

    std::string readAll(const std::string& section) {
        json j = readJson();
        return j[section].dump();
    }

    void add(const std::string& section, const json& item) {
        json j = readJson();
        j[section].push_back(item);
        writeJson(j);
    }

    void edit(const std::string& section, int id, const json& newData) {
        json j = readJson();
        if (id >= 0 && id < j[section].size()) {
            j[section][id] = newData;
            writeJson(j);
        }
    }
}
