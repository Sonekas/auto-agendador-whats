import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface Plan {
  name: string;
  price: number;
  priceId: string;
  productId: string;
  interval: string;
  discount: string | null;
  originalPrice?: number;
  totalPrice?: number;
}


const PLANS: Record<string, Plan> = {
  monthly: {
    name: "Plano Mensal",
    price: 49,
    priceId: "price_1SEX2FR5mYTKutcwKg3rajkp",
    productId: "prod_TAsnJWttAhG039",
    interval: "mês",
    discount: null,
  },
  semester: {
    name: "Plano Semestral",
    price: 44,
    originalPrice: 49,
    priceId: "price_1SEzWaR5mYTKutcww7zGemWv",
    productId: "prod_TBMFp6wXgVXgjs",
    interval: "6 meses",
    discount: "10% OFF",
    totalPrice: 264,
  },
  annual: {
    name: "Plano Anual",
    price: 39.17,
    originalPrice: 49,
    priceId: "price_1SEzWnR5mYTKutcw3yYcOBXz",
    productId: "prod_TBMFswLtsquYda",
    interval: "ano",
    discount: "20% OFF",
    totalPrice: 470,
  },
};

const Pricing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await checkSubscription();
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
    }
  };

  const handleSubscribe = async (priceId: string, planKey: string) => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/login");
      return;
    }

    try {
      setProcessingPlan(planKey);
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        setTimeout(() => checkSubscription(), 3000);
      }
    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      toast.error("Erro ao processar pagamento: " + error.message);
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error: any) {
      console.error("Erro ao abrir portal:", error);
      toast.error("Erro ao abrir portal de gerenciamento: " + error.message);
    }
  };

  const isCurrentPlan = (productId: string) => {
    return subscription?.subscribed && subscription?.product_id === productId;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">
              Escolha seu Plano
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gerencie seus agendamentos com facilidade. Escolha o plano ideal para o seu negócio.
            </p>
          </div>

          {user && subscription?.subscribed && (
            <div className="flex justify-center">
              <Button onClick={handleManageSubscription} variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Gerenciar Assinatura
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(PLANS).map(([key, plan]) => {
              const isCurrent = isCurrentPlan(plan.productId);
              
              return (
                <Card 
                  key={key} 
                  className={`relative ${isCurrent ? "border-primary shadow-lg" : ""} ${key === "semester" ? "border-accent" : ""}`}
                >
                  {plan.discount && (
                    <Badge className="absolute -top-3 right-6 bg-accent text-accent-foreground">
                      {plan.discount}
                    </Badge>
                  )}
                  {isCurrent && (
                    <Badge className="absolute -top-3 left-6 bg-primary">
                      Plano Atual
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">
                      Pagamento a cada {plan.interval}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        {plan.originalPrice && (
                          <span className="text-lg line-through text-muted-foreground">
                            R$ {plan.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-sm">R$</span>
                        <span className="text-4xl font-bold">{plan.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">/mês</span>
                      </div>
                      {plan.totalPrice && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Cobrança de R$ {plan.totalPrice.toFixed(2)} por {plan.interval}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm">Agendamentos ilimitados</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm">Gestão de clientes</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm">Página de agendamento</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm">Pagamentos via PIX</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-sm">Suporte prioritário</span>
                      </li>
                    </ul>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={() => handleSubscribe(plan.priceId, key)}
                      disabled={isCurrent || processingPlan === key || loading}
                      variant={key === "semester" ? "default" : "outline"}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      {isCurrent 
                        ? "Plano Atual" 
                        : processingPlan === key 
                        ? "Processando..." 
                        : "Assinar Agora"
                      }
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center space-y-4 pt-8">
            <p className="text-sm text-muted-foreground">
              Pagamentos processados de forma segura via Stripe
            </p>
            <p className="text-xs text-muted-foreground">
              Cancele a qualquer momento • Sem taxas ocultas
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;