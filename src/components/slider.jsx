import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Clock, Ticket, Film, ChevronLeft, ChevronRight, ExternalLink, X } from 'lucide-react';

function CustomSlider({ movies = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trailerModal, setTrailerModal] = useState(null);
  const navigate = useNavigate();

  const heroMovies = movies.length > 0 ? movies.slice(0, 5) : [];

  useEffect(() => {
    if (heroMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [heroMovies.length]);

  const currentMovie = heroMovies[currentIndex] || heroMovies[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % heroMovies.length);
  };

  // Helper for YouTube embed and external links
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
    if (movie.trailerUrl && movie.trailerUrl.includes('v=') && !movie.trailerUrl.includes('dQw4w9WgXcQ')) {
      const vid = movie.trailerUrl.split('v=')[1]?.split('&')[0];
      if (vid) return `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0`;
    }
    // Safe embed search
    return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent((movie.title || '') + ' official trailer')}&autoplay=1`;
  };

  const getYouTubeWatchUrl = (movie) => {
    if (movie?.trailerUrl && movie.trailerUrl.startsWith('http') && !movie.trailerUrl.includes('dQw4w9WgXcQ')) {
      return movie.trailerUrl;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent((movie?.title || 'movie') + ' official trailer')}`;
  };

  if (!currentMovie) return null;

  return (
    <div className="relative w-full bg-[#0C0A09] overflow-hidden border-b border-[#FF6B00]/20">
      {/* Dynamic Ambient Glow from Poster */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <img
          src={currentMovie.posterUrl || currentMovie.bannerUrl}
          alt=""
          className="w-full h-full object-cover blur-3xl scale-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/80 to-[#181512]/60"></div>
      </div>

      {/* Main Hero Spotlight Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 min-h-[500px] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Film Metadata & Actions */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            {/* Top Badges (No AI stars, using Film icon) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF6B00]/20 text-[#FF8533] border border-[#FF6B00]/40 shadow-sm">
                <Film className="w-3.5 h-3.5 text-[#FF6B00]" /> FEATURED PREMIERE
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#181512] text-amber-400 border border-[#FF6B00]/25">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {currentMovie.rating || 8.5} / 10
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-stone-300 bg-[#181512] border border-[#FF6B00]/20">
                <Clock className="w-3.5 h-3.5 text-[#FFA066]" />
                {currentMovie.duration || '2h 15m'}
              </span>
            </div>

            {/* Movie Title */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none drop-shadow-md">
              {currentMovie.title}
            </h1>

            {/* Genre & Format Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {currentMovie.genre?.map((g) => (
                <span
                  key={g}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#181512] text-stone-300 border border-[#FF6B00]/25"
                >
                  {g}
                </span>
              ))}
              {currentMovie.formats?.map((fmt) => (
                <span
                  key={fmt}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#FF6B00]/20 text-white border border-[#FF6B00]/40"
                >
                  {fmt}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-stone-300 line-clamp-3 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {currentMovie.synopsis}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => navigate(`/book/${currentMovie._id}`)}
                className="px-7 py-3 rounded-full btn-pass-primary font-bold text-xs shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Ticket className="w-4 h-4" />
                <span>Book Seats</span>
              </button>

              {/* Watch Trailer Button with YouTube play */}
              <button
                onClick={() => setTrailerModal(currentMovie)}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#181512]/90 hover:bg-[#FF6B00]/30 text-white text-xs font-bold border border-[#FF6B00]/40 backdrop-blur-md transition-all duration-200 hover:scale-105 shadow-md group"
              >
                <div className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                </div>
                <span>Watch Trailer</span>
              </button>
            </div>
          </div>

          {/* Right Column: CRYSTAL-CLEAR MOVIE POSTER CARD */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              onClick={() => navigate(`/book/${currentMovie._id}`)}
              className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-2xl border-2 border-[#FF6B00]/40 w-64 sm:w-72 aspect-[2/3] hover:border-[#FF6B00] hover:shadow-[0_15px_45px_rgba(255,107,0,0.4)] transition-all duration-400 hover:scale-105 bg-[#181512]"
            >
              {/* The Crystal Clear Poster Image */}
              <img
                src={currentMovie.posterUrl}
                alt={currentMovie.title}
                className="w-full h-full object-cover object-top crystal-clear-img"
              />

              {/* Minimal Clean Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                <div className="w-full py-2.5 rounded-xl btn-pass-primary text-white text-xs font-bold text-center shadow-lg">
                  Select Seats
                </div>
              </div>

              {/* Rating Badge on Poster */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-[#0C0A09]/85 backdrop-blur-md border border-[#FF6B00]/40 text-xs font-bold text-amber-400 flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{currentMovie.rating || 8.5}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Arrows & Dot Indicators */}
      {heroMovies.length > 1 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-[#181512] hover:bg-[#FF6B00] text-stone-300 hover:text-white border border-[#FF6B00]/30 transition shadow"
              aria-label="Previous film"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-[#181512] hover:bg-[#FF6B00] text-stone-300 hover:text-white border border-[#FF6B00]/30 transition shadow"
              aria-label="Next film"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {heroMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === idx
                    ? 'w-7 h-1.5 bg-[#FF6B00] shadow-[0_0_8px_#FF6B00]'
                    : 'w-1.5 h-1.5 bg-[#FF6B00]/40 hover:bg-[#FF6B00]'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* REAL YOUTUBE TRAILER MODAL WITH IN-PAGE STREAM & DIRECT REDIRECT */}
      {trailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
          <div className="pass-panel w-full max-w-3xl rounded-3xl overflow-hidden relative shadow-2xl border border-[#FF6B00]/50 bg-[#14110E]">
            {/* Modal Header */}
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

            {/* Embedded YouTube Player */}
            <div className="aspect-video w-full bg-black relative">
              <iframe
                src={getYouTubeEmbedUrl(trailerModal)}
                title={`${trailerModal.title} Official Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#181512] border-t border-[#FF6B00]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-stone-300">
                <span>Rating: <strong className="text-amber-400">★ {trailerModal.rating || 8.5}/10</strong></span>
                <span className="mx-2 text-[#FF6B00]">•</span>
                <span>{trailerModal.duration || '2h 15m'}</span>
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
                  <span>Open in YouTube App/Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#FF8533]" />
                </a>

                <button
                  onClick={() => {
                    const id = trailerModal._id;
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
    </div>
  );
}

export default CustomSlider;
