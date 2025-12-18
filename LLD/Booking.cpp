#pragma once
#include <vector>
#include "User.cpp"
#include "Show.cpp"

class Booking {
public:
    int bookingId;
    User user;
    Show show;
    vector<Seat> bookedSeats;
    double totalAmount;
    BookingStatus status;

    Booking(int id, User u, Show s, vector<Seat> seats) 
        : bookingId(id), user(u), show(s), bookedSeats(seats), status(BookingStatus::CONFIRMED) {
        totalAmount = 0;
        for (auto &seat : seats) {
            totalAmount += seat.price;
        }
    }

    void printTicket() {
        cout << "\n--- BOOKING CONFIRMED ---" << endl;
        cout << "Booking ID: " << bookingId << endl;
        cout << "User: " << user.name << endl;
        cout << "Movie: " << show.movie.title << endl;
        cout << "Seats: ";
        for (auto s : bookedSeats) cout << s.seatId << " ";
        cout << "\nTotal: $" << totalAmount << endl;
        cout << "-------------------------\n" << endl;
    }
};