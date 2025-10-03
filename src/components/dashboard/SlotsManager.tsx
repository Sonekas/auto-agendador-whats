import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";

interface Slot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_active: boolean;
}

const weekDays = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" }
];

export const SlotsManager = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    day_of_week: "",
    start_time: "",
    end_time: ""
  });

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("professional_id", user.id)
        .order("day_of_week")
        .order("start_time");

      if (error) throw error;
      setSlots(data || []);
    } catch (error) {
      console.error("Erro ao carregar horários:", error);
      toast.error("Erro ao carregar horários");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("available_slots")
        .insert([{
          day_of_week: parseInt(formData.day_of_week),
          start_time: formData.start_time,
          end_time: formData.end_time,
          professional_id: user.id,
          is_active: true
        }]);

      if (error) throw error;
      
      toast.success("Horário adicionado com sucesso!");
      setDialogOpen(false);
      resetForm();
      loadSlots();
    } catch (error) {
      console.error("Erro ao salvar horário:", error);
      toast.error("Erro ao salvar horário");
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("available_slots")
        .update({ is_active: !currentStatus })
        .eq("id", id);

      if (error) throw error;
      
      toast.success(currentStatus ? "Horário desativado" : "Horário ativado");
      loadSlots();
    } catch (error) {
      console.error("Erro ao atualizar horário:", error);
      toast.error("Erro ao atualizar horário");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este horário?")) return;

    try {
      const { error } = await supabase
        .from("available_slots")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Horário excluído com sucesso!");
      loadSlots();
    } catch (error) {
      console.error("Erro ao excluir horário:", error);
      toast.error("Erro ao excluir horário");
    }
  };

  const resetForm = () => {
    setFormData({
      day_of_week: "",
      start_time: "",
      end_time: ""
    });
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, Slot[]>);

  if (loading) {
    return <p className="text-muted-foreground">Carregando horários...</p>;
  }

  return (
    <Card className="card-gradient border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Horários Disponíveis</CardTitle>
            <CardDescription>Configure seus horários de atendimento</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Horário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Horário</DialogTitle>
                <DialogDescription>
                  Defina um novo horário disponível para agendamentos
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="day">Dia da Semana</Label>
                  <Select
                    value={formData.day_of_week}
                    onValueChange={(value) => setFormData({ ...formData, day_of_week: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o dia" />
                    </SelectTrigger>
                    <SelectContent>
                      {weekDays.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="start_time">Horário Inicial</Label>
                  <input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">Horário Final</Label>
                  <input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Adicionar Horário
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {slots.length === 0 ? (
          <Alert>
            <AlertDescription>
              Você ainda não configurou seus horários. Clique em "Novo Horário" para começar.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {weekDays.map((day) => {
              const daySlots = groupedSlots[day.value];
              if (!daySlots || daySlots.length === 0) return null;

              return (
                <div key={day.value} className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {day.label}
                  </div>
                  <div className="space-y-2 ml-6">
                    {daySlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={slot.is_active}
                              onCheckedChange={() => handleToggleActive(slot.id, slot.is_active)}
                            />
                            <span className="text-xs text-muted-foreground">
                              {slot.is_active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(slot.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
