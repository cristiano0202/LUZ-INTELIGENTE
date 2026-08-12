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
