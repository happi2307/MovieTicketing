
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from "@/components/ui/use-toast";

const Navbar = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 px-4 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center">
            <span className="text-primary font-bold text-2xl mr-1">Flick</span>
            <span className="text-foreground font-bold text-2xl">Find</span>
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/movies" className="text-foreground hover:text-primary transition-colors">
              Movies
            </Link>
            <Link to="/theaters" className="text-foreground hover:text-primary transition-colors">
              Theaters
            </Link>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search movies..." 
              className="px-4 py-1 pr-8 bg-muted text-foreground rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>
          
          <Button variant="ghost" size="icon">
            <User className="w-5 h-5" />
          </Button>
          
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                <Link to="/" className="text-foreground hover:text-primary transition-colors px-2 py-2">
                  Home
                </Link>
                <Link to="/movies" className="text-foreground hover:text-primary transition-colors px-2 py-2">
                  Movies
                </Link>
                <Link to="/theaters" className="text-foreground hover:text-primary transition-colors px-2 py-2">
                  Theaters
                </Link>
                <div className="relative mt-4">
                  <input 
                    type="text" 
                    placeholder="Search movies..." 
                    className="px-4 py-2 pr-8 bg-muted text-foreground rounded-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>
                <Button onClick={handleLogout} className="mt-4 flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
