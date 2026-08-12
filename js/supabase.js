const SUPABASE_URL = "https://hbdspdlvrhrmbfxzqtxr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_rRWHHgieZVoNFDgGoJoACQ_OyzNAN5y";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

async function getAuthUser() {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

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

window.supabaseClient = supabaseClient;
window.getAuthUser = getAuthUser;
window.requireAuth = requireAuth;
