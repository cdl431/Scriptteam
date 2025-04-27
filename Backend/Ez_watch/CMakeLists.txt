cmake_minimum_required(VERSION 3.10)
project(Ez_watch)

set(CMAKE_CXX_STANDARD 17)

include_directories(
    ${CMAKE_SOURCE_DIR}/include
    ${CMAKE_SOURCE_DIR}/include/crow
    ${CMAKE_SOURCE_DIR}/include/vcpkg/installed/x64-windows/include
    ${CMAKE_SOURCE_DIR}/handlers
    ${CMAKE_SOURCE_DIR}/middleware
    ${CMAKE_SOURCE_DIR}/storage
)

file(GLOB SOURCES
    src/*.cpp
    storage/*.cpp
)

add_executable(Ez_watch ${SOURCES})

target_link_libraries(Ez_watch PRIVATE ws2_32 mswsock)
