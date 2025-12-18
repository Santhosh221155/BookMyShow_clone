#pragma once
#include <vector>
#include "Seat.cpp"

class Screen {
public:
    int screenId;
    string name;
    vector<Seat> seats;

    Screen(int id, string n) : screenId(id), name(n) {}

    void addSeat(Seat seat) {
        seats.push_back(seat);
    }
};