#pragma once
#include "Movie.cpp"
#include "Screen.cpp"

class Show {
public:
    int showId;
    Movie movie;
    Screen screen;
    int startTime; // Simplified time (e.g., 1800 for 6 PM)
    vector<Seat> availableSeats; // Copy of screen seats for this specific show

    Show(int id, Movie m, Screen s, int time) 
        : showId(id), movie(m), screen(s), startTime(time) {
        // When a show is created, it inherits the physical seat layout of the screen
        availableSeats = screen.seats; 
    }

    // Returns a pointer to the seat if found and available
    Seat* getSeat(int seatId) {
        for (auto &seat : availableSeats) {
            if (seat.seatId == seatId) {
                return &seat;
            }
        }
        return nullptr;
    }
};