#pragma once
#include <map>
#include <vector>
#include "Cinema.cpp"
#include "Booking.cpp"

class BookMyShowService {
private:
    map<string, vector<Cinema>> cityMap; // Map City Name -> Cinemas
    vector<Booking> bookings;

public:
    void addCinema(string city, Cinema c) {
        cityMap[city].push_back(c);
    }

    vector<Show*> searchShows(string city, string movieName) {
        vector<Show*> results;
        // Search through all cinemas in the city
        if (cityMap.find(city) != cityMap.end()) {
            for (auto &cinema : cityMap[city]) {
                for (auto &show : cinema.shows) {
                    if (show.movie.title == movieName) {
                        results.push_back(&show);
                    }
                }
            }
        }
        return results;
    }

    Booking* createBooking(User user, Show &show, vector<int> seatIds) {
        vector<Seat> selectedSeats;

        // 1. Check Availability (Simplified Atomic Check)
        for (int id : seatIds) {
            Seat* seat = show.getSeat(id);
            if (seat == nullptr || !seat->isAvailable()) {
                cout << "Booking Failed: Seat " << id << " is not available." << endl;
                return nullptr;
            }
        }

        // 2. Lock Seats
        for (int id : seatIds) {
            Seat* seat = show.getSeat(id);
            seat->book();
            selectedSeats.push_back(*seat);
        }

        // 3. Create Booking Record
        int bookingId = bookings.size() + 1;
        Booking newBooking(bookingId, user, show, selectedSeats);
        bookings.push_back(newBooking);
        
        cout << "Booking successful for " << user.name << "!" << endl;
        return &bookings.back();
    }
};