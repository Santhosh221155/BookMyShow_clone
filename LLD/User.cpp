#pragma once
#include <string>

using namespace std;

class User {
public:
    int userId;
    string name;
    string email;

    User(int id, string n, string e) : userId(id), name(n), email(e) {}
};