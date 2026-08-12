const SUPABASE_URL = "https://hbdspdvlvrhrmbfxzqtxr.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_rRWHHgieZVoNFDgGoJoACQ_OyzNAN5y";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function getAuthUser() {
  const { data: { user } } = await supabase.auth.getUser();
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
