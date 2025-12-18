import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Ticket = () => {
  const { bookingId } = useParams();
  const [ticket, setTicket] = useState(null);
  
  // --- VERCEL CHANGE: Use Environment Variable ---
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Fetch Ticket using dynamic URL
    axios.get(`${API_URL}/api/ticket/${bookingId}`)
      .then(res => setTicket(res.data))
      .catch(err => console.error("Error fetching ticket:", err));
  }, [bookingId, API_URL]);

  if (!ticket) return <div className="text-center mt-20">Printing Ticket...</div>;

  return (
    <div className="flex justify-center pt-10 pb-20">
      <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="bg-red-600 p-5 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight">MOVIE TICKET</h2>
          <p className="text-sm opacity-80 mt-1">Booking ID: {ticket.bookingId}</p>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 leading-tight mb-1">{ticket.showId.movieId.title}</h1>
          <p className="text-gray-500 text-sm font-medium">{ticket.showId.cinemaName}</p>
          <div className="mt-4 flex justify-between items-end border-b border-gray-200 pb-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Date & Time</p>
              <p className="text-lg font-bold text-gray-800">{ticket.showId.startTime}</p>
            </div>
            <div className="text-right">
               <p className="text-xs text-gray-400 uppercase font-bold">Screens</p>
               <p className="text-lg font-bold text-gray-800">Audi 04</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Seats & Passengers</p>
            <div className="bg-gray-100 p-3 rounded-lg space-y-2">
              {ticket.tickets.map((t, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="font-bold text-gray-800">Seat {t.seatId}</span>
                  <span className="text-gray-600">{t.holderName} ({t.age})</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between items-center pt-4 border-t-2 border-dashed border-gray-200">
            <span className="font-bold text-gray-900 text-xl">Total Paid</span>
            <span className="font-black text-red-600 text-2xl">Rs. {ticket.totalAmount}</span>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute top-24 -left-3 w-6 h-6 bg-gray-950 rounded-full"></div>
        <div className="absolute top-24 -right-3 w-6 h-6 bg-gray-950 rounded-full"></div>
      </div>
    </div>
  );
};

export default Ticket;