const SUPABASE_URL = "https://orajkankyehwtyjexhlq.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_jLFxqTkqzgVe5SVwokzC6Q_dJPz_GBy";

window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function getAuthUser() {
  const {
    data: { session },
    error
  } = await window.supabaseClient.auth.getSession();

  if (error) {
    console.error("Erro ao verificar sessão:", error);
    return null;
  }

  return session?.user || null;
}

async function requireAuth(redirectUrl = "login.html") {
  const user = await getAuthUser();

  if (!user) {
    window.location.href = redirectUrl;
    return null;
  }

  return user;
}

window.getAuthUser = getAuthUser;
window.requireAuth = requireAuth;
// js/supabase.js

// Cole aqui a URL do seu projeto Supabase.
// Exemplo: https://xxxxxxxxxxxx.supabase.co
const SUPABASE_URL = "https://orajkankyehwtyjexhlq.supabase.co";

// Cole aqui a sua Publishable Key ou anon public key.
// Exemplo Publishable Key: sb_publishable_...
// Exemplo anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_jLFxqTkqzgVe5SVwokzC6Q_dJPz_GBy";

// Verifica se a biblioteca do Supabase foi carregada antes deste arquivo.
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  throw new Error(
    "Supabase JS não carregado. Adicione o script CDN do Supabase antes do js/supabase.js."
  );
}

// Cria o cliente Supabase que será usado pelo site.
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// Disponibiliza o cliente para as outras páginas/scripts.
window.supabaseClient = supabaseClient;
