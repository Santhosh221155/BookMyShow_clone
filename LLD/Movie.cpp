#pragma once
#include <iostream>
#include <string>
#include "Enums.cpp"

using namespace std;

class Movie {
public:
    int id;
    string title;
    int durationMins;
    Genre genre;

    Movie(int id, string title, int duration, Genre genre) 
        : id(id), title(title), durationMins(duration), genre(genre) {}

    string getDetails() {
        return title + " (" + to_string(durationMins) + " mins)";
    }
};