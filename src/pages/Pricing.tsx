import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Star, 
  Zap, 
  Crown,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Shield
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container relative max-w-screen-xl">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mx-auto w-fit">
              ⚡ Oferta especial de lançamento
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
              Escolha o plano ideal para 
              <span className="gradient-text"> seu negócio</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comece grátis e escale conforme seu negócio cresce. 
              Sem compromisso, sem taxas ocultas.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.featured ? 'ring-2 ring-primary shadow-2xl scale-105' : ''} card-gradient border-0 shadow-card hover:shadow-primary transition-all duration-300`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl mx-auto mb-4 ${
                    plan.featured ? 'bg-gradient-primary' : 'bg-muted'
                  }`}>
                    <plan.icon className={`h-8 w-8 ${plan.featured ? 'text-white' : 'text-foreground'}`} />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <CardDescription className="text-base mt-2">{plan.description}</CardDescription>
                  
                  <div className="pt-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground ml-1">{plan.period}</span>}
                    </div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through mt-1">
                        De {plan.originalPrice}
                      </div>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="pt-6">
                    {plan.featured ? (
                      <Link to="/register" className="block">
                        <HeroButton className="w-full">
                          {plan.buttonText}
                        </HeroButton>
                      </Link>
                    ) : (
                      <Link to="/register" className="block">
                        <Button variant="outline" className="w-full">
                          {plan.buttonText}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-screen-xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tire suas dúvidas sobre os planos e funcionalidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="card-gradient border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-10"></div>
        <div className="container relative max-w-screen-xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para revolucionar seu negócio?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Comece seu teste gratuito agora e veja como o Clienio pode transformar sua gestão
          </p>
          <Link to="/register">
            <HeroButton size="xl" className="mb-4">
              Começar Teste Gratuito
            </HeroButton>
          </Link>
          <p className="text-sm text-muted-foreground">
            ✅ 30 dias grátis • ✅ Sem cartão • ✅ Cancele quando quiser
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const plans = [
  {
    name: "Gratuito",
    description: "Para começar e testar",
    price: "R$ 0",
    period: "/mês",
    icon: Zap,
    featured: false,
    buttonText: "Começar Grátis",
    features: [
      "Até 50 agendamentos/mês",
      "1 profissional",
      "Agenda online básica",
      "Cadastro de clientes",
      "Suporte por email",
      "Relatórios básicos"
    ]
  },
  {
    name: "Profissional",
    description: "Para negócios em crescimento",
    price: "R$ 29",
    originalPrice: "R$ 49",
    period: "/mês",
    icon: Users,
    featured: true,
    buttonText: "Escolher Profissional",
    features: [
      "Agendamentos ilimitados",
      "Até 3 profissionais",
      "WhatsApp automático",
      "Pagamentos via Pix",
      "Link personalizado",
      "Relatórios avançados",
      "Histórico completo",
      "Suporte prioritário",
      "Backup automático"
    ]
  },
  {
    name: "Enterprise",
    description: "Para grandes operações",
    price: "R$ 79",
    originalPrice: "R$ 129",
    period: "/mês",
    icon: Crown,
    featured: false,
    buttonText: "Escolher Enterprise",
    features: [
      "Tudo do Profissional",
      "Profissionais ilimitados",
      "API personalizada",
      "Integrações avançadas",
      "Relatórios customizados",
      "Suporte 24/7",
      "Gerente de conta dedicado",
      "Treinamento incluído",
      "SLA garantido"
    ]
  }
];

const faqs = [
  {
    question: "Posso cancelar a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento ou multas."
  },
  {
    question: "Como funciona o teste gratuito?",
    answer: "Você tem 30 dias para testar todas as funcionalidades do plano Profissional sem precisar inserir cartão de crédito."
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não! O Clienio foi desenvolvido para ser simples e intuitivo. Você configura tudo em poucos minutos."
  },
  {
    question: "Os dados ficam seguros?",
    answer: "Sim! Usamos criptografia de nível bancário e fazemos backup automático de todos os seus dados."
  },
  {
    question: "Posso mudar de plano depois?",
    answer: "Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento."
  },
  {
    question: "Como funciona o WhatsApp automático?",
    answer: "Enviamos lembretes automáticos para seus clientes via WhatsApp, reduzindo faltas em até 90%."
  }
];

export default Pricing;