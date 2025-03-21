
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpenText, 
  User, 
  Search, 
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-spring py-4 px-6',
        scrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-subtle' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <BookOpenText className="h-6 w-6 text-primary" />
          <span className="font-semibold text-xl tracking-tight">Biblios</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <NavLink to="/" current={location.pathname === "/"}>
            Home
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/dashboard" current={location.pathname === "/dashboard"}>
              My Books
            </NavLink>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-10 w-10 overflow-hidden"
                >
                  <User className="h-5 w-5" />
                </Button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white shadow-elevation rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                  <div className="px-4 py-2 text-sm text-muted-foreground border-b">
                    Signed in as <span className="font-medium text-foreground">{user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center px-4 py-2 text-sm hover:bg-secondary transition-colors duration-150"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex space-x-3">
              <Link to="/auth">
                <Button variant="outline" size="sm" className="font-medium">
                  Log in
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button size="sm" className="font-medium">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink: React.FC<{ 
  to: string;
  current: boolean;
  children: React.ReactNode;
}> = ({ to, current, children }) => {
  return (
    <Link
      to={to}
      className={cn(
        'relative px-1 py-2 text-sm font-medium transition-colors duration-200',
        current ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
      )}
    >
      {children}
      {current && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full animate-fade-in" />
      )}
    </Link>
  );
};

export default Navbar;
