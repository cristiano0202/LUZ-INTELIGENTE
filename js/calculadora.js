let currentUser = null;
let lastCalc = null;

(async () => {
  currentUser = await requireAuth('login.html');
  if (!currentUser) return;

  document.getElementById('btnLogout').addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  });

  document.getElementById('btnMenu').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('hidden');
    document.getElementById('sidebar').classList.toggle('fixed');
    document.getElementById('sidebar').classList.toggle('inset-0');
    document.getElementById('sidebar').classList.toggle('z-50');
  });

  await loadCalculations();

  // Calcular
  document.getElementById('formCalc').addEventListener('submit', (e) => {
    e.preventDefault();
    const equip = document.getElementById('equip').value.trim();
    const power = Number(document.getElementById('power').value);
    const qty = Number(document.getElementById('qty').value);
    const hours = Number(document.getElementById('hours').value);
    const days = Number(document.getElementById('days').value);
    const rate = Number(document.getElementById('rate').value);

    const dailyConsumption = (power * qty * hours) / 1000;
    const monthlyConsumption = dailyConsumption * days;
    const dailyCost = dailyConsumption * rate;
    const monthlyCost = monthlyConsumption * rate;

    lastCalc = {
      equipment_name: equip,
      power_watts: power,
      quantity: qty,
      hours_per_day: hours,
      days_per_month: days,
      energy_rate: rate,
      daily_consumption: dailyConsumption,
      monthly_consumption: monthlyConsumption,
      daily_cost: dailyCost,
      monthly_cost: monthlyCost
    };

    document.getElementById('rDiario').textContent = dailyConsumption.toFixed(2);
    document.getElementById('rMensal').textContent = monthlyConsumption.toFixed(2);
    document.getElementById('rCustoDiario').textContent = dailyCost.toFixed(2).replace('.', ',');
    document.getElementById('rCustoMensal').textContent = monthlyCost.toFixed(2).replace('.', ',');
    document.getElementById('results').classList.remove('hidden');
  });

  document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('formCalc').reset();
    document.getElementById('results').classList.add('hidden');
    lastCalc = null;
  });

  // Salvar
  document.getElementById('btnSalvar').addEventListener('click', async () => {
    if (!lastCalc) return;
    const btn = document.getElementById('btnSalvar');
    const msg = document.getElementById('msgSave');
    btn.disabled = true;
    btn.textContent = 'Salvando...';

    const { error } = await supabase.from('calculations').insert({
      user_id: currentUser.id,
      ...lastCalc
    });

    btn.disabled = false;
    btn.textContent = '💾 Salvar cálculo';

    if (error) {
      msg.textContent = 'Erro ao salvar: ' + error.message;
      msg.className = 'mt-2 text-sm text-danger';
    } else {
      msg.textContent = 'Cálculo salvo com sucesso!';
      msg.className = 'mt-2 text-sm text-success';
      document.getElementById('formCalc').reset();
      document.getElementById('results').classList.add('hidden');
      lastCalc = null;
      await loadCalculations();
    }
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 3000);
  });
})();

async function loadCalculations() {
  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .order('created_at', { ascending: false });

  const tbody = document.getElementById('tbody');
  if (error) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-danger">Erro: ${error.message}</td></tr>`;
    return;
  }

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-txt-sec">Nenhum equipamento cadastrado ainda.</td></tr>`;
    document.getElementById('totalInfo').textContent = '';
    return;
  }

  const totalKwh = data.reduce((s, c) => s + (Number(c.monthly_consumption) || 0), 0);
  const totalRs = data.reduce((s, c) => s + (Number(c.monthly_cost) || 0), 0);
  document.getElementById('totalInfo').innerHTML =
    `Total: <span class="text-energy font-semibold">${totalKwh.toFixed(1)} kWh</span> · <span class="text-success font-semibold">R$ ${totalRs.toFixed(2).replace('.', ',')}</span>`;

  tbody.innerHTML = data.map(c => `
    <tr class="border-b border-border hover:bg-bg/40">
      <td class="py-2 font-medium">${c.equipment_name}</td>
      <td>${c.power_watts} W</td>
      <td>${c.quantity}</td>
      <td>${c.hours_per_day}</td>
      <td class="text-energy font-semibold">${Number(c.monthly_consumption).toFixed(2)}</td>
      <td class="text-success">R$ ${Number(c.monthly_cost).toFixed(2).replace('.', ',')}</td>
      <td class="text-right">
        <button onclick="deleteCalc('${c.id}')" class="px-2 py-1 rounded text-xs border border-danger/50 text-danger hover:bg-danger hover:text-white transition">Excluir</button>
      </td>
    </tr>
  `).join('');
}

async function deleteCalc(id) {
  if (!confirm('Excluir este cálculo?')) return;
  const { error } = await supabase.from('calculations').delete().eq('id', id);
  if (error) {
    alert('Erro ao excluir: ' + error.message);
  } else {
    await loadCalculations();
  }
}
window.deleteCalc = deleteCalc;
