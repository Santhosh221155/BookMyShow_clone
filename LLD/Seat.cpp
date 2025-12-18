#pragma once
#include "Enums.cpp"

class Seat {
public:
    int seatId;
    int row;
    int col;
    SeatType type;
    double price;
    SeatStatus status;

    Seat(int id, int r, int c, SeatType t, double p) 
        : seatId(id), row(r), col(c), type(t), price(p), status(SeatStatus::AVAILABLE) {}

    void book() {
        status = SeatStatus::BOOKED;
    }

    bool isAvailable() {
        return status == SeatStatus::AVAILABLE;
    }
};