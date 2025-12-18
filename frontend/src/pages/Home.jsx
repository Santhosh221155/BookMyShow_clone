import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  
  // --- VERCEL CHANGE: Use Environment Variable ---
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch Movies using dynamic URL
    axios.get(`${API_URL}/api/movies`)
      .then(res => setMovies(res.data))
      .catch(err => console.error("Error fetching movies:", err));
  }, [API_URL]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-gray-400">Now Showing</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {movies.map(movie => (
          <div 
            key={movie._id} 
            onClick={() => navigate(`/movie/${movie._id}`)}
            className="group cursor-pointer bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-red-600 hover:scale-105 transition duration-300"
          >
            <div className="relative h-80 overflow-hidden">
              <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover group-hover:opacity-80 transition" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">Book Now</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg truncate">{movie.title}</h3>
              <p className="text-xs text-gray-500">{movie.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;