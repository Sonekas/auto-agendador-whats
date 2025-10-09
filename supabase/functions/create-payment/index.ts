import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { appointmentId, email } = await req.json();
    
    if (!appointmentId) throw new Error("ID do agendamento é obrigatório");
    if (!email) throw new Error("Email é obrigatório");

    // Buscar dados do agendamento
    const { data: appointment, error: appointmentError } = await supabaseClient
      .from("appointments")
      .select("*, services(*)")
      .eq("id", appointmentId)
      .single();

    if (appointmentError) throw appointmentError;
    if (!appointment) throw new Error("Agendamento não encontrado");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Verificar se cliente já existe
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [
        {
          price_data: {
            currency: "brl",
            unit_amount: Math.round(Number(appointment.price) * 100), // Converter para centavos
            product_data: {
              name: appointment.services?.name || "Serviço",
              description: `Agendamento em ${new Date(appointment.appointment_date).toLocaleDateString('pt-BR')} às ${appointment.appointment_time}`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/booking/${appointment.professional_id}?payment=success&appointment=${appointmentId}`,
      cancel_url: `${req.headers.get("origin")}/booking/${appointment.professional_id}?payment=cancelled`,
      metadata: {
        appointment_id: appointmentId,
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
