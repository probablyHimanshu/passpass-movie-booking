import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PassPassLogo from './PassPassLogo';
import { Armchair, Tv, Headphones, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Armchair,
      title: 'Plush Ergonomic Seating',
      desc: 'Generous legroom, luxury materials, and panoramic sightlines across all auditorium rows.',
    },
    {
      icon: Tv,
      title: 'Precision Laser Projection',
      desc: 'High-contrast 4K optics delivering vivid chromatic clarity and lifelike imagery.',
    },
    {
      icon: Headphones,
      title: 'Spatial Immersive Audio',
      desc: 'Object-based multidimensional soundscapes designed for total cinematic focus.',
    },
    {
      icon: ShieldCheck,
      title: 'Instant Digital Access',
      desc: 'Atomic real-time seat reservation engine connected directly to MongoDB.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#f5eff9] flex flex-col justify-between page-transition">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <PassPassLogo className="h-12" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cinematic Simplicity
          </h1>
          <p className="text-sm text-stone-400 mt-3 leading-relaxed">
            Pass Pass delivers an atmospheric, intuitive movie seat reservation experience. Immersed in our warm cinematic amber aesthetic, your ticket is just two clicks away.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="pass-panel p-5 rounded-3xl border border-[#FF6B00]/20">
                <div className="w-10 h-10 rounded-2xl bg-[#FF6B00]/20 text-[#FF8533] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{f.title}</h3>
                <p className="text-xs text-stone-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="pass-panel rounded-3xl p-8 text-center max-w-xl mx-auto space-y-4 border border-[#FF6B00]/25">
          <h2 className="text-xl font-bold text-white">Experience Seamless Booking</h2>
          <p className="text-xs text-stone-400">
            Powered by React 18, Vite, Express, and MongoDB with atomic seat locking and instant QR generation.
          </p>
          <div>
            <button
              onClick={() => navigate('/setbook')}
              className="px-7 py-3 rounded-full btn-pass-primary font-bold text-xs shadow-xl transition hover:scale-105"
            >
              Reserve Seats
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
