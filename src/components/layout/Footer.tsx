import { Calendar, Instagram, Facebook, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="container py-12 max-w-screen-xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">GestãoPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A plataforma completa para gestão de autônomos e profissionais liberais.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Produto</h3>
            <nav className="space-y-2">
              <Link to="/features" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </Link>
              <Link to="/pricing" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </Link>
              <Link to="/demo" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Suporte</h3>
            <nav className="space-y-2">
              <Link to="/help" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Central de Ajuda
              </Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contato
              </Link>
              <Link to="/terms" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Termos de Uso
              </Link>
              <Link to="/privacy" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacidade
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Conecte-se</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 GestãoPro. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;