import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Edit, Trash2, DollarSign, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Service {
  id: string;
  name: string;
  duration_minutes: number;
  price: number;
}

export const ServicesManager = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration_minutes: "",
    price: ""
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("professional_id", user.id)
        .order("name");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Erro ao carregar serviços:", error);
      toast.error("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const serviceData = {
        name: formData.name,
        duration_minutes: parseInt(formData.duration_minutes),
        price: parseFloat(formData.price),
        professional_id: user.id
      };

      if (editingService) {
        const { error } = await supabase
          .from("services")
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;
        toast.success("Serviço atualizado com sucesso!");
      } else {
        const { error } = await supabase
          .from("services")
          .insert([serviceData]);

        if (error) throw error;
        toast.success("Serviço criado com sucesso!");
      }

      setDialogOpen(false);
      resetForm();
      loadServices();
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      toast.error("Erro ao salvar serviço");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    try {
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Serviço excluído com sucesso!");
      loadServices();
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      toast.error("Erro ao excluir serviço");
    }
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      duration_minutes: service.duration_minutes.toString(),
      price: service.price.toString()
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      name: "",
      duration_minutes: "",
      price: ""
    });
  };

  if (loading) {
    return <p className="text-muted-foreground">Carregando serviços...</p>;
  }

  return (
    <Card className="card-gradient border-0 shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Meus Serviços</CardTitle>
            <CardDescription>Gerencie os serviços que você oferece</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingService ? "Editar Serviço" : "Novo Serviço"}
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados do serviço
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Serviço</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Corte de Cabelo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_minutes}
                    onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    placeholder="Ex: 30"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Ex: 50.00"
                    required
                    min="0"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingService ? "Atualizar" : "Criar"} Serviço
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {services.length === 0 ? (
          <Alert>
            <AlertDescription>
              Você ainda não cadastrou nenhum serviço. Clique em "Novo Serviço" para começar.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 smooth-transition"
              >
                <div className="flex-1">
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
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(service)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
