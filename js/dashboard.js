// js/dashboard.js

(async function initDashboard() {
  const loadingEl = document.getElementById("dashboard-loading");
  const errorEl = document.getElementById("dashboard-error");
  const contentEl = document.getElementById("dashboard-content");
  const userNameEl = document.getElementById("dashboard-user-name");
  const userEmailEl = document.getElementById("dashboard-email");
  const logoutButton = document.getElementById("logout-button");

  function showError(message) {
    if (loadingEl) loadingEl.classList.add("hidden");
    if (contentEl) contentEl.classList.add("hidden");

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
  }

  if (!window.supabaseClient) {
    showError("Supabase não inicializado. Verifique o arquivo js/supabase.js.");
    return;
  }

  try {
    const {
      data: { session },
      error: sessionError,
    } = await window.supabaseClient.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    // Se não houver sessão, o usuário volta para o login.
    if (!session) {
      window.location.href = "login.html";
      return;
    }

    const user = session.user;

    if (userEmailEl) {
      userEmailEl.textContent = user.email || "";
    }

    // Busca o perfil do usuário na tabela profiles.
    const {
      data: profile,
      error: profileError,
    } = await window.supabaseClient
      .from("profiles")
      .select("full_name, email")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      throw profileError;
    }

    const displayName =
      profile?.full_name ||
      user.user_metadata?.full_name ||
      user.email ||
      "Usuário";

    if (userNameEl) {
      userNameEl.textContent = displayName;
    }

    if (loadingEl) loadingEl.classList.add("hidden");
    if (contentEl) contentEl.classList.remove("hidden");
  } catch (error) {
    console.error(error);
    showError(error.message || "Não foi possível carregar o dashboard.");
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      logoutButton.disabled = true;
      logoutButton.textContent = "Saindo...";

      await window.supabaseClient.auth.signOut();

      window.location.href = "login.html";
    });
  }
})();
