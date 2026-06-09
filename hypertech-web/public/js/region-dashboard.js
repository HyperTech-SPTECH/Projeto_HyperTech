var graficoCargas = null;

function pegarFiltrosDaTela() {
    return {
        cidade: document.getElementById("idSelectFiltroCidade").value,
        bairro: document.getElementById("idSelectFiltroBairro").value,
        mes: document.getElementById("idSelectFiltroMes").value
    };
}

function preencherKpiMais(dados) {
    var i;

    // posição 1 = maior quantidade, depois 2 e 3 (mais pra menos)
    for (i = 1; i <= 3; i++) {
        var linha = dados[i - 1];

        if (linha) {
            document.getElementById("idKpiMaisCarga" + i).textContent = linha.carga;
            document.getElementById("idKpiMaisQtd" + i).textContent = linha.quantidade;
        } else {
            document.getElementById("idKpiMaisCarga" + i).textContent = "-";
            document.getElementById("idKpiMaisQtd" + i).textContent = "0";
        }
    }
}

function preencherKpiMenos(dados) {
    var i;
    var indice;

    // dados vem do maior para o menor; posição 1 = menor quantidade
    for (i = 1; i <= 3; i++) {
        indice = dados.length - i;
        var linha = dados[indice];

        if (linha) {
            document.getElementById("idKpiMenosCarga" + i).textContent = linha.carga;
            document.getElementById("idKpiMenosQtd" + i).textContent = linha.quantidade;
        } else {
            document.getElementById("idKpiMenosCarga" + i).textContent = "-";
            document.getElementById("idKpiMenosQtd" + i).textContent = "0";
        }
    }
}

function atualizarGrafico(dados) {
    var labels = [];
    var valores = [];
    var i;

    if (!graficoCargas) {
        return;
    }

    for (i = 0; i < dados.length; i++) {
        labels.push(dados[i].carga);
        valores.push(Number(dados[i].quantidade));
    }

    graficoCargas.data.labels = labels;
    graficoCargas.data.datasets[0].data = valores;
    graficoCargas.update();
}

function buscarCargas(cidade, bairro, mes, limite) {
    var body = { cidade: cidade, bairro: bairro, mes: mes };

    if (limite == 6) {
        body.limite = 6;
    }

    return fetch("dashboard/cargasMaisRoubadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }).then(function (resposta) {
        return resposta.json();
    });
}

function preencherResumoDiaHorario(dados) {
    var totalGeral = 0;
    var dias;
    var i;

    for (i = 0; i < dados.length; i++) {
        totalGeral = totalGeral + Number(dados[i].total_incidentes);
    }

    dias = somarPorCampo(dados, "dia_semana");

    preencherKpi("idResumoDiaSeguro", ordenarDoMenor(copiarLista(dias)), totalGeral);
    preencherKpi("idResumoDiaPerigoso", ordenarDoMaior(copiarLista(dias)), totalGeral);
}

function carregarResumoDiaHorario(cidade, bairro, mes) {
    if (!document.getElementById("idResumoDiaSeguro1")) {
        return;
    }

    fetch("dashboard/periculosidadeDiaHorario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cidade: cidade, bairro: bairro, mes: mes })
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {
            preencherResumoDiaHorario(dados);
        })
        .catch(function (erro) {
            console.log("Erro no resumo dia e horário:", erro);
        });
}

function carregarDadosDashboard(cidade, bairro, mes) {
    buscarCargas(cidade, bairro, mes, 6)
        .then(function (dados) {
            atualizarGrafico(dados);
        })
        .catch(function (erro) {
            console.log("Erro no gráfico de cargas:", erro);
        });

    buscarCargas(cidade, bairro, mes, null)
        .then(function (dados) {
            preencherKpiMais(dados);
            preencherKpiMenos(dados);
        })
        .catch(function (erro) {
            console.log("Erro nas KPIs de cargas:", erro);
        });
}

function renderGraficoCargas() {
    var canvas = document.getElementById("graficoCargas");

    if (!canvas) {
        return;
    }

    if (graficoCargas) {
        graficoCargas.destroy();
    }

    var ctx = canvas.getContext("2d");
    Chart.register(ChartDataLabels);

    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0, 71, 143, 1)");
    gradient.addColorStop(1, "rgba(0, 31, 63, 1)");

    graficoCargas = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [],
            datasets: [{
                label: "Quantidade",
                data: [],
                backgroundColor: gradient,
                hoverBackgroundColor: "#001f3f",
                borderColor: "#002244",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false,
                barPercentage: 0.7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: { top: 40, bottom: 10, left: 10, right: 10 }
            },
            plugins: {
                datalabels: {
                    anchor: "end",
                    align: "top",
                    color: "#2c3e50",
                    font: { weight: "bold", size: 14, family: "Arial" },
                    formatter: Math.round,
                    offset: 4
                },
                legend: { display: false }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: "#777", font: { size: 12 } }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false,
                        color: "rgba(0, 0, 0, 0.05)",
                        borderDash: [5, 5]
                    },
                    ticks: { color: "#777", padding: 10 }
                }
            }
        }
    });

    carregarDadosDashboard(null, null, null);
    carregarResumoDiaHorario(null, null, null);
}

document.addEventListener("click", function (evento) {
    if (evento.target.id != "idAplicarFiltros") {
        return;
    }
    if (!document.getElementById("graficoCargas")) {
        return;
    }

    var filtros = pegarFiltrosDaTela();
    carregarDadosDashboard(filtros.cidade, filtros.bairro, filtros.mes);
    carregarResumoDiaHorario(filtros.cidade, filtros.bairro, filtros.mes);
});
