const idUsuarioLogado = sessionStorage.id_usuario || sessionStorage.ID_USUARIO;
let idFiltroSelecionado = null;
let dadosLogistica = {}; 
let listaFiltrosCache = [];


function carregarOpcoesFiltros() {
    fetch("/filtros/listarOpcoes")
        .then((resp) => resp.json())
        .then((dados) => {
            dadosLogistica = dados;
            const cidades = Object.keys(dadosLogistica);
            popularSelect("novoCidadeFiltro", cidades, "Selecione a cidade...");
            popularSelect("editCidadeFiltro", cidades, "Selecione a cidade...");
            document.getElementById("novoCidadeFiltro").value = "#";
            document.getElementById("editCidadeFiltro").value = "#";
        })
        .catch((err) => console.error("Erro ao carregar opções:", err));
}

// === 3. FUNÇÃO AUXILIAR DE SELECTS ===
// === 3. FUNÇÃO AUXILIAR DE SELECTS ATUALIZADA ===
function popularSelect(id, lista, placeholder, valorSelecionado = "") {
    const select = document.getElementById(id);
    if (!select) return;
    
    // Injeta os comportamentos para limitar a altura dinamicamente (limite de 5 linhas visíveis)
    select.setAttribute("onfocus", "this.size=5;");
    select.setAttribute("onblur", "this.size=1;");
    
    // Captura o onchange estruturado no seu HTML para não perdê-lo
    const changeOriginal = select.getAttribute("data-original-change") || select.getAttribute("onchange") || "";
    if (changeOriginal && !select.getAttribute("data-original-change")) {
        select.setAttribute("data-original-change", changeOriginal);
    }
    
    // Fecha o tamanho do select e executa a função de atualizar os bairros em seguida
    const execucaoOriginal = select.getAttribute("data-original-change") || "";
    select.setAttribute("onchange", `this.size=1; this.blur(); ${execucaoOriginal}`);

    select.innerHTML = `
        <option value="">${placeholder}</option>
        <option value="#">Todos</option>
    `;

    lista.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        option.textContent = padronizarTextos(item);
        select.appendChild(option);
    });
    if (valorSelecionado) select.value = valorSelecionado;
}


function tratarSelecaoCidade(sufixo) {
    const isNovo = sufixo === "Novo";
    const idCidade = isNovo ? "novoCidadeFiltro" : "editCidadeFiltro";
    const idBairro = isNovo ? "novoBairroFiltro" : "editBairroFiltro";
    
    const cidade = document.getElementById(idCidade).value;
    const selectBairro = document.getElementById(idBairro);
    
    if (cidade) {
        selectBairro.disabled = false;
        
        const bairros = cidade === "#" ? [] : dadosLogistica[cidade];
        
        popularSelect(idBairro, bairros || [], "Selecione o bairro...");
    } else {
        selectBairro.disabled = true;
        selectBairro.innerHTML = '<option value="">Escolha a cidade primeiro</option>';
    }
}

function atualizarTabelaFiltros() {
    fetch(`/filtros/usuario/${idUsuarioLogado}`)
        .then((res) => res.status === 204 ? [] : res.json())
        .then((filtros) => {
            listaFiltrosCache = filtros;
            renderizarTabelaHTML(filtros);
        })
        .catch((err) => console.error("Erro ao listar filtros:", err));
}

function salvarNovoFiltro() {
    const payload = {
        idUsuario: idUsuarioLogado,
        nomeFiltro: document.getElementById("novoNomeFiltro").value.trim(),
        cidade: document.getElementById("novoCidadeFiltro").value,
        bairro: document.getElementById("novoBairroFiltro").value,
        mes: document.getElementById("novoMesFiltro").value
    };

    if (!payload.nomeFiltro || !payload.cidade) return alert("Preencha Nome e Cidade!");

    fetch("/filtros/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(() => { fecharModal("modalNovoFiltro"); atualizarTabelaFiltros(); });
}

function salvarEdicaoFiltro() {
    const payload = {
        idUsuario: idUsuarioLogado,
        nomeFiltro: document.getElementById("editNomeFiltro").value.trim(),
        cidade: document.getElementById("editCidadeFiltro").value,
        bairro: document.getElementById("editBairroFiltro").value,
        mes: document.getElementById("editMesFiltro").value
    };

    fetch(`/filtros/atualizar/${idFiltroSelecionado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    }).then(() => { fecharModal("modalEditarFiltro"); atualizarTabelaFiltros(); });
}

function confirmarExclusaoFiltro() {
    fetch(`/filtros/excluirFiltro/${idUsuarioLogado}/${idFiltroSelecionado}`, { method: "DELETE" })
        .then(() => { fecharModal("modalExcluirFiltro"); atualizarTabelaFiltros(); });
}

function abrirModalNovoFiltro() {
    document.getElementById("novoNomeFiltro").value = "";
    const selectCidade = document.getElementById("novoCidadeFiltro");
    selectCidade.value = "#";
    const selectBairro = document.getElementById("novoBairroFiltro");
    selectBairro.innerHTML = '<option value="#">Todos</option>';
    selectBairro.disabled = false;
    abrirModal("modalNovoFiltro");
}

function editarFiltro(id) {
    idFiltroSelecionado = id;
    const filtro = listaFiltrosCache.find((f) => f.filtro_id === id);
    if (!filtro) return;

    document.getElementById("editNomeFiltro").value = filtro.nome_filtro;
    document.getElementById('editCidadeFiltro').value = filtro.cidade;
    document.getElementById('editBairroFiltro').value = filtro.bairro;
    console.log(filtro);
    
    
    popularSelect("editCidadeFiltro", Object.keys(dadosLogistica), "Selecione...", filtro.cidade);
    tratarSelecaoCidade("Editar");

    setTimeout(() => {
        document.getElementById("editBairroFiltro").value = filtro.bairro;
    }, 100);

    abrirModal("modalEditarFiltro");
}

function deletarFiltro(id) {
    idFiltroSelecionado = id;
    abrirModal("modalExcluirFiltro");
}

function renderizarTabelaHTML(filtros) {
    const tbody = document.getElementById("idTbodyFiltros");
    if (!tbody) return;
    tbody.innerHTML = filtros.length === 0 
        ? '<tr><td colspan="5" style="text-align:center;">Nenhum filtro salvo.</td></tr>'
        : filtros.map(f => `<tr><td>${padronizarTextos(f.nome_filtro)}</td><td>${padronizarTextos(f.cidade)}</td><td>${padronizarTextos(f.bairro)}</td><td>${padronizarMes(f.mes)}</td>
            <td class="table-actions">
                <button class="btn-action-table btn-update" onclick="editarFiltro(${f.filtro_id})"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn-action-table btn-delete" onclick="deletarFiltro(${f.filtro_id})"><i class="fa-solid fa-trash"></i></button>
            </td></tr>`).join('');
}

function abrirModal(id) { document.getElementById(id)?.classList.add("active"); }
function fecharModal(id) { document.getElementById(id)?.classList.remove("active"); }

function padronizarMes(mes) {
    const nomesMeses = [
        'Todos os Meses', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 
        'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 
        'Novembro', 'Dezembro'
    ];

    return (mes == "#") ? `<span class="badge-all">Todos os Meses</span>` : `<span class="badge-mes">${nomesMeses[mes]}</span>`
}


function padronizarTextos(texto) {
  if(!texto) return '';
  if(texto == "#") return 'Todos';

  return texto.toLowerCase().replace(/(^\w|\s\w)/g, m => m.toUpperCase());
}