import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PassPassLogo from './PassPassLogo';
import { Ticket, Search, QrCode, Printer, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState(user?.email || '');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchBookings = async (query = '') => {
    try {
      setLoading(true);
      setError('');
      let url = '/api/bookings';
      const effectiveQuery = query.trim() || user?.email || '';
      if (effectiveQuery) {
        if (effectiveQuery.includes('@')) {
          url += `?email=${encodeURIComponent(effectiveQuery)}`;
        } else {
          url += `?ref=${encodeURIComponent(effectiveQuery)}`;
        }
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setBookings(data.data);
      } else {
        setError(data.message || 'Failed to retrieve tickets.');
      }
    } catch (err) {
      setError('Could not connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(user?.email || '');
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBookings(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#fdfbf7] flex flex-col justify-between page-transition">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="text-center max-w-lg mx-auto mb-10">
          <div className="inline-block mb-3">
            <PassPassLogo className="h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            My Digital Passes
          </h1>
          <p className="text-xs text-[#FFA066] mt-1 font-medium">
            Access and print your reserved film tickets anytime
          </p>

          <form onSubmit={handleSearch} className="mt-5 flex items-center max-w-sm mx-auto gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter email or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-[#181512] border border-[#FF6B00]/30 text-white placeholder-stone-400 focus:outline-none focus:border-[#FF6B00] text-xs shadow-inner"
              />
              <Search className="w-3.5 h-3.5 text-[#FF8533] absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl btn-pass-primary font-bold text-xs shadow-md transition"
            >
              Lookup
            </button>
          </form>
        </div>

        {error && (
          <div className="p-3 mb-6 rounded-2xl bg-[#EA580C]/25 border border-rose-500/40 text-white text-xs flex items-center gap-2 max-w-md mx-auto">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-300" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-16 text-[#FFA066] text-xs">
            Loading reservations...
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 pass-panel rounded-3xl max-w-md mx-auto p-6 border border-[#FF6B00]/30">
            <p className="text-xs text-[#FFA066]">No passes found.</p>
            <button
              onClick={() => navigate('/setbook')}
              className="mt-3 px-5 py-2 rounded-xl btn-pass-primary text-xs font-bold shadow"
            >
              Book a Movie
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="pass-panel rounded-3xl p-5 relative overflow-hidden flex flex-col justify-between border border-[#FF6B00]/35 shadow-xl bg-[#181512]"
              >
                <div className="ticket-notch-left"></div>
                <div className="ticket-notch-right"></div>

                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#FF6B00]/30">
                    <PassPassLogo className="h-6" />
                    <span className="text-[10px] font-mono text-white bg-[#FF6B00] px-2 py-0.5 rounded border border-[#FF8533]/50 shadow-sm font-bold">
                      {b.bookingRef}
                    </span>
                  </div>

                  <div className="py-3 space-y-1">
                    <h3 className="text-base font-bold text-white leading-tight">
                      {b.movieTitle}
                    </h3>
                    <div className="text-xs text-stone-300">
                      {b.showDate} • {b.showTime} • {b.screenName}
                    </div>
                    <div className="text-xs font-bold text-[#FF8533] pt-1">
                      Seats: {b.seats.map((s) => s.seatId).join(', ')}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-dashed border-[#FF6B00]/30 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-stone-400">Passenger</div>
                      <div className="font-semibold text-white">{b.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-stone-400">Total Paid</div>
                      <div className="font-bold text-[#FF8533]">₹{b.totalAmount}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[#FF6B00]/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-stone-300">
                    <QrCode className="w-4 h-4 text-[#FF8533]" />
                    <span>Scan at Gate</span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0C0A09] hover:bg-[#181512] text-stone-300 hover:text-white text-xs font-medium border border-[#FF6B00]/35 transition"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#FF8533]" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyBookings;
