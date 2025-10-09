import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, User, Phone, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  client_name: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  price: number;
  notes?: string;
  service_id: string;
}

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
}

export function AppointmentsManager() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("professional_id", user.id);

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("professional_id", user.id)
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar agendamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Status atualizado",
        description: `Agendamento ${status === "confirmed" ? "confirmado" : "cancelado"} com sucesso.`,
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    return service?.name || "Serviço não encontrado";
  };

  const handleConfirmPayment = async (id: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status: "confirmed" })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Pagamento confirmado",
        description: "Agendamento confirmado com sucesso.",
      });

      fetchAppointments();
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending_payment: { variant: "outline", label: "Aguardando Pagamento" },
      scheduled: { variant: "secondary", label: "Agendado" },
      confirmed: { variant: "default", label: "Confirmado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
      completed: { variant: "outline", label: "Concluído" },
    };

    const config = variants[status] || variants.scheduled;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filterAppointments = (status?: string) => {
    if (!status) return appointments;
    return appointments.filter(apt => apt.status === status);
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card key={appointment.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-4 w-4" />
              {appointment.client_name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3" />
              {appointment.client_phone}
            </CardDescription>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>
            {format(new Date(appointment.appointment_date + 'T00:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{appointment.appointment_time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span>R$ {appointment.price?.toFixed(2)}</span>
        </div>
        <div className="text-sm">
          <strong>Serviço:</strong> {getServiceName(appointment.service_id)}
        </div>
        {appointment.notes && (
          <div className="text-sm">
            <strong>Observações:</strong> {appointment.notes}
          </div>
        )}
        {appointment.status === "pending_payment" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => handleConfirmPayment(appointment.id)}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirmar Pagamento
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateStatus(appointment.id, "cancelled")}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
        {appointment.status === "scheduled" && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => updateStatus(appointment.id, "confirmed")}
              className="flex-1"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Confirmar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => updateStatus(appointment.id, "cancelled")}
              className="flex-1"
            >
              <XCircle className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return <div className="text-center py-8">Carregando agendamentos...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Agendamentos</h2>
        <p className="text-muted-foreground">Gerencie os agendamentos dos seus clientes</p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({appointments.length})</TabsTrigger>
          <TabsTrigger value="pending_payment">
            Aguardando ({filterAppointments("pending_payment").length})
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Agendados ({filterAppointments("scheduled").length})
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            Confirmados ({filterAppointments("confirmed").length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelados ({filterAppointments("cancelled").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                Nenhum agendamento encontrado
              </CardContent>
            </Card>
          ) : (
            appointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending_payment" className="space-y-4">
          {filterAppointments("pending_payment").map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          {filterAppointments("scheduled").map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {filterAppointments("confirmed").map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {filterAppointments("cancelled").map(appointment => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}