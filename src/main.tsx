import { createRoot } from "react-dom/client";
import { supabase } from "@/integrations/supabase/client";
import App from "./App.tsx";
import "./index.css";

// Handle stale auth tokens gracefully - clear invalid sessions
supabase.auth.onAuthStateChange((event) => {
  if (event === 'TOKEN_REFRESHED') {
    console.log('Token refreshed successfully');
  }
  if (event === 'SIGNED_OUT') {
    // Clear any stale data
    console.log('User signed out');
  }
});

// Clear potentially corrupt session on load errors
supabase.auth.getSession().catch(() => {
  // If getSession fails, sign out to clear stale tokens
  supabase.auth.signOut();
});

createRoot(document.getElementById("root")!).render(<App />);
