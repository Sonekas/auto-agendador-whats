import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeroButton } from "@/components/ui/hero-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock,
  Plus,
  Share2,
  QrCode,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  LogOut,
  Briefcase,
  CalendarClock
} from "lucide-react";
import { ServicesManager } from "@/components/dashboard/ServicesManager";
import { SlotsManager } from "@/components/dashboard/SlotsManager";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentMonth] = useState("Dezembro 2024");

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/login");
        return;
      }
      
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout realizado com sucesso!");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Dados mockados - serão substituídos pelos dados do Supabase
  const stats = {
    monthlyAppointments: 48,
    monthlyRevenue: 2400,
    todayAppointments: 6,
    totalClients: 127
  };

  const recentAppointments = [
    { id: 1, client: "Maria Silva", service: "Manicure", time: "14:00", status: "confirmed" },
    { id: 2, client: "Ana Costa", service: "Pedicure", time: "15:30", status: "pending" },
    { id: 3, client: "João Santos", service: "Corte", time: "16:00", status: "confirmed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold gradient-text">Clienio</h1>
              <p className="text-muted-foreground">
                Bem-vindo, {user?.user_metadata?.full_name || "Profissional"}!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Link
              </Button>
              <HeroButton size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </HeroButton>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-gradient border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.todayAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +2 desde ontem
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos {currentMonth}</CardTitle>
              <Calendar className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monthlyAppointments}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento {currentMonth}</CardTitle>
              <DollarSign className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +18% em relação ao mês passado
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-0 shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClients}</div>
              <p className="text-xs text-muted-foreground">
                +8 novos este mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto">
            <TabsTrigger value="overview">
              <TrendingUp className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="services">
              <Briefcase className="h-4 w-4 mr-2" />
              Serviços
            </TabsTrigger>
            <TabsTrigger value="schedule">
              <CalendarClock className="h-4 w-4 mr-2" />
              Horários
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Appointments Today */}
              <div className="lg:col-span-2">
                <Card className="card-gradient border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Agendamentos de Hoje
                    </CardTitle>
                    <CardDescription>
                      Seus próximos atendimentos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{appointment.client}</p>
                              <p className="text-sm text-muted-foreground">{appointment.service}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium">{appointment.time}</span>
                            <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"}>
                              {appointment.status === "confirmed" ? "Confirmado" : "Pendente"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="card-gradient border-0 shadow-card">
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <QrCode className="h-4 w-4 mr-2" />
                      QR Code da Agenda
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Enviar Lembretes
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Ver Relatórios
                    </Button>
                  </CardContent>
                </Card>

                {/* WhatsApp Integration Status */}
                <Card className="card-gradient border-0 shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      WhatsApp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span className="text-sm text-muted-foreground">Não configurado</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Configurar WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <ServicesManager />
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <SlotsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;