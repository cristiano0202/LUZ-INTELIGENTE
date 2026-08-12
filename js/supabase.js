<!-- js/supabase.js -->
<script>
  // ==========================================================
  // CONFIGURAÇÃO DO SUPABASE
  // Substitua os valores abaixo pelos do seu projeto Supabase:
  // Dashboard > Settings > API
  // ==========================================================

  const SUPABASE_URL = "https://hbdspdvlvrhrmbfxzqtxr.supabase.co";          // ← sua URL
const SUPABASE_ANON_KEY = "sb_publishable_rRWHHgieZVoNFDgGoJoACQ_OyzNAN5y";// ← sua ANON KEY

  if (SUPABASE_URL.includes("SEU-PROJETO") || SUPABASE_ANON_KEY.includes("SUA_ANON_KEY")) {
    console.warn("⚠️ Configure SUPABASE_URL e SUPABASE_ANON_KEY em js/supabase.js");
  }

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Helper global para pegar usuário autenticado
  async function getAuthUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  // Helper global para exigir autenticação (redireciona se não estiver logado)
  async function requireAuth(redirectUrl = "../html/login.html") {
    const user = await getAuthUser();
    if (!user) {
      window.location.href = redirectUrl;
      return null;
    }
    return user;
  }
</script>
