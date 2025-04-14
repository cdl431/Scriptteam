cmake_minimum_required(VERSION 3.10)
project(Ez_watch)

set(CMAKE_CXX_STANDARD 17)

# Add Crow and other headers
include_directories(include)
include_directories(${CMAKE_SOURCE_DIR}/include/crow)

# Source files
file(GLOB SOURCES
    src/*.cpp
    storage/*.cpp
)

include_directories(${CMAKE_SOURCE_DIR}/include/vcpkg/installed/x64-windows/include)


add_executable(Ez_watch ${SOURCES})

# If you're using Boost, add linking here
# find_package(Boost REQUIRED)
# target_link_libraries(Ez_watch Boost::boost)
