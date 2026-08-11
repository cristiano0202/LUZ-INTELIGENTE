(async () => {
  const user = await requireAuth('login.html');
  if (!user) return;

  // Exibe dados do usuário
  const fullName = user.user_metadata?.full_name || user.email.split('@')[0];
  document.getElementById('userName').textContent = fullName;
  document.getElementById('userNameHeader').textContent = fullName.split(' ')[0];
  document.getElementById('userEmail').textContent = user.email;

  // Logout
  document.getElementById('btnLogout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });

  // Menu mobile
  document.getElementById('btnMenu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('hidden');
    document.getElementById('sidebar').classList.toggle('fixed');
    document.getElementById('sidebar').classList.toggle('inset-0');
    document.getElementById('sidebar').classList.toggle('z-50');
  });

  // Busca cálculos
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  const calc = data || [];

  // Totais
  const consumoTotal = calc.reduce((s, c) => s + (Number(c.monthly_consumption) || 0), 0);
  const custoTotal = calc.reduce((s, c) => s + (Number(c.monthly_cost) || 0), 0);
  const economiaEstimada = custoTotal * 0.20;

  document.getElementById('cardKwh').innerHTML = `${consumoTotal.toFixed(1)} <span class="text-sm text-txt-sec">kWh</span>`;
  document.getElementById('cardCusto').textContent = `R$ ${custoTotal.toFixed(2).replace('.', ',')}`;
  document.getElementById('cardEconomia').textContent = `R$ ${economiaEstimada.toFixed(2).replace('.', ',')}`;
  document.getElementById('cardCount').textContent = calc.length;

  // Top consumidores
  const sorted = [...calc].sort((a, b) => Number(b.monthly_consumption) - Number(a.monthly_consumption)).slice(0, 5);
  const topList = document.getElementById('topList');
  if (sorted.length === 0) {
    topList.innerHTML = '<div class="text-txt-sec">Nenhum cálculo ainda. <a href="calculadora.html" class="text-energy underline">Adicionar equipamento</a></div>';
  } else {
    const max = Number(sorted[0].monthly_consumption);
    topList.innerHTML = sorted.map(c => {
      const pct = (Number(c.monthly_consumption) / max) * 100;
      return `
        <div class="flex items-center gap-3">
          <div class="w-32 truncate text-sm">${c.equipment_name}</div>
          <div class="flex-1 h-2 bg-bg rounded-full overflow-hidden">
            <div class="h-full bg-energy rounded-full" style="width:${pct}%"></div>
          </div>
          <div class="w-24 text-right text-sm text-energy font-semibold">${Number(c.monthly_consumption).toFixed(1)} kWh</div>
        </div>`;
    }).join('');
  }

  // Gráfico de consumo por equipamento
  const equipLabels = calc.map(c => c.equipment_name);
  const equipData = calc.map(c => Number(c.monthly_consumption) || 0);
  new Chart(document.getElementById('chartEquip'), {
    type: 'bar',
    data: {
      labels: equipLabels,
      datasets: [{
        label: 'kWh/mês',
        data: equipData,
        backgroundColor: '#FFD95A',
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#94A3B8' } } },
      scales: {
        x: { ticks: { color: '#94A3B8' }, grid: { color: '#243044' } },
        y: { ticks: { color: '#94A3B8' }, grid: { color: '#243044' } }
      }
    }
  });

  // Gráfico de custo
  const custoLabels = calc.map(c => c.equipment_name);
  const custoData = calc.map(c => Number(c.monthly_cost) || 0);
  new Chart(document.getElementById('chartCusto'), {
    type: 'doughnut',
    data: {
      labels: custoLabels,
      datasets: [{
        data: custoData,
        backgroundColor: ['#FFD95A', '#38BDF8', '#22C55E', '#EF4444', '#A855F7', '#EC4899'],
        borderColor: '#101827',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } }
    }
  });
})();
