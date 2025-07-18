import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery.trim());
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const genres = [
    'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama',
    'Family', 'Fantasy', 'Horror', 'Music', 'Mystery', 'Romance',
    'Science Fiction', 'Thriller', 'War', 'Western'
  ];

  const categories = [
    'Bollywood', 'Hollywood', 'Tollywood', 'Kollywood', 'Mollywood', 'Sandalwood', 'Anime', 'Not for all age'
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
             <img src="/images/pop.png" alt="My Logo" className="h-6 w-6" />
            <span className="font-bold text-xl hidden sm:block">CineCrave</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            
            {/* Genres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Genres <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {genres.map((genre) => (
                  <DropdownMenuItem key={genre} asChild>
                    <Link to={`/genre/${genre.toLowerCase().replace(' ', '-')}`}>
                      {genre}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary font-medium">
                  Categories <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link to={category === 'Not for all age' ? '/not-for-all-age' : `/category/${category.toLowerCase()}`}>
                      {category}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 bg-muted/50 border-muted focus:border-primary"
              />
            </div>
            <Button type="submit" variant="default" size="sm">
              Search
            </Button>
          </form>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-muted focus:border-primary"
                />
              </div>
              <Button type="submit" variant="default" size="sm">
                Search
              </Button>
            </form>

            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="border-t border-border my-2"></div>
              
              <div className="text-sm font-semibold text-muted-foreground mb-2">Genres</div>
              {genres.slice(0, 6).map((genre) => (
                <Link
                  key={genre}
                  to={`/genre/${genre.toLowerCase().replace(' ', '-')}`}
                  className="text-foreground hover:text-primary transition-colors text-sm py-1 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {genre}
                </Link>
              ))}
              
              <div className="text-sm font-semibold text-muted-foreground mb-2 mt-4">Categories</div>
              {categories.map((category) => (
                <Link
                  key={category}
                  to={category === 'Not for all age' ? '/not-for-all-age' : `/category/${category.toLowerCase()}`}
                  className="text-foreground hover:text-primary transition-colors text-sm py-1 block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;