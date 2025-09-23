import { HeroButton } from "@/components/ui/hero-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  MapPin,
  Send,
  Shield,
  Headphones,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5"></div>
        <div className="container relative max-w-screen-xl">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="mx-auto w-fit">
              💬 Suporte especializado
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto leading-tight">
              Precisa de ajuda? 
              <span className="gradient-text"> Estamos aqui</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossa equipe especializada está pronta para ajudar você a crescer seu negócio. 
              Entre em contato e vamos conversar!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20">
        <div className="container max-w-screen-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="card-gradient border-0 shadow-card hover:shadow-primary transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{method.title}</CardTitle>
                  <CardDescription className="text-base">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="space-y-2">
                    <div className="font-medium text-primary">{method.contact}</div>
                    <div className="text-sm text-muted-foreground">{method.hours}</div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <Card className="card-gradient border-0 shadow-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Envie sua mensagem</CardTitle>
                  <CardDescription>
                    Preencha o formulário e retornaremos em até 2 horas úteis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input id="name" placeholder="Seu nome" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">WhatsApp</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" placeholder="Como podemos ajudar?" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Descreva como podemos ajudar você..."
                      className="min-h-32"
                    />
                  </div>
                  
                  <HeroButton className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </HeroButton>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    Responderemos em até 2 horas úteis
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  Por que escolher o Clienio?
                </h2>
                <div className="space-y-6">
                  {whyChoose.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 mt-1">
                        <reason.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{reason.title}</h3>
                        <p className="text-muted-foreground text-sm">{reason.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Headphones className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">Suporte Especializado</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nossa equipe tem experiência real no mercado de beleza e estética. 
                    Entendemos suas necessidades porque já estivemos no seu lugar.
                  </p>
                  <Link to="/register">
                    <Button variant="outline" className="w-full">
                      Conversar com Especialista
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
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
              Respostas rápidas para as dúvidas mais comuns
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
            Ainda tem dúvidas? Teste grátis!
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A melhor forma de conhecer o Clienio é testando. Comece agora mesmo!
          </p>
          <Link to="/register">
            <HeroButton size="xl" className="mb-4">
              Começar Teste Gratuito
            </HeroButton>
          </Link>
          <p className="text-sm text-muted-foreground">
            30 dias grátis • Setup em 5 minutos • Suporte incluído
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Resposta rápida e suporte personalizado",
    contact: "(11) 99999-9999",
    hours: "Seg-Sex: 8h às 18h",
    action: "Abrir WhatsApp"
  },
  {
    icon: Mail,
    title: "E-mail",
    description: "Para dúvidas detalhadas e suporte técnico",
    contact: "contato@clienio.com",
    hours: "Resposta em até 2h",
    action: "Enviar E-mail"
  },
  {
    icon: Phone,
    title: "Telefone",
    description: "Fale diretamente com nossos especialistas",
    contact: "(11) 3000-0000",
    hours: "Seg-Sex: 9h às 17h",
    action: "Ligar Agora"
  }
];

const whyChoose = [
  {
    icon: Zap,
    title: "Setup em 5 minutos",
    description: "Plataforma intuitiva que você configura sozinho, sem complicação."
  },
  {
    icon: Shield,
    title: "Dados seguros",
    description: "Criptografia bancária e backup automático para total tranquilidade."
  },
  {
    icon: Headphones,
    title: "Suporte humanizado",
    description: "Equipe brasileira que entende o seu negócio e suas necessidades."
  },
  {
    icon: Clock,
    title: "Resultados rápidos",
    description: "Clientes veem redução de 90% nas faltas logo na primeira semana."
  }
];

const faqs = [
  {
    question: "Quanto tempo leva para configurar?",
    answer: "Menos de 5 minutos! O sistema é super intuitivo e você pode começar a usar imediatamente."
  },
  {
    question: "Preciso de conhecimento técnico?",
    answer: "Não! O Clienio foi desenvolvido para ser simples. Se você usa WhatsApp, vai conseguir usar nossa plataforma."
  },
  {
    question: "Como funciona o suporte?",
    answer: "Temos suporte por WhatsApp, e-mail e telefone. Nossa equipe responde rapidamente e te ajuda com tudo."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim! Não há fidelidade ou multa. Você pode cancelar a qualquer momento com apenas um clique."
  },
  {
    question: "Os dados ficam seguros?",
    answer: "Absolutamente! Usamos criptografia de nível bancário e fazemos backup automático de tudo."
  },
  {
    question: "Funciona no celular?",
    answer: "Sim! O Clienio é totalmente responsivo e funciona perfeitamente em celulares, tablets e computadores."
  }
];

export default Contact;