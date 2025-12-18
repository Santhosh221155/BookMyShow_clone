import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Booking = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengerInfo, setPassengerInfo] = useState({});

  // --- VERCEL CHANGE: Use Environment Variable ---
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch Show Details using dynamic URL
    axios.get(`${API_URL}/api/show-details/${showId}`)
      .then(res => setShow(res.data))
      .catch(err => console.error("Error fetching show details:", err));
  }, [showId, API_URL]);

  const toggleSeat = (seatId) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      const newInfo = { ...passengerInfo };
      delete newInfo[seatId];
      setPassengerInfo(newInfo);
    } else {
      setSelectedSeats(prev => [...prev, seatId]);
      setPassengerInfo(prev => ({ ...prev, [seatId]: { name: '', age: '' } }));
    }
  };

  const handleInputChange = (seatId, field, value) => {
    setPassengerInfo(prev => ({
      ...prev,
      [seatId]: { ...prev[seatId], [field]: value }
    }));
  };

  const handleBooking = async () => {
    const passengerDetails = selectedSeats.map(id => ({
      seatId: id,
      name: passengerInfo[id].name,
      age: passengerInfo[id].age
    }));

    if (passengerDetails.some(p => !p.name || !p.age)) {
      alert("Please fill in Name and Age for all selected seats.");
      return;
    }

    try {
      // Post Booking using dynamic URL
      const res = await axios.post(`${API_URL}/api/book`, {
        showId,
        passengerDetails,
        userEmail: "guest@example.com"
      });
      navigate(`/ticket/${res.data.bookingId}`);
    } catch (err) {
      alert('Booking Failed: ' + (err.response?.data?.message || 'Error'));
    }
  };

  if (!show) return <div className="text-center mt-10">Loading Layout...</div>;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* SEAT LAYOUT (Left 2/3) */}
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bold mb-4">{show.movieId.title} <span className="text-gray-500 text-lg font-normal">| {show.startTime}</span></h2>
        
        {/* Screen Visual */}
        <div className="mb-10 perspective-500">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_10px_40px_rgba(59,130,246,0.6)]"></div>
          <p className="text-center text-xs text-blue-400 mt-2 tracking-widest uppercase">Screen</p>
        </div>

        <div className="grid grid-cols-8 gap-3 justify-center max-w-lg mx-auto">
          {show.seats.map(seat => (
            <button
              key={seat.id}
              disabled={seat.isBooked}
              onClick={() => toggleSeat(seat.id)}
              className={`
                h-9 w-9 rounded-md text-xs font-bold transition-all duration-200
                ${seat.isBooked ? 'bg-gray-700 text-gray-500 cursor-not-allowed opacity-50' : 
                  selectedSeats.includes(seat.id) ? 'bg-green-500 text-white scale-110 shadow-lg' : 'bg-white text-gray-900 hover:bg-gray-200'}
              `}
            >
              {seat.id}
            </button>
          ))}
        </div>
        
        {/* Legend */}
        <div className="flex justify-center gap-6 mt-8 text-sm text-gray-400">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-white rounded"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-green-500 rounded"></div> Selected</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-700 rounded"></div> Booked</div>
        </div>
      </div>

      {/* PASSENGER DETAILS (Right 1/3) */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 h-fit sticky top-24">
        <h3 className="text-lg font-bold border-b border-gray-700 pb-3 mb-4">Passenger Details</h3>
        
        {selectedSeats.length === 0 ? (
          <p className="text-gray-500 text-sm italic">Please select seats from the layout.</p>
        ) : (
          <div className="space-y-4">
            {selectedSeats.map(seatId => (
              <div key={seatId} className="bg-gray-800 p-3 rounded border border-gray-700 animate-fade-in">
                <div className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wide">Seat {seatId}</div>
                <div className="flex gap-2">
                  <input 
                    type="text" placeholder="Name" className="w-2/3 p-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-red-500 outline-none"
                    onChange={(e) => handleInputChange(seatId, 'name', e.target.value)}
                  />
                  <input 
                    type="number" placeholder="Age" className="w-1/3 p-2 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:border-red-500 outline-none"
                    onChange={(e) => handleInputChange(seatId, 'age', e.target.value)}
                  />
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-700 mt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-400">Total Price</span>
                <span className="text-xl font-bold text-white">
                  Rs. {selectedSeats.reduce((sum, id) => sum + (show.seats.find(s => s.id === id)?.price || 0), 0)}
                </span>
              </div>
              <button 
                onClick={handleBooking}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold transition shadow-lg hover:shadow-red-900/50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;