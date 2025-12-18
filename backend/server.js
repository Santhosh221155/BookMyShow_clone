const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- SCHEMAS ---
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

const BookingSchema = new mongoose.Schema({
  bookingId: String,
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

// --- AUTO SEEDING LOGIC (Runs if DB is empty) ---
const initializeData = async () => {
  try {
    const count = await Movie.countDocuments();
    if (count > 0) return; // Data exists, skip seeding

    console.log("⚠️ Database empty. Initializing Data...");
    
    const MOVIE_LIST = [
      { title: "Jawan", genre: "Action/Thriller", duration: 169, posterUrl: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg" },
      { title: "Leo", genre: "Action/Drama", duration: 164, posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/75/Leo_%282023_Indian_film%29.jpg" },
      { title: "Avengers: Endgame", genre: "Sci-Fi", duration: 180, posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg" },
      { title: "KGF: Chapter 2", genre: "Action/Period", duration: 168, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg" },
      { title: "RRR", genre: "Action/History", duration: 182, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg" },
      { title: "Oppenheimer", genre: "Biopic", duration: 180, posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg" },
      { title: "Interstellar", genre: "Sci-Fi", duration: 169, posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg" },
      { title: "Baahubali 2", genre: "Fantasy", duration: 171, posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg" },
      { title: "3 Idiots", genre: "Comedy/Drama", duration: 170, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg" },
      { title: "Kantara", genre: "Thriller/Folklore", duration: 148, posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg" }
    ];
    
    const createdMovies = await Movie.insertMany(MOVIE_LIST);

    const THEATRES = ["PVR Cinemas", "INOX Leisure", "Cinepolis"];
    const SHOW_TIMES = ["09:00 AM", "12:30 PM", "04:00 PM", "07:30 PM", "10:30 PM"];

    const generateSeats = () => {
      let seats = [];
      let idCounter = 1;
      for(let r=0; r<6; r++) {
        for(let c=0; c<8; c++) {
          seats.push({ id: idCounter++, row: r, col: c, price: 150 + (r*30), isBooked: false });
        }
      }
      return seats;
    };

    // Create Shows: Movies x Theatres x Times
    for (const movie of createdMovies) {
      for (const theatre of THEATRES) {
        for (const time of SHOW_TIMES) {
          await Show.create({
            movieId: movie._id,
            cinemaName: theatre,
            startTime: time,
            seats: generateSeats()
          });
        }
      }
    }
    console.log("✅ Data Initialized Successfully!");
  } catch (error) {
    console.error("Seeding Error:", error);
  }
};

// --- DATABASE CONNECTION ---
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB Connected");
    await initializeData(); 
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
};

// Ensure DB connects on every request (Vercel Requirement)
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- API ROUTES ---

app.get('/', (req, res) => res.send("BookMyShow API Live!"));

// 1. Get All Movies
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. Get Specific Movie
app.get('/api/movie/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    res.json(movie);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 3. NEW: Get Unique Theatres for a Movie
app.get('/api/theatres/:movieId', async (req, res) => {
  try {
    const shows = await Show.find({ movieId: req.params.movieId });
    // Extract unique cinema names
    const uniqueTheatres = [...new Set(shows.map(show => show.cinemaName))];
    res.json(uniqueTheatres);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. NEW: Get Shows for specific Movie + Theatre
app.get('/api/shows/:movieId/:cinemaName', async (req, res) => {
  try {
    const shows = await Show.find({ 
      movieId: req.params.movieId,
      cinemaName: req.params.cinemaName 
    });
    res.json(shows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Get Specific Show Details (Seats)
app.get('/api/show-details/:showId', async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId).populate('movieId');
    res.json(show);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. Book Tickets
app.post('/api/book', async (req, res) => {
  try {
    const { showId, passengerDetails, userEmail } = req.body; 
    const show = await Show.findById(showId);
    const seatIds = passengerDetails.map(p => p.seatId);

    // Check Availability
    const isBooked = show.seats.some(s => seatIds.includes(s.id) && s.isBooked);
    if (isBooked) return res.status(400).json({ message: "One or more seats already booked" });

    // Mark as Booked
    show.seats.forEach(s => {
      if (seatIds.includes(s.id)) s.isBooked = true;
    });
    await show.save();

    // Create Booking Record
    let totalAmount = 0;
    const tickets = passengerDetails.map(p => {
      const seatInfo = show.seats.find(s => s.id === p.seatId);
      totalAmount += seatInfo.price;
      return { ...p, price: seatInfo.price };
    });

    const bookingId = "BM-" + uuidv4().slice(0, 8).toUpperCase();
    
    const booking = await Booking.create({
      bookingId,
      showId,
      userEmail,
      tickets,
      totalAmount
    });

    res.json({ success: true, bookingId });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. Get Ticket
app.get('/api/ticket/:bookingId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ bookingId: req.params.bookingId })
      .populate({
        path: 'showId',
        populate: { path: 'movieId' }
      });
    res.json(booking);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SERVER LISTENER ---
// Only listen if running locally (Vercel handles this automatically in prod)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;