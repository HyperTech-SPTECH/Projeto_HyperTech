var listaDias = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
var listaHorarios = ["00h-03h", "03h-06h", "06h-09h", "09h-12h", "12h-15h", "15h-18h", "18h-21h", "21h-00h"];

var mapaDiaSemana = {
    "segunda-feira": "Seg",
    "terça-feira": "Ter",
    "quarta-feira": "Qua",
    "quinta-feira": "Qui",
    "sexta-feira": "Sex",
    "sábado": "Sab",
    "sabado": "Sab",
    "domingo": "Dom"
};

function pegarFiltrosDaTela() {
    return {
        cidade: document.getElementById("idSelectFiltroCidade").value,
        bairro: document.getElementById("idSelectFiltroBairro").value,
        mes: document.getElementById("idSelectFiltroMes").value
    };
}

function calcularPorcentagem(quantidade, total) {
    if (total == 0) {
        return 0;
    }
    return Math.round((quantidade / total) * 100);
}

function formatarNomeDia(dia) {
    if (!dia) {
        return "-";
    }
    return dia.charAt(0).toUpperCase() + dia.slice(1);
}

function pegarRisco(total, minimo, maximo) {
    if (maximo == minimo) {
        return "B";
    }

    var parte = (maximo - minimo) / 3;

    if (total <= minimo + parte) {
        return "B";
    }
    if (total <= minimo + parte * 2) {
        return "M";
    }
    return "A";
}

function pegarClasseRisco(risco) {
    if (risco == "B") {
        return "heatmap__block--baixo";
    }
    if (risco == "M") {
        return "heatmap__block--medio";
    }
    return "heatmap__block--alto";
}

function pegarQuantidade(dados, dia, horario) {
    var i;

    for (i = 0; i < dados.length; i++) {
        var diaBanco = mapaDiaSemana[dados[i].dia_semana];

        if (diaBanco == dia && dados[i].faixa_horario == horario) {
            return Number(dados[i].total_incidentes);
        }
    }

    return 0;
}

function renderHeatmap(dados) {
    var grid = document.getElementById("heatmap-grid");
    var minimo = 999999;
    var maximo = 0;
    var i;
    var d;
    var h;

    if (!grid) {
        return;
    }

    for (i = 0; i < dados.length; i++) {
        var total = Number(dados[i].total_incidentes);

        if (total < minimo) {
            minimo = total;
        }
        if (total > maximo) {
            maximo = total;
        }
    }

    if (dados.length == 0) {
        minimo = 0;
        maximo = 0;
    }

    grid.innerHTML = "";
    grid.appendChild(document.createElement("div"));

    for (h = 0; h < listaHorarios.length; h++) {
        var cabecalho = document.createElement("div");
        cabecalho.className = "heatmap__time-header";
        cabecalho.textContent = listaHorarios[h];
        grid.appendChild(cabecalho);
    }

    for (d = 0; d < listaDias.length; d++) {
        var dia = listaDias[d];
        var labelDia = document.createElement("div");
        labelDia.className = "heatmap__day-label";
        labelDia.textContent = dia;
        grid.appendChild(labelDia);

        for (h = 0; h < listaHorarios.length; h++) {
            var horario = listaHorarios[h];
            var quantidade = pegarQuantidade(dados, dia, horario);
            var risco = pegarRisco(quantidade, minimo, maximo);
            var celula = document.createElement("div");
            var classe = pegarClasseRisco(risco);

            celula.innerHTML = '<div class="heatmap__block ' + classe + '">' + risco + "</div>";
            grid.appendChild(celula);
        }
    }
}

function somarPorCampo(dados, campo) {
    var totais = {};
    var lista = [];
    var nome;
    var i;

    for (i = 0; i < dados.length; i++) {
        nome = dados[i][campo];

        if (!totais[nome]) {
            totais[nome] = 0;
        }

        totais[nome] = totais[nome] + Number(dados[i].total_incidentes);
    }

    for (nome in totais) {
        lista.push({
            nome: nome,
            quantidade: totais[nome]
        });
    }

    return lista;
}

function ordenarDoMaior(lista) {
    var i;
    var j;
    var troca;

    for (i = 0; i < lista.length - 1; i++) {
        for (j = i + 1; j < lista.length; j++) {
            if (lista[j].quantidade > lista[i].quantidade) {
                troca = lista[i];
                lista[i] = lista[j];
                lista[j] = troca;
            }
        }
    }

    return lista;
}

function ordenarDoMenor(lista) {
    var i;
    var j;
    var troca;

    for (i = 0; i < lista.length - 1; i++) {
        for (j = i + 1; j < lista.length; j++) {
            if (lista[j].quantidade < lista[i].quantidade) {
                troca = lista[i];
                lista[i] = lista[j];
                lista[j] = troca;
            }
        }
    }

    return lista;
}

function copiarLista(lista) {
    var nova = [];
    var i;

    for (i = 0; i < lista.length; i++) {
        nova.push({
            nome: lista[i].nome,
            quantidade: lista[i].quantidade
        });
    }

    return nova;
}

