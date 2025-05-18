import React, { useState } from 'react';
import { Search,  Menu } from 'lucide-react';
import { MdOutlineOndemandVideo  } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';
import Button from './ui/Button';


interface NavbarProps {
  onSearch: (query: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="sticky top-0 z-10 bg-black bg-opacity-95 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <MdOutlineOndemandVideo size={28} className="text-primary mr-2" />
              <span className="text-white font-bold text-xl">NewTube</span>
            </div>
          </div>


          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-gray-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <IoMdCloseCircle size={18} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-black rounded-full p-1.5"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open menu"
              className="p-1"
            >
              <Menu size={24} />
            </Button>
          </div>
        </div>

        {/* Mobile Search (Always visible) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary border border-gray-700 text-white px-4 py-2 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <IoMdCloseCircle size={18} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-black rounded-full p-1.5"
            >
              <Search size={16} />
            </button>
          </form>
        </div>

        {/* Mobile Menu (Conditional) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card rounded-lg mt-2 p-4 shadow-lg">
            <nav className="grid gap-2">
              <a href="#" className="text-white hover:bg-gray-800 px-3 py-2 rounded-md">Home</a>
              <a href="#trending" className="text-white hover:bg-gray-800 px-3 py-2 rounded-md">Trending</a>
              <a href="#music" className="text-white hover:bg-gray-800 px-3 py-2 rounded-md">Music</a>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;