import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, DollarSign, User, Phone, Calendar as CalendarIcon, CheckCircle, Copy } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

interface Profile {
  full_name: string;
  business_name: string;
  business_type: string;
  pix_key: string;
}

interface AvailableSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
}

interface Appointment {
  appointment_date: string;
  appointment_time: string;
}

const Booking = () => {
  const { publicLink } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [professionalId, setProfessionalId] = useState<string>("");
  
  // Booking flow state
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [clientData, setClientData] = useState({
    name: "",
    phone: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [pixKey, setPixKey] = useState<string>("");

  useEffect(() => {
    loadProfessionalData();
  }, [publicLink]);

  useEffect(() => {
    if (professionalId) {
      loadAvailableSlots();
      loadExistingAppointments();
    }
  }, [professionalId]);

  const loadProfessionalData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("public_link", publicLink)
        .single();

      if (profileError) throw profileError;
      
      setProfile(profileData);
      setProfessionalId(profileData.id);
      setPixKey(profileData.pix_key || "");

      const { data: servicesData, error: servicesError } = await supabase
        .from("services")
        .select("*")
        .eq("professional_id", profileData.id)
        .order("name");

      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Profissional não encontrado");
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("professional_id", professionalId)
        .eq("is_active", true);

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
    }
  };

  const loadExistingAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from("appointments")
        .select("appointment_date, appointment_time")
        .eq("professional_id", professionalId)
        .eq("status", "scheduled");

      if (error) throw error;
      setExistingAppointments(data || []);
    } catch (error) {
      console.error("Erro ao carregar agendamentos:", error);
    }
  };

  const getAvailableTimesForDate = (date: Date) => {
    const dayOfWeek = date.getDay();
    const slotsForDay = availableSlots.filter(slot => slot.day_of_week === dayOfWeek);
    
    const times: string[] = [];
    slotsForDay.forEach(slot => {
      const [startHour, startMinute] = slot.start_time.split(':').map(Number);
      const [endHour, endMinute] = slot.end_time.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMinute = startMinute;
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}:00`;
        
        // Check if time is already booked
        const isBooked = existingAppointments.some(apt => 
          apt.appointment_date === format(date, 'yyyy-MM-dd') && 
          apt.appointment_time === timeString
        );
        
        if (!isBooked) {
          times.push(timeString);
        }
        
        // Add service duration
        if (selectedService) {
          currentMinute += selectedService.duration_minutes;
          if (currentMinute >= 60) {
            currentHour += Math.floor(currentMinute / 60);
            currentMinute = currentMinute % 60;
          }
        }
      }
    });
    
    return times;
  };

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !clientData.name || !clientData.phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .insert([{
          professional_id: professionalId,
          service_id: selectedService.id,
          appointment_date: format(selectedDate, 'yyyy-MM-dd'),
          appointment_time: selectedTime,
          client_name: clientData.name,
          client_phone: clientData.phone,
          price: selectedService.price,
          status: 'scheduled'
        }]);

      if (error) throw error;
      
      setBookingComplete(true);
      toast.success("Agendamento realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar:", error);
      toast.error("Erro ao realizar agendamento");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertDescription>Profissional não encontrado</AlertDescription>
        </Alert>
      </div>
    );
  }

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    toast.success("Chave PIX copiada!");
  };

  if (bookingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-accent/10">
        <Card className="max-w-md w-full card-gradient border-0 shadow-card">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Agendamento Confirmado!</CardTitle>
            <CardDescription>
              Seu agendamento foi realizado com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-accent/5 rounded-lg space-y-2">
              <p className="text-sm"><strong>Serviço:</strong> {selectedService?.name}</p>
              <p className="text-sm"><strong>Data:</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</p>
              <p className="text-sm"><strong>Horário:</strong> {selectedTime?.slice(0, 5)}</p>
              <p className="text-sm"><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2)}</p>
            </div>

            {pixKey && (
              <Alert className="bg-primary/5 border-primary/20">
                <AlertDescription className="space-y-3">
                  <p className="font-semibold text-sm">Informações de Pagamento - PIX</p>
                  <div className="space-y-2">
                    <p className="text-sm">Chave PIX:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-background rounded text-sm break-all">
                        {pixKey}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copyPixKey}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Após realizar o pagamento, seu agendamento será confirmado pelo profissional.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground text-center">
              {pixKey ? "Realize o pagamento para confirmar seu agendamento" : "Em breve você receberá uma confirmação"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-accent/10">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 card-gradient border-0 shadow-card">
          <CardHeader>
            <CardTitle className="text-2xl">{profile.business_name}</CardTitle>
            <CardDescription>
              {profile.business_type} - {profile.full_name}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <Card className="card-gradient border-0 shadow-card">
            <CardHeader>
              <CardTitle>Escolha o Serviço</CardTitle>
              <CardDescription>Selecione o serviço desejado</CardDescription>
            </CardHeader>
            <CardContent>
              {services.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    Nenhum serviço disponível no momento
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => {
                        setSelectedService(service);
                        setStep(2);
                      }}
                      className="p-4 border border-border rounded-lg hover:bg-accent/5 cursor-pointer smooth-transition"
                    >
                      <h4 className="font-medium">{service.name}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {service.duration_minutes} min
                        </span>
                        <span className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1" />
                          R$ {service.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Date and Time */}
        {step === 2 && selectedService && (
          <Card className="card-gradient border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Escolha Data e Horário</CardTitle>
                  <CardDescription>Serviço: {selectedService.name}</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Selecione a Data</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  locale={ptBR}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border mt-2"
                />
              </div>

              {selectedDate && (
                <div>
                  <Label>Horários Disponíveis</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {getAvailableTimesForDate(selectedDate).map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTime(time);
                          setStep(3);
                        }}
                        className="w-full"
                      >
                        {time.slice(0, 5)}
                      </Button>
                    ))}
                  </div>
                  {getAvailableTimesForDate(selectedDate).length === 0 && (
                    <Alert className="mt-2">
                      <AlertDescription>
                        Nenhum horário disponível para esta data
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Client Information */}
        {step === 3 && (
          <Card className="card-gradient border-0 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Seus Dados</CardTitle>
                  <CardDescription>Preencha suas informações</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setStep(2)}>
                  Voltar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent/5 rounded-lg space-y-1">
                <p className="text-sm"><strong>Serviço:</strong> {selectedService?.name}</p>
                <p className="text-sm"><strong>Data:</strong> {selectedDate && format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</p>
                <p className="text-sm"><strong>Horário:</strong> {selectedTime?.slice(0, 5)}</p>
                <p className="text-sm"><strong>Valor:</strong> R$ {selectedService?.price.toFixed(2)}</p>
              </div>

              <div>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={clientData.name}
                  onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone/WhatsApp</Label>
                <Input
                  id="phone"
                  value={clientData.phone}
                  onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                  placeholder="(00) 00000-0000"
                  className="mt-1"
                />
              </div>

              <Button 
                onClick={handleSubmitBooking} 
                disabled={submitting || !clientData.name || !clientData.phone}
                className="w-full"
              >
                {submitting ? "Agendando..." : "Confirmar Agendamento"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Booking;
