const SUPABASE_URL = "https://hbdspdvlvrhrmbfxzqtxr.supabase.co";
const SUPABASE_ANON_KEY = "SUA_PUBLISHABLE_KEY_ATUAL";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function getAuthUser() {
  const {
    data: { user },
    error
  } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Erro ao buscar usuário:", error);
    return null;
  }

  return user;
}

async function requireAuth(redirectUrl = "login.html") {
  const user = await getAuthUser();

  if (!user) {
    window.location.href = redirectUrl;
    return null;
  }

  return user;
}

window.supabaseClient = supabaseClient;
window.getAuthUser = getAuthUser;
window.requireAuth = requireAuth;
