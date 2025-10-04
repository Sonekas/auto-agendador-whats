import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Save } from "lucide-react";

export function PaymentSettings() {
  const [pixKey, setPixKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("pix_key")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setPixKey(data?.pix_key || "");
    } catch (error: any) {
      toast({
        title: "Erro ao carregar configurações",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ pix_key: pixKey })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Configurações salvas",
        description: "Sua chave PIX foi atualizada com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações de Pagamento</h2>
        <p className="text-muted-foreground">Configure sua chave PIX para receber pagamentos</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Chave PIX
          </CardTitle>
          <CardDescription>
            Configure sua chave PIX para que os clientes possam pagar pelos agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pixKey">Chave PIX</Label>
              <Input
                id="pixKey"
                placeholder="Digite sua chave PIX (CPF, CNPJ, E-mail, Telefone ou Chave Aleatória)"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Esta chave será usada para gerar as informações de pagamento nos agendamentos
              </p>
            </div>

            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Configure sua chave PIX acima</p>
          <p>2. Quando um cliente fizer um agendamento, ele receberá as informações de pagamento</p>
          <p>3. O cliente poderá copiar sua chave PIX para fazer o pagamento</p>
          <p>4. Após receber o pagamento, você pode confirmar o agendamento manualmente</p>
        </CardContent>
      </Card>
    </div>
  );
}