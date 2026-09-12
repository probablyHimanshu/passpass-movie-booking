import React from 'react';
import { Link } from 'react-router-dom';
import PassPassLogo from './PassPassLogo';

function Footer() {
  return (
    <footer className="w-full bg-[#0C0A09] border-t border-[#FF6B00]/15 text-stone-400 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#FF6B00]/15">
          <div className="flex items-center gap-4">
            <Link to="/">
              <PassPassLogo className="h-8" />
            </Link>
            <span className="text-stone-400">Online Cinema Pass Reservation</span>
          </div>

          <div className="flex items-center gap-6 text-stone-300">
            <Link to="/" className="hover:text-white transition">Films</Link>
            <Link to="/setbook" className="hover:text-white transition">Seat Selection</Link>
            <Link to="/my-bookings" className="hover:text-white transition">My Tickets</Link>
            <Link to="/auth" className="hover:text-white transition">Account</Link>
            <Link to="/about" className="hover:text-white transition">About</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Pass Pass. All rights reserved.</p>
          <p>Single Unified Full-Stack Server</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
