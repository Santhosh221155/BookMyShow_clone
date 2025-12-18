const mongoose = require('mongoose');

// Seat Schema (Status in the screen)
const SeatSchema = new mongoose.Schema({
  id: Number,
  row: Number,
  col: Number,
  price: Number,
  isBooked: { type: Boolean, default: false }
});

const MovieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  duration: Number,
  posterUrl: String
});

const ShowSchema = new mongoose.Schema({
  movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' },
  cinemaName: String,
  startTime: String,
  seats: [SeatSchema]
});

// Updated Booking Schema to include specific holder details per seat
const BookingSchema = new mongoose.Schema({
  bookingId: String, // Unique Ticket ID
  showId: { type: mongoose.Schema.Types.ObjectId, ref: 'Show' },
  userEmail: String,
  tickets: [{
    seatId: Number,
    holderName: String,
    age: Number,
    price: Number
  }],
  totalAmount: Number,
  bookingDate: { type: Date, default: Date.now }
});

const Movie = mongoose.model('Movie', MovieSchema);
const Show = mongoose.model('Show', ShowSchema);
const Booking = mongoose.model('Booking', BookingSchema);

module.exports = { Movie, Show, Booking };