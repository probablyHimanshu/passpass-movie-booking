import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Film, Play, ExternalLink, X, Ticket } from 'lucide-react';

const CATEGORIES = ['All', 'Action', 'Drama', 'Thriller', 'Sci-Fi'];

function Moviecard({ movies = [], searchQuery = '' }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [trailerModal, setTrailerModal] = useState(null);
  const navigate = useNavigate();

  const getYouTubeEmbedUrl = (movie) => {
    if (!movie) return '';
    const trailerMap = {
      'jigra': 'jNQXAC9IVRw',
      'devara: part 1': 'kGgA5k2yVq8',
      'devara': 'kGgA5k2yVq8',
      'vettaiyan': 's12z_r4mQ1g',
      'stree 2': 'qeaZ_x1j3hY',
      'kalki 2898 ad': 'kQDd1AhGIHk',
      'tumbbad': 'sN75MPxgvX8',
      'deadpool & wolverine': '73_1biulkYk',
      'gladiator ii': '4rgYUipGJNo',
      'joker: folie à deux': '_OKAwz2NiJs',
    };
    const key = (movie.title || '').toLowerCase().trim();
    const directId = trailerMap[key];
    if (directId) {
      return `https://www.youtube-nocookie.com/embed/${directId}?autoplay=1&rel=0`;
    }
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((movie.title || '') + ' official trailer')}&autoplay=1`;
  };

  const getYouTubeWatchUrl = (movie) => {
    if (movie?.trailerUrl && movie.trailerUrl.startsWith('http') && !movie.trailerUrl.includes('dQw4w9WgXcQ')) {
      return movie.trailerUrl;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent((movie?.title || 'movie') + ' official trailer')}`;
  };

  const filteredMovies = movies.filter((movie) => {
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      matchesCategory = movie.genre?.some(
        (g) => g.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        movie.title?.toLowerCase().includes(q) ||
        movie.synopsis?.toLowerCase().includes(q) ||
        movie.genre?.some((g) => g.toLowerCase().includes(q));
    }

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="movies" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header & Category Filter in GoBus Orange Palette */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#FFA066] uppercase tracking-wider mb-1">
            <Film className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Now In Auditoriums</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Explore Films
          </h2>
        </div>

        {/* Minimal Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#FF6B00] text-white shadow-[0_0_14px_rgba(255,107,0,0.6)]'
                  : 'text-stone-300 hover:text-white bg-[#181512] hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crystal Clear Movie Poster Grid */}
      {filteredMovies.length === 0 ? (
        <div className="text-center py-16 pass-panel rounded-3xl p-8 border border-[#FF6B00]/30">
          <p className="text-xs text-[#FFA066]">No movies found for this filter.</p>
          <button
            onClick={() => setSelectedCategory('All')}
            className="mt-3 text-xs text-white hover:underline"
          >
            Reset filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id || movie.id}
              className="group cursor-pointer flex flex-col justify-between"
            >
              {/* Crystal-Clear Movie Poster with High Visual Fidelity */}
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-[#181512] border border-[#FF6B00]/30 mb-3 shadow-lg group-hover:border-[#FF6B00] group-hover:shadow-[0_12px_32px_rgba(255,107,0,0.4)] transition-all duration-300">
                <img
                  src={movie.posterUrl || movie.image}
                  alt={movie.title || movie.name}
                  onClick={() => navigate(`/book/${movie._id || movie.id}`)}
                  className="w-full h-full object-cover crystal-clear-img group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Direct Trailer Watch Button (Top Right Pill) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTrailerModal(movie);
                  }}
                  className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0C0A09]/85 hover:bg-[#FF6B00] text-[#FF8533] hover:text-white border border-[#FF6B00]/40 text-[10px] font-bold backdrop-blur-md transition shadow-md group/tr"
                  title="Watch Trailer"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>Trailer</span>
                </button>

                {/* Subtle Hover Action Buttons */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex flex-col gap-1.5 z-20">
                  <button
                    onClick={() => navigate(`/book/${movie._id || movie.id}`)}
                    className="w-full py-2 rounded-xl btn-pass-primary text-white text-xs font-bold text-center shadow-xl hover:scale-105 transition"
                  >
                    Select Seats
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTrailerModal(movie);
                    }}
                    className="w-full py-1.5 rounded-xl bg-[#0C0A09]/90 hover:bg-[#181512] border border-[#FF6B00]/40 text-[#FFA066] text-[11px] font-bold text-center flex items-center justify-center gap-1 shadow"
                  >
                    <Play className="w-2.5 h-2.5 fill-[#FFA066]" />
                    <span>Watch Trailer</span>
                  </button>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-[#0C0A09]/85 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-[#FF6B00]/40 flex items-center gap-1 shadow">
                  <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  <span>{movie.rating || 8.0}</span>
                </div>
              </div>

              {/* Title & Metadata */}
              <div
                className="space-y-0.5"
                onClick={() => navigate(`/book/${movie._id || movie.id}`)}
              >
                <h3 className="font-bold text-sm text-white group-hover:text-[#FF8533] transition-colors line-clamp-1">
                  {movie.title || movie.name}
                </h3>
                <div className="flex items-center justify-between text-[11px] text-stone-400">
                  <span className="line-clamp-1">
                    {Array.isArray(movie.genre) ? movie.genre.slice(0, 2).join(', ') : movie.title}
                  </span>
                  <span className="text-[#FF8533] font-bold">₹{movie.priceStandard || 180}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TRAILER MODAL */}
      {trailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
          <div className="pass-panel w-full max-w-3xl rounded-3xl overflow-hidden relative shadow-2xl border border-[#FF6B00]/50 bg-[#14110E]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#FF6B00]/25 bg-[#181512]">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold shadow">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white leading-tight">
                    {trailerModal.title} - Official Trailer
                  </h3>
                  <p className="text-[10px] text-[#FFA066]">Watch trailer in cinema mode or on YouTube</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getYouTubeWatchUrl(trailerModal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold shadow transition"
                  title="Watch directly on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => setTrailerModal(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-stone-400 hover:text-white transition"
                  title="Close trailer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={getYouTubeEmbedUrl(trailerModal)}
                title={`${trailerModal.title} Official Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-[#181512] border-t border-[#FF6B00]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-stone-300">
                <span>Rating: <strong className="text-amber-400">★ {trailerModal.rating || 8.0}/10</strong></span>
                <span className="mx-2 text-[#FF6B00]">•</span>
                <span className="text-[#FFA066]">{Array.isArray(trailerModal.genre) ? trailerModal.genre.join(', ') : 'Cinema'}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getYouTubeWatchUrl(trailerModal)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#0C0A09] hover:bg-[#FF6B00]/20 border border-[#FF6B00]/40 text-stone-200 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <span>Open on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF8533]" />
                </a>

                <button
                  onClick={() => {
                    const id = trailerModal._id || trailerModal.id;
                    setTrailerModal(null);
                    navigate(`/book/${id}`);
                  }}
                  className="px-5 py-2 rounded-xl btn-pass-primary text-xs font-bold shadow flex items-center gap-1.5 hover:scale-105 transition"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Book Seats</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Moviecard;
