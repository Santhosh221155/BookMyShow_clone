#include <iostream>
#include <vector>
#include <string>

// Include the Service header, which recursively includes the other model headers
#include "BookMyShowService.cpp"

using namespace std;

int main() {
    // 1. Initialize System Data
    Movie avengers(1, "Avengers: Endgame", 180, Genre::ACTION);
    Movie titanic(2, "Titanic", 195, Genre::ROMANCE);

    // Create a Screen with 5 seats
    Screen screen1(101, "Screen A");
    screen1.addSeat(Seat(1, 1, 1, SeatType::SILVER, 100.0));
    screen1.addSeat(Seat(2, 1, 2, SeatType::SILVER, 100.0));
    screen1.addSeat(Seat(3, 1, 3, SeatType::GOLD, 150.0));
    screen1.addSeat(Seat(4, 1, 4, SeatType::GOLD, 150.0));
    screen1.addSeat(Seat(5, 2, 1, SeatType::PLATINUM, 200.0));

    // Create Shows
    Show show1(201, avengers, screen1, 1800); // 6 PM
    Show show2(202, titanic, screen1, 2100);  // 9 PM

    // Create Cinema and add to Service
    Cinema pvr(1, "PVR Plaza", "Delhi");
    pvr.addScreen(screen1);
    pvr.addShow(show1);
    pvr.addShow(show2);

    BookMyShowService app;
    app.addCinema("Delhi", pvr);

    // --- APPLICATION FLOW ---

    cout << "--- Welcome to BookMyShow ---\n" << endl;

    // 2. User searches for a movie
    User user1(1, "Alice", "alice@example.com");
    string searchCity = "Delhi";
    string searchMovie = "Avengers: Endgame";

    cout << "User " << user1.name << " searching for " << searchMovie << " in " << searchCity << "..." << endl;
    vector<Show*> searchResults = app.searchShows(searchCity, searchMovie);

    if (searchResults.empty()) {
        cout << "No shows found!" << endl;
    } else {
        Show* selectedShow = searchResults[0];
        cout << "Found Show ID: " << selectedShow->showId << " at " << selectedShow->startTime << endl;

        // 3. User selects seats to book (Seat IDs 1 and 3)
        vector<int> seatsToBook = {1, 3};

        // 4. Create Booking
        Booking* ticket = app.createBooking(user1, *selectedShow, seatsToBook);

        if (ticket != nullptr) {
            ticket->printTicket();
        }
        
        // 5. Simulate another user trying to book the same seat (Seat 1)
        User user2(2, "Bob", "bob@example.com");
        vector<int> conflictingSeats = {1, 2}; // Seat 1 is already taken by Alice
        
        cout << "User " << user2.name << " attempting to book Seat 1 and 2..." << endl;
        app.createBooking(user2, *selectedShow, conflictingSeats);
    }

    return 0;
}
