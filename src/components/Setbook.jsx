import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PassPassLogo from './PassPassLogo';
import { useAuth } from '../context/AuthContext';
import './style.css';
import {
  Calendar,
  Clock,
  Ticket,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
  Smartphone,
  ChevronLeft,
  Printer,
  ShieldCheck,
  Star,
  Play,
  ExternalLink,
  X,
} from 'lucide-react';

const SEAT_ROWS = [
  { row: 'A', tier: 'VIP', seatsCount: 8, price: 380 },
  { row: 'B', tier: 'VIP', seatsCount: 8, price: 380 },
  { row: 'C', tier: 'Premium', seatsCount: 10, price: 260 },
  { row: 'D', tier: 'Premium', seatsCount: 10, price: 260 },
  { row: 'E', tier: 'Premium', seatsCount: 10, price: 260 },
  { row: 'F', tier: 'Standard', seatsCount: 10, price: 190 },
  { row: 'G', tier: 'Standard', seatsCount: 10, price: 190 },
  { row: 'H', tier: 'Standard', seatsCount: 10, price: 190 },
];

const Setbook = () => {
  const { movieId: routeMovieId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [allMovies, setAllMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [bookedSeatsList, setBookedSeatsList] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showTrailer, setShowTrailer] = useState(false);

  const getYouTubeEmbedUrl = (movie) => {
    if (movie?.trailerUrl && (movie.trailerUrl.includes('youtube.com') || movie.trailerUrl.includes('youtu.be'))) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = movie.trailerUrl.match(regExp);
      if (match && match[2].length === 11) {
        return `https://www.youtube-nocookie.com/embed/${match[2]}?autoplay=1&rel=0`;
      }
    }
    const query = encodeURIComponent(`${movie?.title || 'movie'} official trailer`);
    return `https://www.youtube-nocookie.com/embed?listType=search&list=${query}&autoplay=1`;
  };

  const getYouTubeWatchUrl = (movie) => {
    if (movie?.trailerUrl && (movie.trailerUrl.includes('youtube.com') || movie.trailerUrl.includes('youtu.be'))) {
      return movie.trailerUrl;
    }
    const query = encodeURIComponent(`${movie?.title || 'movie'} official trailer`);
    return `https://www.youtube.com/results?search_query=${query}`;
  };

  // Customer info (auto-filled if user is logged in)
  const [customer, setCustomer] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    paymentMethod: 'UPI',
  });

  useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
    }
  }, [user]);

  // 1. Generate available dates
  useEffect(() => {
    const dates = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const isoStr = d.toISOString().split('T')[0];
      dates.push({
        iso: isoStr,
        dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()],
        dateNum: d.getDate(),
        month: months[d.getMonth()],
      });
    }

    setAvailableDates(dates);
    setSelectedDate(dates[0].iso);
  }, []);

  // 2. Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/movies');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setAllMovies(data.data);
          const targetId = routeMovieId || searchParams.get('movieId');
          const found = data.data.find((m) => m._id === targetId || m.id?.toString() === targetId);
          setSelectedMovie(found || data.data[0]);
        }
      } catch (err) {
        console.error('Failed to fetch movies:', err);
      }
    };
    fetchMovies();
  }, [routeMovieId, searchParams]);

  // 3. Fetch showtimes
  useEffect(() => {
    if (!selectedMovie || !selectedDate) return;

    const fetchShowtimes = async () => {
      try {
        const res = await fetch(`/api/showtimes?movieId=${selectedMovie._id}&date=${selectedDate}`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setShowtimes(data.data);
          setSelectedShowtime(data.data[0]);
          setBookedSeatsList(data.data[0].bookedSeats || []);
        } else {
          const fallbackShowtimes = [
            {
              _id: 'st-1',
              time: '10:30 AM',
              format: 'Dolby Atmos',
              screenName: 'Auditorium 1',
              bookedSeats: ['A3', 'A4', 'C5'],
            },
            {
              _id: 'st-2',
              time: '02:15 PM',
              format: 'IMAX 3D',
              screenName: 'Auditorium 2',
              bookedSeats: ['B4', 'B5'],
            },
            {
              _id: 'st-3',
              time: '06:45 PM',
              format: 'Dolby Atmos',
              screenName: 'Auditorium 1',
              bookedSeats: ['A1', 'A2', 'C7'],
            },
            {
              _id: 'st-4',
              time: '10:00 PM',
              format: '4K Laser',
              screenName: 'Auditorium 3',
              bookedSeats: ['E5', 'E6'],
            },
          ];
          setShowtimes(fallbackShowtimes);
          setSelectedShowtime(fallbackShowtimes[0]);
          setBookedSeatsList(fallbackShowtimes[0].bookedSeats);
        }
        setSelectedSeats([]);
      } catch (err) {
        console.error('Failed to fetch showtimes:', err);
      }
    };

    fetchShowtimes();
  }, [selectedMovie, selectedDate]);

  const handleShowtimeChange = (st) => {
    setSelectedShowtime(st);
    setBookedSeatsList(st.bookedSeats || []);
    setSelectedSeats([]);
  };

  const handleSeatClick = (seatId, tier, defaultPrice) => {
    if (bookedSeatsList.includes(seatId)) return;

    const price =
      tier === 'VIP'
        ? selectedMovie?.priceVIP || defaultPrice
        : tier === 'Premium'
        ? selectedMovie?.pricePremium || defaultPrice
        : selectedMovie?.priceStandard || defaultPrice;

    const alreadySelected = selectedSeats.some((s) => s.seatId === seatId);

    if (alreadySelected) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatId !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        alert('Maximum 8 seats allowed per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, { seatId, tier, price }]);
    }
  };

  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? 30 * selectedSeats.length : 0;
  const tax = selectedSeats.length > 0 ? Math.round((subtotal + convenienceFee) * 0.18) : 0;
  const grandTotal = subtotal + convenienceFee + tax;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.phone) {
      setErrorMessage('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        showtimeId: selectedShowtime._id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        selectedSeats,
        paymentMethod: customer.paymentMethod,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConfirmedBooking(data.data);
        setShowCheckoutModal(false);
        setBookedSeatsList([...bookedSeatsList, ...selectedSeats.map((s) => s.seatId)]);
        setSelectedSeats([]);
      } else {
        setErrorMessage(data.message || 'Booking could not be processed.');
      }
    } catch (err) {
      setErrorMessage('Connection error. Please ensure backend is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#f5eff9] flex flex-col justify-between page-transition">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Back & Switcher */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4 text-stone-400" />
            <span>All Films</span>
          </button>

          {allMovies.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400">Film:</span>
              <select
                value={selectedMovie?._id || ''}
                onChange={(e) => {
                  const m = allMovies.find((item) => item._id === e.target.value);
                  if (m) setSelectedMovie(m);
                }}
                className="bg-[#181512] border border-[#FF6B00]/25 text-[#f5eff9] text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#FF6B00]"
              >
                {allMovies.map((m) => (
                  <option key={m._id} value={m._id} className="bg-[#181512] text-white">
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Selected Movie Context Banner with Crystal Clear Poster & Trailer Watch */}
        {selectedMovie && (
          <div className="pass-panel rounded-3xl p-5 mb-8 flex flex-col sm:flex-row items-center gap-5 border border-[#FF6B00]/25">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded-2xl shadow-xl border border-[#FF6B00]/30 crystal-clear-img"
            />
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-stone-400">
                <span>{selectedMovie.duration}</span>
                <span>•</span>
                <span>{selectedMovie.genre?.join(', ')}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-white">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {selectedMovie.rating}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {selectedMovie.title}
              </h1>
              <p className="text-xs text-stone-400 max-w-xl line-clamp-2">
                {selectedMovie.synopsis}
              </p>

              {/* Trailer Action Buttons */}
              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowTrailer(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF6B00]/15 hover:bg-[#FF6B00]/30 border border-[#FF6B00]/40 text-[#FF8533] hover:text-white text-xs font-semibold transition"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Trailer</span>
                </button>
                <a
                  href={getYouTubeWatchUrl(selectedMovie)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-400 hover:text-white text-[11px] transition"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Date & Showtime Selector in Palette */}
        <div className="pass-panel rounded-3xl p-5 mb-8 space-y-4 border border-[#FF6B00]/25">
          {/* Dates */}
          <div>
            <div className="text-xs font-bold text-[#FF8533] uppercase tracking-wider mb-2.5">
              Select Date
            </div>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              {availableDates.map((d) => (
                <button
                  key={d.iso}
                  onClick={() => setSelectedDate(d.iso)}
                  className={`px-4 py-2.5 rounded-2xl text-xs transition-all ${
                    selectedDate === d.iso
                      ? 'bg-[#FF6B00] text-white font-bold shadow-[0_0_14px_rgba(255,107,0,0.4)]'
                      : 'bg-[#181512] text-stone-400 hover:text-white hover:bg-[#FF6B00]/15 border border-[#FF6B00]/20'
                  }`}
                >
                  <div className={`text-[10px] uppercase font-bold ${selectedDate === d.iso ? 'text-white/90' : 'text-stone-500'}`}>
                    {d.dayName}
                  </div>
                  <div className="text-sm font-bold">{d.dateNum} {d.month}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Times */}
          <div>
            <div className="text-xs font-bold text-[#FF8533] uppercase tracking-wider mb-2.5">
              Select Showtime
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {showtimes.map((st) => (
                <button
                  key={st._id}
                  onClick={() => handleShowtimeChange(st)}
                  className={`px-4 py-2 rounded-xl text-xs transition-all ${
                    selectedShowtime?._id === st._id
                      ? 'btn-pass-primary font-bold shadow-lg'
                      : 'bg-[#181512] text-stone-300 hover:bg-[#FF6B00]/15 border border-[#FF6B00]/20'
                  }`}
                >
                  <div className="font-bold">{st.time}</div>
                  <div className="text-[10px] opacity-80">{st.format || 'Dolby Atmos'}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seat Layout */}
        <div className="pass-panel rounded-3xl p-6 sm:p-8 mb-8 relative border border-[#FF6B00]/25">
          <div className="max-w-md mx-auto mb-10 text-center">
            <div className="screen-arc"></div>
            <p className="text-[10px] uppercase tracking-widest text-[#FF8533] font-bold mt-3">
              Screen
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mb-8 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#181512] border border-[#FF6B00]/30"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-gradient-to-r from-[#FF6B00] to-[#FF8533] shadow-[0_0_8px_#FF6B00]"></div>
              <span className="text-white font-medium">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded bg-[#0C0A09] border border-white/5 opacity-50"></div>
              <span>Occupied</span>
            </div>
          </div>

          {/* Tiered Grid */}
          <div className="max-w-2xl mx-auto space-y-5 overflow-x-auto pb-2">
            {['VIP', 'Premium', 'Standard'].map((tierCategory) => {
              const tierRows = SEAT_ROWS.filter((r) => r.tier === tierCategory);
              const tierPrice =
                tierCategory === 'VIP'
                  ? selectedMovie?.priceVIP || 380
                  : tierCategory === 'Premium'
                  ? selectedMovie?.pricePremium || 260
                  : selectedMovie?.priceStandard || 190;

              return (
                <div key={tierCategory} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 px-2 pb-1 border-b border-[#FF6B00]/20">
                    <span className="font-bold uppercase text-white">{tierCategory}</span>
                    <span className="text-[#FF8533] font-bold">₹{tierPrice}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {tierRows.map((r) => (
                      <div key={r.row} className="flex items-center justify-center gap-2">
                        <span className="w-4 text-center text-[10px] font-bold text-stone-500">
                          {r.row}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: r.seatsCount }, (_, i) => {
                            const seatNumber = i + 1;
                            const seatId = `${r.row}${seatNumber}`;
                            const isBooked = bookedSeatsList.includes(seatId);
                            const isSelected = selectedSeats.some((s) => s.seatId === seatId);

                            let seatClass = 'seat-btn seat-available';
                            if (isBooked) seatClass = 'seat-btn seat-booked';
                            else if (isSelected) seatClass = 'seat-btn seat-selected';

                            return (
                              <React.Fragment key={seatId}>
                                {r.seatsCount === 10 && (seatNumber === 3 || seatNumber === 9) && (
                                  <div className="w-3"></div>
                                )}
                                {r.seatsCount === 8 && seatNumber === 5 && (
                                  <div className="w-4"></div>
                                )}

                                <button
                                  type="button"
                                  disabled={isBooked}
                                  onClick={() => handleSeatClick(seatId, r.tier, r.price)}
                                  className={seatClass}
                                >
                                  {seatNumber}
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        <span className="w-4 text-center text-[10px] font-bold text-stone-500">
                          {r.row}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Minimal Bottom Sticky Checkout Bar */}
        <div className="pass-panel-glass rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-4 z-30 shadow-2xl border border-[#FF6B00]/35">
          <div className="flex items-center gap-5 w-full sm:w-auto justify-between sm:justify-start">
            <div>
              <div className="text-[11px] text-stone-400">Selected Seats:</div>
              <div className="text-sm font-bold text-white flex items-center gap-1">
                {selectedSeats.length > 0 ? (
                  selectedSeats.map((s) => (
                    <span
                      key={s.seatId}
                      className="px-2.5 py-0.5 rounded-lg bg-[#FF6B00]/20 text-white border border-[#FF6B00]/40 text-xs font-bold shadow"
                    >
                      {s.seatId}
                    </span>
                  ))
                ) : (
                  <span className="text-stone-500 font-normal text-xs">No seats selected</span>
                )}
              </div>
            </div>

            <div className="border-l border-[#FF6B00]/25 pl-5">
              <div className="text-[11px] text-stone-400">Total Amount:</div>
              <div className="text-lg font-bold text-white">
                ₹{grandTotal}
              </div>
            </div>
          </div>

          <button
            disabled={selectedSeats.length === 0}
            onClick={() => setShowCheckoutModal(true)}
            className={`w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-xs transition duration-200 ${
              selectedSeats.length > 0
                ? 'btn-pass-primary shadow-xl hover:scale-105'
                : 'bg-[#181512] text-stone-600 cursor-not-allowed border border-white/5'
            }`}
          >
            Checkout
          </button>
        </div>
      </main>

      {/* Checkout Modal with ANIMATED UPI QR SCANNER */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="pass-panel w-full max-w-lg rounded-3xl p-6 sm:p-7 relative shadow-2xl border border-[#FF6B00]/30 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowCheckoutModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-1">
              <PassPassLogo className="h-7" />
              <span className="text-sm font-bold text-white">Checkout</span>
            </div>
            <p className="text-xs text-stone-400 mb-5">
              {selectedMovie?.title} • {selectedDate} ({selectedShowtime?.time})
            </p>

            {errorMessage && (
              <div className="p-3 mb-4 rounded-2xl bg-[#FF6B00]/20 border border-[#FF6B00] text-white text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#FF8533]" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Price Snapshot */}
            <div className="bg-[#0C0A09]/70 rounded-2xl p-3.5 border border-[#FF6B00]/20 mb-5 text-xs space-y-1.5">
              <div className="flex justify-between text-white font-medium">
                <span>Seats: {selectedSeats.map((s) => s.seatId).join(', ')}</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-400 text-[11px]">
                <span>Fees & GST</span>
                <span>₹{convenienceFee + tax}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1.5 border-t border-[#FF6B00]/20">
                <span>Total Payable</span>
                <span className="text-[#FF8533] font-extrabold text-base">₹{grandTotal}</span>
              </div>
            </div>

            {/* Customer Inputs */}
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-stone-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@example.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0C0A09]/70 border border-[#FF6B00]/25 text-white placeholder-stone-500 focus:outline-none focus:border-[#FF6B00] text-xs"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-[11px] font-medium text-stone-300 mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'UPI', label: 'UPI / QR', icon: QrCode },
                    { id: 'Card', label: 'Card', icon: CreditCard },
                    { id: 'NetBanking', label: 'NetBanking', icon: Smartphone },
                  ].map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setCustomer({ ...customer, paymentMethod: m.id })}
                        className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition ${
                          customer.paymentMethod === m.id
                            ? 'bg-[#FF6B00]/25 border-[#FF6B00] text-white font-bold shadow'
                            : 'bg-[#0C0A09]/50 border-[#FF6B00]/20 text-stone-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#FF8533]" />
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ANIMATED UPI QR SCANNER WITH LASER BEAM */}
              {customer.paymentMethod === 'UPI' && (
                <div className="pt-2 pb-2">
                  <div className="qr-scanner-box p-5 text-center relative max-w-[280px] mx-auto">
                    {/* Glowing Laser Scan Beam Effect */}
                    <div className="qr-scan-line"></div>

                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#FF6B00]"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#FF6B00]"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#FF6B00]"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#FF6B00]"></div>

                    {/* QR Image */}
                    <div className="relative z-0 p-2 bg-white rounded-xl inline-block shadow-xl">
                      <img
                        src="/pay.png"
                        alt="Scan to Pay UPI QR"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                    </div>

                    {/* Live Scanner Pulsing Dot */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B00]"></span>
                      </span>
                      <span className="text-[11px] font-semibold text-white">
                        Scan with GPay, PhonePe, Paytm
                      </span>
                    </div>

                    <div className="text-[10px] text-stone-400 mt-1">
                      UPI ID: <strong className="text-white">passpass@bank</strong> • Amount: <strong className="text-[#FF8533]">₹{grandTotal}</strong>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-2xl btn-pass-primary font-bold text-xs transition duration-200 mt-2 flex items-center justify-center gap-2 shadow-xl hover:scale-102"
              >
                {submitting ? (
                  <span>Reserving Seats in MongoDB...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {customer.paymentMethod === 'UPI' ? 'Verify & Confirm Payment' : `Pay ₹${grandTotal}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Ticket Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="pass-panel w-full max-w-sm rounded-3xl p-6 relative shadow-2xl border border-[#FF6B00]/40">
            <div className="text-center mb-5">
              <div className="w-10 h-10 rounded-full bg-[#FF6B00]/20 text-[#FF8533] border border-[#FF6B00] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Booking Confirmed</h3>
              <p className="text-xs text-stone-400">Your pass is ready</p>
            </div>

            {/* Digital Pass Card */}
            <div className="bg-[#181512] rounded-2xl p-5 border border-[#FF6B00]/30 relative overflow-hidden">
              <div className="ticket-notch-left"></div>
              <div className="ticket-notch-right"></div>

              <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#FF6B00]/30">
                <PassPassLogo className="h-6" />
                <span className="text-[10px] font-mono text-white bg-[#FF6B00] px-2 py-0.5 rounded border border-[#FF8533]/50">
                  {confirmedBooking.bookingRef}
                </span>
              </div>

              <div className="py-3 space-y-1">
                <h4 className="font-bold text-white text-base leading-tight">
                  {confirmedBooking.movieTitle}
                </h4>
                <div className="text-xs text-stone-400">
                  {confirmedBooking.showDate} • {confirmedBooking.showTime}
                </div>
                <div className="text-xs font-bold text-[#FF8533] pt-1">
                  Seats: {confirmedBooking.seats.map((s) => s.seatId).join(', ')}
                </div>
              </div>

              <div className="pt-3 border-t border-dashed border-[#FF6B00]/30 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-stone-400">Passenger</div>
                  <div className="text-xs font-medium text-white">{confirmedBooking.customerName}</div>
                </div>

                <div className="w-12 h-12 bg-white p-1 rounded-lg">
                  <QrCode className="w-full h-full text-black" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-[#0C0A09] hover:bg-[#181512] text-stone-300 text-xs font-medium border border-[#FF6B00]/30 flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={() => navigate('/my-bookings')}
                className="flex-1 py-2 rounded-xl btn-pass-primary text-xs font-bold"
              >
                My Tickets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embedded YouTube Trailer Modal */}
      {showTrailer && selectedMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="pass-panel w-full max-w-3xl rounded-3xl p-4 sm:p-6 relative border border-[#FF6B00]/35 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#FF6B00] fill-current" />
                <h3 className="text-sm font-bold text-white">
                  {selectedMovie.title} - Official Trailer
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={getYouTubeWatchUrl(selectedMovie)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-[#FF6B00]/20 hover:bg-[#FF6B00]/30 text-[#FF8533] text-xs font-medium flex items-center gap-1 transition"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => setShowTrailer(false)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-stone-300 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={getYouTubeEmbedUrl(selectedMovie)}
                title={`${selectedMovie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Setbook;
