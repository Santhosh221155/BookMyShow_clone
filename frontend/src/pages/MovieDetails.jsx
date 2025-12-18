import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api'; // Your API helper

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [shows, setShows] = useState([]);

  useEffect(() => {
    // 1. Fetch Movie Info
    api.get(`/api/movie/${movieId}`).then(res => setMovie(res.data));
    
    // 2. Fetch Theatres showing this movie
    api.get(`/api/theatres/${movieId}`).then(res => setTheatres(res.data));
  }, [movieId]);

  const handleTheatreSelect = async (theatreName) => {
    setSelectedTheatre(theatreName);
    // 3. Fetch shows for the selected theatre
    const res = await api.get(`/api/shows/${movieId}/${theatreName}`);
    setShows(res.data);
  };

  if (!movie) return <div className="text-center mt-10 text-white">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 animate-fade-in-up pb-10">
      
      {/* LEFT: Poster */}
      <div className="w-full md:w-1/3">
         <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-lg shadow-2xl object-cover h-[500px]" />
      </div>
      
      {/* RIGHT: Flow */}
      <div className="flex-1 text-white">
        <h1 className="text-4xl font-black mb-2">{movie.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
          <span className="border border-gray-600 px-2 py-0.5 rounded">UA</span>
          <span>{movie.genre}</span>
          <span>{movie.duration} mins</span>
        </div>
        
        <p className="text-gray-400 text-sm mb-8">
          Synopsis: Experience the cinematic brilliance of {movie.title} on the big screen.
        </p>

        {/* STEP 1: THEATRE SELECTION */}
        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4 text-red-500 border-b border-gray-700 pb-2">1. Select Theatre</h3>
          <div className="flex flex-col gap-3">
            {theatres.map(theatre => (
              <button
                key={theatre}
                onClick={() => handleTheatreSelect(theatre)}
                className={`
                  p-4 rounded-lg text-left transition border
                  ${selectedTheatre === theatre 
                    ? 'bg-red-600 border-red-600 text-white font-bold' 
                    : 'bg-gray-800 border-gray-700 hover:border-red-500 text-gray-300'}
                `}
              >
                {theatre}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 2: TIME SELECTION (Only visible after theatre selected) */}
        {selectedTheatre && (
          <div className="animate-fade-in">
             <h3 className="text-lg font-bold mb-4 text-green-500 border-b border-gray-700 pb-2">
               2. Select Time for <span className="text-white">{selectedTheatre}</span>
             </h3>
             <div className="flex flex-wrap gap-3">
              {shows.map(show => (
                <button
                  key={show._id}
                  onClick={() => navigate(`/book/${show._id}`)}
                  className="px-6 py-3 bg-gray-800 border border-green-500/30 text-green-400 hover:bg-green-600 hover:text-white rounded-lg font-bold transition shadow-sm"
                >
                  {show.startTime}
                </button>
              ))}
            </div>
            {shows.length === 0 && <p className="text-gray-500">No shows available.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetails;