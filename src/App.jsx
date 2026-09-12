import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Homepage from './home/Homepage';
import Setbook from './components/Setbook';
import MyBookings from './components/MyBookings';
import About from './components/About';
import Contact from './components/contact';
import Auth from './components/Auth';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-[#0C0A09] text-[#f5eff9]">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/movies" element={<Homepage />} />
            <Route path="/book/:movieId" element={<Setbook />} />
            <Route path="/setbook" element={<Setbook />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            {/* Fallback route */}
            <Route path="*" element={<Homepage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
