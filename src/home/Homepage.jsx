import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CustomSlider from '../components/slider';
import Moviecard from '../components/Moviecard';
import Footer from '../components/Footer';

function Homepage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  // Sync search param from URL
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/movies');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setMovies(data.data);
        } else {
          // Fallback to local list.json
          const localList = await import('../../public/list.json');
          setMovies(localList.default || []);
        }
      } catch (err) {
        console.warn('Using local movie list due to API fetch failure:', err);
        try {
          const localList = await import('../../public/list.json');
          setMovies(localList.default || []);
        } catch (e) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#f5eff9] flex flex-col justify-between page-transition">
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      <main className="flex-1">
        {/* Cinematic Hero Slider */}
        <CustomSlider movies={movies} />

        {/* Movie Explorer Catalog */}
        <Moviecard movies={movies} searchQuery={searchQuery} />
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;