function preencherKpi(prefixo, lista, totalGeral) {
    var i;
    var linha;
    var nomeId;
    var infoId;

    for (i = 1; i <= 3; i++) {
        linha = lista[i - 1];
        nomeId = document.getElementById(prefixo + i);
        infoId = document.getElementById(prefixo + "Info" + i);

        if (linha && nomeId && infoId) {
            if (prefixo.indexOf("Dia") >= 0) {
                nomeId.textContent = formatarNomeDia(linha.nome);
            } else {
                nomeId.textContent = linha.nome;
            }
            infoId.textContent = linha.quantidade + " (" + calcularPorcentagem(linha.quantidade, totalGeral) + "%)";
        } else if (nomeId && infoId) {
            nomeId.textContent = "-";
            infoId.textContent = "0 (0%)";
        }
    }
}

function preencherKpisLateral(dados) {
    var totalGeral = 0;
    var dias;
    var horarios;
    var i;

    for (i = 0; i < dados.length; i++) {
        totalGeral = totalGeral + Number(dados[i].total_incidentes);
    }

    dias = somarPorCampo(dados, "dia_semana");
    horarios = somarPorCampo(dados, "faixa_horario");

    // Mais perigosos: do maior para o menor (1 = pior)
    preencherKpi("idKpiDiaPerigoso", ordenarDoMaior(copiarLista(dias)), totalGeral);
    preencherKpi("idKpiHoraPerigoso", ordenarDoMaior(copiarLista(horarios)), totalGeral);

    // Menos perigosos: do menor para o maior (1 = mais seguro)
    preencherKpi("idKpiDiaSeguro", ordenarDoMenor(copiarLista(dias)), totalGeral);
    preencherKpi("idKpiHoraSeguro", ordenarDoMenor(copiarLista(horarios)), totalGeral);
}

function usarDadosDiaHora(dados) {
    renderHeatmap(dados);
    preencherKpisLateral(dados);
}

function carregarDadosDiaHora(cidade, bairro, mes) {
    if (!document.getElementById("heatmap-grid")) {
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
            usarDadosDiaHora(dados);
        })
        .catch(function (erro) {
            console.log("Erro na dashboard dia e hora:", erro);
        });
}

function preencherResumoMenos(posicao, linha, total) {
    if (linha) {
        document.getElementById("idResumoMenosCarga" + posicao).textContent = linha.carga;
        document.getElementById("idResumoMenosQtd" + posicao).textContent = linha.quantidade;
        document.getElementById("idResumoMenosPct" + posicao).textContent = calcularPorcentagem(Number(linha.quantidade), total);
    } else {
        document.getElementById("idResumoMenosCarga" + posicao).textContent = "-";
        document.getElementById("idResumoMenosQtd" + posicao).textContent = "0";
        document.getElementById("idResumoMenosPct" + posicao).textContent = "0";
    }
}

function preencherResumoMais(posicao, linha, total) {
    if (linha) {
        document.getElementById("idResumoMaisCarga" + posicao).textContent = linha.carga;
        document.getElementById("idResumoMaisQtd" + posicao).textContent = linha.quantidade;
        document.getElementById("idResumoMaisPct" + posicao).textContent = calcularPorcentagem(Number(linha.quantidade), total);
    } else {
        document.getElementById("idResumoMaisCarga" + posicao).textContent = "-";
        document.getElementById("idResumoMaisQtd" + posicao).textContent = "0";
        document.getElementById("idResumoMaisPct" + posicao).textContent = "0";
    }
}

function carregarResumoCargas(cidade, bairro, mes) {
    if (!document.getElementById("idResumoMaisCarga1")) {
        return;
    }

    fetch("dashboard/cargasMaisRoubadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cidade: cidade, bairro: bairro, mes: mes })
    })
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (dados) {
            var total = 0;
            var i;

            for (i = 0; i < dados.length; i++) {
                total = total + Number(dados[i].quantidade);
            }

            for (i = 1; i <= 3; i++) {
                preencherResumoMais(i, dados[i - 1], total);
            }

            // Menos roubadas: do menor para o maior
            for (i = 1; i <= 3; i++) {
                preencherResumoMenos(i, dados[dados.length - i], total);
            }
        })
        .catch(function (erro) {
            console.log("Erro no resumo de cargas:", erro);
        });
}

function iniciarDashboardDiaHora() {
    carregarDadosDiaHora(null, null, null);
    carregarResumoCargas(null, null, null);
}

document.addEventListener("click", function (evento) {
    if (evento.target.id != "idAplicarFiltros") {
        return;
    }

    var filtros = pegarFiltrosDaTela();

    if (document.getElementById("heatmap-grid")) {
        carregarDadosDiaHora(filtros.cidade, filtros.bairro, filtros.mes);
    }

    if (document.getElementById("idResumoMaisCarga1")) {
        carregarResumoCargas(filtros.cidade, filtros.bairro, filtros.mes);
    }
});