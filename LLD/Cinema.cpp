#pragma once
#include <vector>
#include "Show.cpp"

class Cinema {
public:
    int cinemaId;
    string name;
    string city;
    vector<Screen> screens;
    vector<Show> shows;

    Cinema(int id, string n, string c) : cinemaId(id), name(n), city(c) {}

    void addScreen(Screen s) {
        screens.push_back(s);
    }

    void addShow(Show s) {
        shows.push_back(s);
    }
};