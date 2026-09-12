import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Ticket, User, LogOut, Menu, X } from 'lucide-react';
import PassPassLogo from './PassPassLogo';
import { useAuth } from '../context/AuthContext';

function Navbar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    } else {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const navLinks = [
    { name: 'Movies', path: '/' },
    { name: 'Book Seats', path: '/setbook' },
    { name: 'My Tickets', path: '/my-bookings' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0C0A09]/90 backdrop-blur-xl border-b border-[#FF6B00]/20 transition-all shadow-xl shadow-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <PassPassLogo className="h-10 sm:h-12" />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors relative py-1 ${
                    isActive(link.path)
                      ? 'text-white font-bold'
                      : 'text-stone-300 hover:text-[#FFA066]'
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#FF6B00] to-[#FF8533] rounded-full shadow-[0_0_8px_#FF6B00]" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Clean Search Input */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-8 pr-3 py-1.5 text-xs bg-[#181512] border border-[#FF6B00]/30 rounded-full text-white placeholder-stone-400 focus:outline-none focus:border-[#FF6B00] focus:w-60 transition-all duration-300 shadow-inner"
                />
                <Search className="w-3.5 h-3.5 text-[#FF8533] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>

              {/* Tickets pill */}
              <Link
                to="/my-bookings"
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-[#181512] hover:bg-[#FF6B00]/20 border border-[#FF6B00]/30 transition shadow-sm"
              >
                <Ticket className="w-3.5 h-3.5 text-[#FF8533]" />
                <span>Tickets</span>
              </Link>

              {/* Authentication: User Profile or Sign In Link */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#181512] border border-[#FF6B00]/40 text-xs font-semibold text-[#fdfbf7] hover:border-[#FF6B00] transition"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white flex items-center justify-center text-[10px] font-bold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span>{user.name.split(' ')[0]}</span>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 pass-panel rounded-2xl p-2 border border-[#FF6B00]/40 shadow-2xl z-50 animate-fadeIn bg-[#181512]">
                      <div className="px-3 py-2 border-b border-[#FF6B00]/20 text-xs">
                        <div className="font-bold text-white">{user.name}</div>
                        <div className="text-[10px] text-[#FFA066] truncate">{user.email}</div>
                      </div>
                      <Link
                        to="/my-bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs text-stone-300 hover:text-white hover:bg-[#FF6B00]/20 rounded-xl transition mt-1"
                      >
                        <Ticket className="w-3.5 h-3.5 text-[#FF8533]" />
                        <span>My Reservations</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-stone-300 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="px-4 py-1.5 rounded-full text-xs font-bold btn-pass-primary shadow-md hover:scale-105 transition-transform"
                >
                  Sign In / Register
                </Link>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/my-bookings"
                className="p-2 text-white hover:text-[#FFA066]"
                title="My Tickets"
              >
                <Ticket className="w-5 h-5 text-[#FF8533]" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-white hover:text-[#FFA066]"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#FF6B00]/20 bg-[#0C0A09]/95 px-5 py-5 space-y-3">
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                placeholder="Search films..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#181512] border border-[#FF6B00]/30 rounded-lg text-white"
              />
              <Search className="w-4 h-4 text-[#FF8533] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-stone-300 hover:text-[#FFA066]"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-2">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#FF6B00]/30 text-white text-xs font-semibold"
                >
                  Sign Out ({user.name})
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 rounded-lg btn-pass-primary text-center text-xs font-bold"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
