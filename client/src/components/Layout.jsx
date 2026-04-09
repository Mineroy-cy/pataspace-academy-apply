import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Tracks', path: '/#tracks' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'About', path: '/#about' },
    { name: 'Pricing', path: '/#pricing' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center">
            <span className="font-heading text-2xl font-bold text-white tracking-tight">
              Pata<span className="text-brand-mint">Space</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-white/70 hover:text-white transition-colors font-sans text-sm"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/apply"
              className="bg-brand-mint hover:bg-brand-mint/90 text-brand-dark font-bold px-6 py-2.5 rounded-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              className="text-white/70 hover:text-white"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 rounded-md font-sans"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/apply"
              onClick={() => setIsOpen(false)}
              className="block mt-4 text-center bg-brand-mint text-brand-dark font-bold px-4 py-3 rounded-lg mx-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mint focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
            >
              Apply Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-brand-dark py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <span className="font-heading text-2xl font-bold text-white tracking-tight mb-4">
          Pata<span className="text-brand-teal">Space</span> Academy
        </span>
        <p className="text-brand-gold italic mb-8">
          "Write the vision, make it plain." – Hab 2:2
        </p>
        
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {['Tracks', 'How It Works', 'About', 'Pricing', 'Apply'].map((name) => (
            <Link
              key={name}
              to={name === 'Apply' ? '/apply' : `/#${name.toLowerCase().replace(/ /g, '-')}`}
              className="text-white/50 hover:text-brand-mint font-sans text-sm transition-colors"
            >
              {name}
            </Link>
          ))}
        </div>
        
        <div className="text-white/40 text-sm font-sans space-y-2">
          <p>© 2026 PataSpace Academy · Kutus, Kirinyaga · pataspace.co.ke</p>
          <p>Building the builders 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
};

const Layout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace('#', '');

    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(hash);

    if (element) {
      window.requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
