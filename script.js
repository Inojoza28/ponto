document.addEventListener('DOMContentLoaded', () => {
    // Carregar a preferência de modo ao carregar a página
    if (localStorage.getItem('modoEscuro') === 'true') {
        document.body.classList.add('dark-mode');
    }

    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);
    atualizarHistorico();

    document.getElementById('entradaBtn').addEventListener('click', () => registrarPonto('entrada'));
    document.getElementById('saidaBtn').addEventListener('click', () => registrarPonto('saida'));
    document.getElementById('resetBtn').addEventListener('click', resetarHistorico);

    // Alternar entre modos claro e escuro
    const darkModeBtn = document.getElementById('darkModeBtn');
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Salvar a preferência de modo no localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('modoEscuro', 'true');
        } else {
            localStorage.setItem('modoEscuro', 'false');
        }
    });
});

function atualizarRelogio() {
    const agora = new Date();
    const horarioAtual = formatarHorario(agora);
    document.getElementById('relogio').textContent = horarioAtual;
}

function formatarHorario(data) {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

function registrarPonto(tipo) {
    const agora = new Date();
    const horario = agora.toLocaleString();
    let historico = obterHistorico();

    if (tipo === 'entrada') {
        if (historico.length > 0 && !historico[historico.length - 1].saida) {
            alert("Você já registrou uma entrada. Registre uma saída antes de registrar uma nova entrada.");
            return;
        }
        historico.push({ entrada: horario, saida: '' });
    } else {
        const ultimoPonto = historico[historico.length - 1];
        if (ultimoPonto && !ultimoPonto.saida) {
            ultimoPonto.saida = horario;
        } else {
            alert("Nenhuma entrada registrada ou saída já foi registrada. Por favor, registre uma entrada.");
            return;
        }
    }

    salvarHistorico(historico);
    atualizarHistorico();
}

function atualizarHistorico() {
    const historico = obterHistorico();
    const lista = document.getElementById('historico');
    lista.innerHTML = '';

    if (historico.length === 0) {
        lista.innerHTML = '<li>Nenhum ponto registrado ainda.</li>';
    } else {
        historico.forEach(ponto => {
            const li = document.createElement('li');
            
            const entrada = document.createElement('span');
            entrada.className = 'entrada';
            entrada.innerHTML = `Entrada: ${ponto.entrada}`;

            const saida = document.createElement('span');
            saida.className = 'saida';
            saida.innerHTML = `Saída: ${ponto.saida || 'Ainda não registrado'}`;

            // Aplica a classe "definida" se a saída foi registrada
            if (ponto.saida) {
                saida.classList.add('definida');
            }

            li.appendChild(entrada);
            li.appendChild(saida);
            lista.appendChild(li);
        });
    }
}

function obterHistorico() {
    return JSON.parse(localStorage.getItem('historicoPonto')) || [];
}

function salvarHistorico(historico) {
    localStorage.setItem('historicoPonto', JSON.stringify(historico));
}

function resetarHistorico() {
    if (confirm("Tem certeza de que deseja resetar todo o histórico de pontos?")) {
        localStorage.removeItem('historicoPonto');
        atualizarHistorico();
    }
}
