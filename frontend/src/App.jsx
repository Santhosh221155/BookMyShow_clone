import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Booking from './pages/Booking';
import Ticket from './pages/Ticket';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white font-sans">
        {/* Persistent Navbar */}
        <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 shadow-lg px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-red-600 tracking-tighter hover:text-red-500 transition">
            BookMyShow <span className="text-white text-xs font-normal opacity-50">CLONE</span>
          </Link>
          <Link to="/" className="text-sm font-semibold text-gray-300 hover:text-white transition bg-gray-800 px-4 py-2 rounded-full">
            ← Home / Movies
          </Link>
        </nav>

        <div className="p-6 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:movieId" element={<MovieDetails />} />
            <Route path="/book/:showId" element={<Booking />} />
            <Route path="/ticket/:bookingId" element={<Ticket />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;