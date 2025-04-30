cmake_minimum_required(VERSION 3.16)
project(Ez_watch LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(MYSQL_CONCPP_DIR "C:/Program Files/MySQL/mysql-connector-c++-9.3.0-winx64")

include_directories(
    ${CMAKE_SOURCE_DIR}/include
    "${MYSQL_CONCPP_DIR}/include"
)

link_directories("${MYSQL_CONCPP_DIR}/lib64/vs14")

add_executable(connection_test
    src/connection_test.cpp
    src/DatabaseManager.cpp
)

target_link_libraries(connection_test
    PRIVATE ws2_32 mswsock mysqlcppconn
)
