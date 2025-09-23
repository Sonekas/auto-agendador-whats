import { HeroButton } from "@/components/ui/hero-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Users, 
  Smartphone,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container relative max-w-screen-xl">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mx-auto w-fit">
              ✨ Novo: Integração com WhatsApp
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
              Gestão completa para 
              <span className="gradient-text"> profissionais autônomos</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Agenda online, pagamentos por Pix, lembretes no WhatsApp e muito mais. 
              Tudo em uma plataforma simples e eficiente.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register">
                <HeroButton size="xl" className="w-full sm:w-auto">
                  Começar Grátis
                </HeroButton>
              </Link>
              <Link to="/demo">
                <HeroButton variant="hero-outline" size="xl" className="w-full sm:w-auto">
                  Ver Demo
                </HeroButton>
              </Link>
            </div>
            
            <p className="text-sm text-muted-foreground">
              ✅ Grátis por 30 dias • ✅ Sem cartão de crédito • ✅ Suporte incluso
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-screen-xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Funcionalidades pensadas especificamente para profissionais autônomos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient border-0 shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container max-w-screen-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">
                Profissionais que já usam cresceram
                <span className="gradient-text"> 3x mais rápido</span>
              </h2>
              
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/10 mt-1">
                      <CheckCircle className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-success/5 border-success/20">
                <TrendingUp className="h-8 w-8 text-success mx-auto mb-4" />
                <div className="text-2xl font-bold text-success">+150%</div>
                <p className="text-sm text-muted-foreground">Aumento nas vendas</p>
              </Card>
              <Card className="p-6 text-center bg-primary/5 border-primary/20">
                <Clock className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-2xl font-bold text-primary">-80%</div>
                <p className="text-sm text-muted-foreground">Menos tempo perdido</p>
              </Card>
              <Card className="p-6 text-center bg-accent/5 border-accent/20">
                <Users className="h-8 w-8 text-accent mx-auto mb-4" />
                <div className="text-2xl font-bold text-accent">+300%</div>
                <p className="text-sm text-muted-foreground">Novos clientes</p>
              </Card>
              <Card className="p-6 text-center bg-warning/5 border-warning/20">
                <DollarSign className="h-8 w-8 text-warning mx-auto mb-4" />
                <div className="text-2xl font-bold text-warning">+200%</div>
                <p className="text-sm text-muted-foreground">Faturamento</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container relative max-w-screen-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para crescer seu negócio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de profissionais que já transformaram sua gestão com o GestãoPro
          </p>
          <Link to="/register">
            <HeroButton size="xl" className="mb-4">
              Começar Agora - É Grátis
            </HeroButton>
          </Link>
          <p className="text-sm text-muted-foreground">
            Configure em menos de 5 minutos
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const features = [
  {
    icon: Calendar,
    title: "Agenda Online",
    description: "Seus clientes agendam diretamente pelo seu link personalizado, 24h por dia."
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Automático",
    description: "Lembretes automáticos enviados no WhatsApp. Reduza faltas em até 90%."
  },
  {
    icon: DollarSign,
    title: "Pagamento via Pix",
    description: "Gere cobranças por Pix instantaneamente e receba na hora."
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cadastro completo e histórico de atendimentos de cada cliente."
  },
  {
    icon: Smartphone,
    title: "Link Público",
    description: "Compartilhe seu link de agendamento nas redes sociais e bio do Instagram."
  },
  {
    icon: TrendingUp,
    title: "Relatórios",
    description: "Acompanhe seu faturamento e quantidade de atendimentos mensais."
  }
];

const benefits = [
  {
    title: "Nunca mais perca clientes por falta de organização",
    description: "Sistema inteligente que gerencia toda sua agenda automaticamente."
  },
  {
    title: "Receba pagamentos na hora",
    description: "Integração com Pix para pagamentos instantâneos e seguros."
  },
  {
    title: "Profissionalize seu atendimento",
    description: "Lembretes automáticos no WhatsApp mostram profissionalismo aos clientes."
  },
  {
    title: "Foque no que realmente importa",
    description: "Automatize a gestão e dedique mais tempo ao seu trabalho."
  }
];

export default Landing;