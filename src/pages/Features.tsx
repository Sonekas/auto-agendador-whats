import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroButton } from "@/components/ui/hero-button";
import { 
  Calendar, 
  MessageSquare, 
  DollarSign, 
  Users, 
  Smartphone,
  TrendingUp,
  Clock,
  Shield,
  Zap,
  Bell,
  CreditCard,
  BarChart3,
  Link as LinkIcon,
  CheckCircle,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container relative max-w-screen-xl">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mx-auto w-fit">
              🚀 Tecnologia inovadora
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
              Funcionalidades que 
              <span className="gradient-text"> revolucionam</span> sua gestão
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra todas as ferramentas que farão você economizar tempo, 
              aumentar vendas e profissionalizar seu atendimento.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20">
        <div className="container max-w-screen-xl">
          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <Badge variant="outline" className="w-fit">
                    <feature.badge.icon className="w-4 h-4 mr-2" />
                    {feature.badge.text}
                  </Badge>
                  
                  <h2 className="text-3xl md:text-4xl font-bold">
                    {feature.title}
                  </h2>
                  
                  <p className="text-xl text-muted-foreground">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-success mr-3 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link to="/register">
                    <HeroButton>
                      Experimentar Agora
                    </HeroButton>
                  </Link>
                </div>
                
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <Card className="card-gradient border-0 shadow-card p-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-4">
                      {feature.highlights.map((highlight, highlightIndex) => (
                        <div key={highlightIndex} className="flex items-center space-x-3">
                          <Star className="h-5 w-5 text-primary" />
                          <span className="font-medium">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-screen-xl">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Todas as funcionalidades em detalhes
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para todas as suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((feature, index) => (
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
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-sm text-muted-foreground flex items-start">
                        <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
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
            Teste todas essas funcionalidades gratuitamente
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            30 dias de teste gratuito com acesso completo a todas as funcionalidades
          </p>
          <Link to="/register">
            <HeroButton size="xl" className="mb-4">
              Começar Teste Gratuito
            </HeroButton>
          </Link>
          <p className="text-sm text-muted-foreground">
            Configure em 5 minutos • Sem cartão de crédito • Suporte incluído
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const mainFeatures = [
  {
    icon: Calendar,
    badge: { icon: Zap, text: "Automatização" },
    title: "Agenda Online Inteligente",
    description: "Seus clientes agendam sozinhos, 24 horas por dia, através do seu link personalizado. Nunca mais perca vendas por estar ocupado.",
    benefits: [
      "Link personalizado para compartilhar nas redes sociais",
      "Agenda sincronizada em tempo real",
      "Bloqueio automático de horários ocupados",
      "Configuração flexível de horários de trabalho"
    ],
    highlights: [
      "Agendamentos 24/7",
      "Zero conflitos",
      "Integração total"
    ]
  },
  {
    icon: MessageSquare,
    badge: { icon: Bell, text: "WhatsApp" },
    title: "Lembretes Automáticos no WhatsApp",
    description: "Reduza faltas em até 90% com lembretes inteligentes enviados automaticamente no WhatsApp dos seus clientes.",
    benefits: [
      "Lembrete 24h antes do agendamento",
      "Lembrete 2h antes do horário",
      "Confirmação automática de presença",
      "Mensagens personalizáveis"
    ],
    highlights: [
      "90% menos faltas",
      "Mensagens automáticas",
      "WhatsApp oficial"
    ]
  },
  {
    icon: DollarSign,
    badge: { icon: CreditCard, text: "Pagamentos" },
    title: "Pagamentos Via Pix Instantâneos",
    description: "Gere cobranças por Pix na hora e receba o pagamento instantaneamente. Acabou a correria para receber.",
    benefits: [
      "QR Code gerado automaticamente",
      "Link de pagamento por WhatsApp",
      "Confirmação automática de pagamento",
      "Controle total do fluxo de caixa"
    ],
    highlights: [
      "Pagamento na hora",
      "Zero complicação",
      "Controle total"
    ]
  }
];

const allFeatures = [
  {
    icon: Calendar,
    title: "Agenda Completa",
    description: "Gerencie todos os seus horários de forma inteligente",
    details: [
      "Visualização por dia, semana e mês",
      "Bloqueio de horários indisponíveis",
      "Reagendamentos automáticos",
      "Sincronização com Google Calendar"
    ]
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cadastro completo e histórico detalhado de cada cliente",
    details: [
      "Ficha completa do cliente",
      "Histórico de atendimentos",
      "Observações e preferências",
      "Aniversários e datas especiais"
    ]
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Acompanhe o crescimento do seu negócio",
    details: [
      "Faturamento mensal e anual",
      "Clientes mais frequentes",
      "Horários de maior demanda",
      "Análise de crescimento"
    ]
  },
  {
    icon: LinkIcon,
    title: "Link Personalizado",
    description: "Sua página de agendamento personalizada",
    details: [
      "Design com sua marca",
      "URL personalizada",
      "Compartilhamento fácil",
      "Bio do Instagram otimizada"
    ]
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Seus dados protegidos com segurança bancária",
    details: [
      "Criptografia de ponta a ponta",
      "Backup automático diário",
      "Acesso seguro via 2FA",
      "Conformidade com LGPD"
    ]
  },
  {
    icon: Clock,
    title: "Economia de Tempo",
    description: "Automatize tarefas repetitivas",
    details: [
      "Confirmações automáticas",
      "Reagendamentos inteligentes",
      "Lembretes programados",
      "Relatórios instantâneos"
    ]
  }
];

export default Features;