import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroButton } from "@/components/ui/hero-button";
import { Menu, X, Calendar, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">GestãoPro</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
            Funcionalidades
          </Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
            Preços
          </Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
            Contato
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link to="/register">
            <HeroButton size="sm">Começar Grátis</HeroButton>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container py-4 space-y-4">
            <Link to="/features" className="block text-sm font-medium hover:text-primary transition-colors">
              Funcionalidades
            </Link>
            <Link to="/pricing" className="block text-sm font-medium hover:text-primary transition-colors">
              Preços
            </Link>
            <Link to="/contact" className="block text-sm font-medium hover:text-primary transition-colors">
              Contato
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full">Entrar</Button>
              </Link>
              <Link to="/register" className="block">
                <HeroButton className="w-full">Começar Grátis</HeroButton>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;