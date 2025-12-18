const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Movie, Show, Booking } = require('./models/Schemas');

dotenv.config();

// --- CONFIGURATION ---
const MOVIE_LIST = [
  { title: "Jawan", genre: "Action/Thriller", duration: 169, posterUrl: "https://upload.wikimedia.org/wikipedia/en/3/39/Jawan_film_poster.jpg" },
  // FIXED URL BELOW
  { title: "Leo", genre: "Action/Drama", duration: 164, posterUrl: "https://upload.wikimedia.org/wikipedia/en/7/71/Leo_poster.jpg" },
  { title: "Avengers: Endgame", genre: "Sci-Fi", duration: 180, posterUrl: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg" },
  { title: "KGF: Chapter 2", genre: "Action/Period", duration: 168, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/d0/K.G.F_Chapter_2.jpg" },
  { title: "RRR", genre: "Action/History", duration: 182, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg" },
  { title: "Oppenheimer", genre: "Biopic", duration: 180, posterUrl: "https://upload.wikimedia.org/wikipedia/en/4/4a/Oppenheimer_%28film%29.jpg" },
  { title: "Interstellar", genre: "Sci-Fi", duration: 169, posterUrl: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg" },
  { title: "Baahubali 2", genre: "Fantasy", duration: 171, posterUrl: "https://upload.wikimedia.org/wikipedia/en/9/93/Baahubali_2_The_Conclusion_poster.jpg" },
  { title: "3 Idiots", genre: "Comedy/Drama", duration: 170, posterUrl: "https://upload.wikimedia.org/wikipedia/en/d/df/3_idiots_poster.jpg" },
  { title: "Kantara", genre: "Thriller/Folklore", duration: 148, posterUrl: "https://upload.wikimedia.org/wikipedia/en/8/84/Kantara_poster.jpeg" }
];

const THEATRES = ["PVR Cinemas", "INOX Leisure", "Cinepolis"];
const SHOW_TIMES = ["09:00 AM", "12:30 PM", "04:00 PM", "07:30 PM", "10:30 PM"];

// --- HELPERS ---
const generateSeats = () => {
  let seats = [];
  let idCounter = 1;
  for(let r=0; r<6; r++) {
    for(let c=0; c<8; c++) {
      seats.push({ 
        id: idCounter++, 
        row: r, 
        col: c, 
        price: 150 + (r*30), 
        isBooked: false 
      });
    }
  }
  return seats;
};

// --- MAIN SEED FUNCTION ---
const seedDB = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected.");

    console.log("🧹 Clearing old data...");
    await Movie.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});

    console.log("🎬 Creating 10 Movies...");
    const createdMovies = await Movie.insertMany(MOVIE_LIST);

    console.log("📅 Creating Shows (Movies x Theatres x Times)...");
    let showCount = 0;
    
    // Loop through Movies -> Then Theatres -> Then Times
    for (const movie of createdMovies) {
      for (const theatre of THEATRES) {
        for (const time of SHOW_TIMES) {
          await Show.create({
            movieId: movie._id,
            cinemaName: theatre,
            startTime: time,
            seats: generateSeats()
          });
          showCount++;
        }
      }
    }

    console.log(`✨ Success! Seeded ${createdMovies.length} Movies and ${showCount} Shows.`);
    process.exit();

  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
};

seedDB();