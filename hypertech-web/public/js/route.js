function renderSistemaRotas(params) {
    const URL_GEOCODE  = "/rotas/geocode";
    const URL_CALCULAR = "/rotas/calcular";
    
    var mapa = L.map("mapa").setView([-23.5505, -46.6333], 13);
    
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap Contributors",
        maxZoom: 19,
    }).addTo(mapa);
    
    var coordenadasSelecionadas = {
        origem:  { lat: null, lng: null },
        destino: { lat: null, lng: null },
    };
    
    var marcadorOrigem  = null;
    var marcadorDestino = null;
    var linhaRotaDireta = null;
    var linhaRotaSegura = null;
    var camadaPoligonos = L.layerGroup().addTo(mapa);
    var timerOrigem     = null;
    var timerDestino    = null;
    var indiceSelecionadoOrigem  = -1;
    var indiceSelecionadoDestino = -1;
    var ultimaRotaCalculada      = null;
    
    function capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    function aoDigitar(campo) {
        var valorDigitado = document.getElementById("input" + capitalizar(campo)).value.trim();
        coordenadasSelecionadas[campo].lat = null;
        coordenadasSelecionadas[campo].lng = null;
        
        if (campo === "origem") {
            clearTimeout(timerOrigem);
        } else {
            clearTimeout(timerDestino);
        }
        
        var timer = setTimeout(function() { 
            buscarSugestoes(campo, valorDigitado); 
        }, 400);
        
        if (campo === "origem") {
            timerOrigem  = timer;
        } else {
            timerDestino = timer;
        }
    }
    
    async function buscarSugestoes(campo, textoBuscado) {
        try {
            var resposta = await fetch(URL_GEOCODE + "?q=" + encodeURIComponent(textoBuscado));
            
            if (!resposta.ok) {
                return;
            }
            
            var listaDeSugestoes = await resposta.json();
            exibirListaDeSugestoes(campo, listaDeSugestoes);
        } catch (erro) {
            console.error("Erro ao buscar sugestões:", erro.message);
        }
    }
    
    function exibirListaDeSugestoes(campo, sugestoes) {
        var elementoLista = document.getElementById("sugestoes" + capitalizar(campo));
        elementoLista.innerHTML = "";
        
        if (campo === "origem") {
            indiceSelecionadoOrigem  = -1;
        } else {
            indiceSelecionadoDestino = -1;
        }
        
        if (sugestoes.length === 0) { 
            esconderLista(campo); 
            return; 
        }
        
        sugestoes.forEach(function(sugestao) {
            var itemLista = document.createElement("li");
            itemLista.textContent = sugestao.display;
            itemLista.style.cursor  = "pointer";
            itemLista.style.padding = "8px";
            
            itemLista.addEventListener("mousedown", function(evento) {
                evento.preventDefault();
                selecionarEndereco(campo, sugestao);
            });
            
            elementoLista.appendChild(itemLista);
        });
        
        elementoLista.style.display = "block";
    }
    
    function selecionarEndereco(campo, enderecoSelecionado) {
        coordenadasSelecionadas[campo].lat = enderecoSelecionado.lat;
        coordenadasSelecionadas[campo].lng = enderecoSelecionado.lng;
        
        var textoResumido = enderecoSelecionado.display.split(",").slice(0, 2).join(",");
        document.getElementById("input" + capitalizar(campo)).value = textoResumido;
        
        esconderLista(campo);
        
        if (campo == "origem" && marcadorOrigem !== null) {
            marcadorOrigem.remove();
        }
        
        if (campo == "destino" && marcadorDestino !== null) {
            marcadorDestino.remove();
        }
        
        if (campo === "origem") {
            marcadorOrigem = L.marker([enderecoSelecionado.lat, enderecoSelecionado.lng])
            .addTo(mapa)
            .bindPopup("Origem: " + textoResumido);
        } else {
            marcadorDestino = L.marker([enderecoSelecionado.lat, enderecoSelecionado.lng])
            .addTo(mapa)
            .bindPopup("Destino: " + textoResumido);
        }
        
        mapa.setView([enderecoSelecionado.lat, enderecoSelecionado.lng], 15);
    }
    
    function esconderLista(campo) {
        document.getElementById("sugestoes" + capitalizar(campo)).style.display = "none";
    }
    
    document.addEventListener("click", function(evento) {
        if (!evento.target.closest("#inputOrigem") && !evento.target.closest("#sugestoesOrigem")) {
            esconderLista("origem");
        }
        
        if (!evento.target.closest("#inputDestino") && !evento.target.closest("#sugestoesDestino")) {
            esconderLista("destino");
        }
    });
    
    async function calcularRota() {
        var latOrigem = coordenadasSelecionadas.origem.lat;
        var lngOrigem = coordenadasSelecionadas.origem.lng;
        var latDestino = coordenadasSelecionadas.destino.lat;
        var lngDestino = coordenadasSelecionadas.destino.lng;
        
        if (latOrigem === null || latDestino === null) {
            alert("Selecione a origem e o destino nas sugestões antes de calcular.");
            return;
        }
        
        if (linhaRotaDireta !== null) { 
            linhaRotaDireta.remove(); 
            linhaRotaDireta = null; 
        }
        
        if (linhaRotaSegura !== null) { 
            linhaRotaSegura.remove(); 
            linhaRotaSegura = null; 
        }
        
        camadaPoligonos.clearLayers();
        
        try {
            var resposta = await fetch(URL_CALCULAR, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    origemLat: latOrigem, 
                    origemLng: lngOrigem, 
                    destLat: latDestino, 
                    destLng: lngDestino 
                }),
            });
            
            var dados = await resposta.json();
            
            if (!resposta.ok) { 
                alert("Erro: " + (dados.error || "Erro desconhecido")); 
                return; 
            }
            
            exibirRotasNoMapa(dados);
            ultimaRotaCalculada = dados;
        } catch (erro) {
            alert("Falha na requisição: " + erro.message);
        }
    }
    
    function exibirRotasNoMapa(dados) {
        if (linhaRotaDireta !== null) { 
            linhaRotaDireta.remove(); 
            linhaRotaDireta = null; 
        }
        
        if (linhaRotaSegura !== null) { 
            linhaRotaSegura.remove();
            linhaRotaSegura = null; 
        }
        
        camadaPoligonos.clearLayers();
        
        if (dados.poligonos_risco) {
            dados.poligonos_risco.forEach(function(geometriaGeoJSON) {
                L.geoJSON(geometriaGeoJSON, {
                    style: { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.2, weight: 1.5 },
                }).addTo(camadaPoligonos);
            });
        }
        
        if (dados.rota_padrao && dados.rota_padrao.geometria) {
            linhaRotaDireta = L.geoJSON(dados.rota_padrao.geometria, {
                style: { color: "#ff0000", weight: 5, opacity: 1 },
            }).addTo(mapa);
        }
        
        if (dados.rota_segura && dados.rota_segura.geometria) {
            linhaRotaSegura = L.geoJSON(dados.rota_segura.geometria, {
                style: { color: "#006408", weight: 5, opacity: 1 },
            }).addTo(mapa);
        }
        
        if (linhaRotaSegura !== null) {
            mapa.fitBounds(linhaRotaSegura.getBounds(), { 
                padding: [50, 50] 
            });
            
        } else if (linhaRotaDireta !== null) {
            mapa.fitBounds(linhaRotaDireta.getBounds(), { 
                padding: [50, 50] 
            });
        }
        
        document.getElementById("distanciaRotaDireta").textContent = dados.rota_padrao ? dados.rota_padrao.distancia_km : "—";
        document.getElementById("distanciaRotaSegura").textContent = dados.rota_segura ? dados.rota_segura.distancia_km : "—";
        document.getElementById("areaResultados").style.display = "block";
    }
    
    function limparTudo() {
        document.getElementById("inputOrigem").value = "";
        document.getElementById("inputDestino").value = "";
        
        coordenadasSelecionadas.origem.lat = null;
        coordenadasSelecionadas.origem.lng = null;
        coordenadasSelecionadas.destino.lat = null;
        coordenadasSelecionadas.destino.lng = null;
        
        esconderLista("origem");
        esconderLista("destino");
        
        if (marcadorOrigem !== null)  { 
            marcadorOrigem.remove();  
            marcadorOrigem  = null; 
        }
        
        if (marcadorDestino !== null) { 
            marcadorDestino.remove(); 
            marcadorDestino = null; 
        }
        
        if (linhaRotaDireta !== null) { 
            linhaRotaDireta.remove(); 
            linhaRotaDireta = null; 
        }
        
        if (linhaRotaSegura !== null) { 
            linhaRotaSegura.remove(); 
            linhaRotaSegura = null; 
        }
        
        camadaPoligonos.clearLayers();
        ultimaRotaCalculada = null;
    }
    
    document.getElementById("inputOrigem").addEventListener("input", function() {
        aoDigitar('origem');
    });
    
    document.getElementById("inputDestino").addEventListener("input", function() {
        aoDigitar('destino');
    });
    
    document.getElementById("btnCalcularRota").addEventListener("click", calcularRota);
    document.getElementById("btnLimparTudo").addEventListener("click", limparTudo);
    
    // CRUD ROTAS:
    
    var idUsuario = parseInt(sessionStorage.getItem("ID_USUARIO")) || 1;
    var listaFavoritos = [];
    var idEmEdicao = null;
    var idParaExcluir = null;
    
    function escaparHtml(texto) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(texto));
        return div.innerHTML;
    }
    
    function renderizarFavoritos() {
        var container = document.getElementById("listaFavoritos");
        container.innerHTML = "";
        
        if (listaFavoritos.length === 0) {
            var mensagemVazia = document.createElement("p");
            mensagemVazia.className = "lista-vazia-favorito";
            mensagemVazia.textContent = "Nenhuma rota salva ainda.";
            container.appendChild(mensagemVazia);
            return;
        }
        
        listaFavoritos.forEach(function(favorito) {
            var item = document.createElement("div");
            item.className = "item-favorito";
            item.style.cursor = "pointer";
            
            item.innerHTML =
            '<div class="info-favorito">' +
            '<div class="nome-favorito">' + escaparHtml(favorito.nome) + 
            '</div>' +
            '<div class="detalhe-favorito">' + escaparHtml(favorito.origem) + ' \u2192 ' + escaparHtml(favorito.destino) + 
            '</div>' +
            '</div>' +
            '<div class="acoes-favorito">' +
            '<button class="botao-acao-favorito" title="Editar" data-id="' + favorito.id + '" data-acao="editar">' +
            '<img src="/assets/editar_icon.png" alt="Editar" class="icone-acao" />' +
            '</button>' +
            '<button class="botao-acao-favorito excluir" title="Excluir" data-id="' + favorito.id + '" data-acao="excluir">' +
            '<img src="/assets/deletar_icon.png" alt="Excluir" class="icone-acao" />' +
            '</button>' +
            '</div>';
            
            item.addEventListener("click", function(evento) {
                if (evento.target.closest("[data-acao]")) return;
                carregarFavorito(favorito.id);
            });
            
            container.appendChild(item);
        });
        
        container.querySelectorAll("[data-acao='editar']").forEach(function(btn) {
            btn.addEventListener("click", function() {
                abrirModalEditar(parseInt(this.dataset.id));
            });
        });
        
        container.querySelectorAll("[data-acao='excluir']").forEach(function(btn) {
            btn.addEventListener("click", function() {
                abrirModalExclusao(parseInt(this.dataset.id));
            });
        });
    }
    
    async function carregarFavoritos() {
        try {
            var resposta = await fetch("/rotas/favoritos?idUsuario=" + idUsuario);
            
            if (!resposta.ok) 
                return;
            
            var dados = await resposta.json();
            listaFavoritos = dados.map(function(f) {
                return {
                    id: f.id_favorito,
                    nome: f.nome,
                    origem: f.origem,
                    destino: f.destino,
                    origemLat: f.origemlat,
                    origemLng: f.origemlng,
                    destinoLat: f.destinolat,
                    destinoLng: f.destinolng,
                    rota: f.rota
                };
            });
            renderizarFavoritos();
        } catch (err) {
            console.error("Erro ao carregar favoritos:", err.message);
        }
    }
    
    function carregarFavorito(id) {
        var favorito = listaFavoritos.find(function(f) { 
            return f.id === id; 
        });
        
        if (!favorito)
            return;
        
        document.getElementById("inputOrigem").value = favorito.origem;
        document.getElementById("inputDestino").value = favorito.destino;
        
        coordenadasSelecionadas.origem.lat = favorito.origemLat;
        coordenadasSelecionadas.origem.lng = favorito.origemLng;
        coordenadasSelecionadas.destino.lat = favorito.destinoLat;
        coordenadasSelecionadas.destino.lng = favorito.destinoLng;
        
        if (favorito.rota) {
            exibirRotasNoMapa(favorito.rota);
            ultimaRotaCalculada = favorito.rota;
        }
        
        if (marcadorOrigem  !== null) { 
            marcadorOrigem.remove();  
            marcadorOrigem  = null; 
        }
        
        if (marcadorDestino !== null) { 
            marcadorDestino.remove(); 
            marcadorDestino = null; 
        }
        
        if (favorito.origemLat && favorito.origemLng) {
            marcadorOrigem = L.marker([favorito.origemLat, favorito.origemLng])
            .addTo(mapa)
            .bindPopup("Origem: " + favorito.origem);
        }
        
        if (favorito.destinoLat && favorito.destinoLng) {
            marcadorDestino = L.marker([favorito.destinoLat, favorito.destinoLng])
            .addTo(mapa)
            .bindPopup("Destino: " + favorito.destino);
        }
    }
    
    function abrirModalSalvar() {
        document.getElementById("modalNomeFavorito").value = "";
        document.getElementById("modalOrigemSalvar").value = document.getElementById("inputOrigem").value;
        document.getElementById("modalDestinoSalvar").value = document.getElementById("inputDestino").value;
        
        atualizarBotaoSalvar();
        
        document.getElementById("modalSalvarFavorito").classList.add("visivel");
        document.getElementById("modalNomeFavorito").focus();
    }
    
    function fecharModalSalvar() {
        document.getElementById("modalSalvarFavorito").classList.remove("visivel");
    }
    
    async function confirmarSalvar() {
        var nome = document.getElementById("modalNomeFavorito").value.trim();
        var origem = document.getElementById("modalOrigemSalvar").value.trim();
        var destino = document.getElementById("modalDestinoSalvar").value.trim();
        
        if (!nome || !origem || !destino) 
            return;
        
        var corpo = {
            idUsuario: idUsuario,
            nome: nome,
            origem: origem,
            destino: destino,
            origemLat: coordenadasSelecionadas.origem.lat,
            origemLng: coordenadasSelecionadas.origem.lng,
            destinoLat: coordenadasSelecionadas.destino.lat,
            destinoLng: coordenadasSelecionadas.destino.lng,
            rota: ultimaRotaCalculada
        };
        
        try {
            var resposta = await fetch("/rotas/favoritos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            });
            
            if (!resposta.ok) {
                var errDados = await resposta.json();
                console.error("Erro ao salvar favorito:", errDados);
                return;
            }
            
            await carregarFavoritos();
            fecharModalSalvar();
        } catch (err) {
            console.error("Erro ao salvar favorito:", err.message);
        }
    }
    
    function abrirModalEditar(id) {
        var favorito = listaFavoritos.find(function(f) { 
            return f.id === id; 
        });
        
        if (!favorito) 
            return;
        
        idEmEdicao = id;
        coordenadasModalEditando.origem.lat = null;
        coordenadasModalEditando.origem.lng = null;
        coordenadasModalEditando.destino.lat = null;
        coordenadasModalEditando.destino.lng = null;
        
        document.getElementById("modalNomeEditar").value = favorito.nome;
        document.getElementById("modalOrigemEditar").value = favorito.origem;
        document.getElementById("modalDestinoEditar").value = favorito.destino;
        
        document.getElementById("modalEditarFavorito").classList.add("visivel");
        document.getElementById("modalNomeEditar").focus();
    }
    
    function fecharModalEditar() {
        idEmEdicao = null;
        document.getElementById("modalEditarFavorito").classList.remove("visivel");
    }
    
    async function confirmarEditar() {
        if (idEmEdicao === null) 
            return;
        
        var favorito = listaFavoritos.find(function(f) { 
            return f.id === idEmEdicao; 
        });
        
        if (!favorito) 
            return;
        
        var novoNome = document.getElementById("modalNomeEditar").value.trim();
        var novaOrigem = document.getElementById("modalOrigemEditar").value.trim();
        var novoDestino = document.getElementById("modalDestinoEditar").value.trim();
        
        if (!novoNome || !novaOrigem || !novoDestino) 
            return;
        
        var origemMudou = novaOrigem !== favorito.origem;
        var destinoMudou = novoDestino !== favorito.destino;
        
        if (origemMudou && coordenadasModalEditando.origem.lat === null) {
            alert("Selecione um endereço de origem nas sugestões.");
            return;
        }
        if (destinoMudou && coordenadasModalEditando.destino.lat === null) {
            alert("Selecione um endereço de destino nas sugestões.");
            return;
        }
        
        var origemLat = origemMudou ? coordenadasModalEditando.origem.lat  : favorito.origemLat;
        var origemLng = origemMudou ? coordenadasModalEditando.origem.lng  : favorito.origemLng;
        var destinoLat = destinoMudou ? coordenadasModalEditando.destino.lat : favorito.destinoLat;
        var destinoLng = destinoMudou ? coordenadasModalEditando.destino.lng : favorito.destinoLng;
        var rota = favorito.rota;
        
        if (origemMudou || destinoMudou) {
            try {
                var respostaCalc = await fetch(URL_CALCULAR, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        origemLat: origemLat,
                        origemLng: origemLng,
                        destLat: destinoLat,
                        destLng: destinoLng
                    })
                });
                
                var dadosCalc = await respostaCalc.json();
                
                if (!respostaCalc.ok) {
                    alert("Erro ao recalcular rota: " + (dadosCalc.erro || "desconhecido"));
                    return;
                }
                
                rota = dadosCalc;
            } catch (err) {
                alert("Falha ao recalcular rota: " + err.message);
                return;
            }
        }
        
        var corpo = {
            idUsuario: idUsuario,
            nome: novoNome,
            origem: novaOrigem,
            destino: novoDestino,
            origemLat: origemLat,
            origemLng: origemLng,
            destinoLat: destinoLat,
            destinoLng: destinoLng,
            rota: rota
        };
        
        try {
            var resposta = await fetch("/rotas/favoritos/" + idEmEdicao, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(corpo)
            });
            
            if (!resposta.ok) {
                var errDados = await resposta.json();
                console.error("Erro ao editar favorito:", errDados);
                return;
            }
            
            await carregarFavoritos();
            fecharModalEditar();
        } catch (err) {
            console.error("Erro ao editar favorito:", err.message);
        }
    }
    
    function abrirModalExclusao(id) {
        var favorito = listaFavoritos.find(function(f) {
            return f.id === id; 
        });
        
        if (!favorito)
            return;
        
        idParaExcluir = id;
        document.getElementById("modalNomeConfirmacao").textContent = favorito.nome;
        document.getElementById("modalEditarFavorito").classList.remove("visivel");
        document.getElementById("modalConfirmarExclusao").classList.add("visivel");
    }
    
    function fecharModalExclusao() {
        idParaExcluir = null;
        document.getElementById("modalConfirmarExclusao").classList.remove("visivel");
    }
    
    async function confirmarExclusao() {
        if (idParaExcluir === null) 
            return;
        
        try {
            var resposta = await fetch("/rotas/favoritos/" + idParaExcluir + "?idUsuario=" + idUsuario, {
                method: "DELETE"
            });
            
            if (!resposta.ok) {
                var errDados = await resposta.json();
                console.error("Erro ao excluir favorito:", errDados);
                return;
            }
            
            await carregarFavoritos();
            fecharModalExclusao();
        } catch (err) {
            console.error("Erro ao excluir favorito:", err.message);
        }
    }
    
    var timerModalOrigem  = null;
    var timerModalDestino = null;
    
    var coordenadasModalEditando = { 
        origem: { 
            lat: null, 
            lng: null 
        },
        destino: { 
            lat: null, 
            lng: null 
        }
    };
    
    function aoDigitarModal(campo) {
        var inputId = campo === "origem" ? "modalOrigemEditar" : "modalDestinoEditar";
        var texto = document.getElementById(inputId).value.trim();
        
        coordenadasModalEditando[campo].lat = null;
        coordenadasModalEditando[campo].lng = null;
        
        if (campo === "origem") { 
            clearTimeout(timerModalOrigem); 
        } else {
            clearTimeout(timerModalDestino);
        }
        
        var timer = setTimeout(function() { 
            buscarSugestoesModal(campo, texto); 
        }, 400);
        
        if (campo === "origem") {
            timerModalOrigem = timer;
        } else {
            timerModalDestino = timer;
        }
    }
    
    async function buscarSugestoesModal(campo, textoBuscado) {
        if (!textoBuscado) {
            esconderListaModal(campo); 
            return; 
        }
        
        try {
            var resposta = await fetch(URL_GEOCODE + "?q=" + encodeURIComponent(textoBuscado));
            
            if (!resposta.ok) 
                return;
            
            var sugestoes = await resposta.json();
            exibirSugestoesModal(campo, sugestoes);
        } catch (err) {
            console.error("Erro ao buscar sugestões no modal:", err.message);
        }
    }
    
    function exibirSugestoesModal(campo, sugestoes) {
        var listaId = campo === "origem" ? "sugestoesModalOrigem" : "sugestoesModalDestino";
        var elementoLista = document.getElementById(listaId);
        elementoLista.innerHTML = "";
        
        if (sugestoes.length === 0) {
            esconderListaModal(campo);
            return;
        }
        
        sugestoes.forEach(function(sugestao) {
            var itemLista = document.createElement("li");
            itemLista.textContent = sugestao.display;
            itemLista.style.cursor = "pointer";
            itemLista.style.padding = "8px";
            
            itemLista.addEventListener("mousedown", function(evento) {
                evento.preventDefault();
                selecionarEnderecoModal(campo, sugestao);
            });
            
            elementoLista.appendChild(itemLista);
        });
        
        elementoLista.style.display = "block";
    }
    
    function selecionarEnderecoModal(campo, enderecoSelecionado) {
        var inputId = campo === "origem" ? "modalOrigemEditar" : "modalDestinoEditar";
        var textoResumido = enderecoSelecionado.display.split(",").slice(0, 2).join(",");
        document.getElementById(inputId).value = textoResumido;
        
        coordenadasModalEditando[campo].lat = enderecoSelecionado.lat;
        coordenadasModalEditando[campo].lng = enderecoSelecionado.lng;
        esconderListaModal(campo);
    }
    
    function esconderListaModal(campo) {
        var listaId = campo === "origem" ? "sugestoesModalOrigem" : "sugestoesModalDestino";
        document.getElementById(listaId).style.display = "none";
    }
    
    document.getElementById("modalOrigemEditar").addEventListener("input",  function() { 
        aoDigitarModal("origem");  
    });

    document.getElementById("modalDestinoEditar").addEventListener("input", function() { 
        aoDigitarModal("destino"); 
    });
    
    document.addEventListener("click", function(evento) {
        if (!evento.target.closest("#modalOrigemEditar") && !evento.target.closest("#sugestoesModalOrigem"))  
            esconderListaModal("origem");
        if (!evento.target.closest("#modalDestinoEditar") && !evento.target.closest("#sugestoesModalDestino")) 
            esconderListaModal("destino");
    });
    
    document.getElementById("btnSalvarFavorito").addEventListener("click", abrirModalSalvar);
    document.getElementById("btnFecharModalSalvar").addEventListener("click", fecharModalSalvar);
    document.getElementById("btnCancelarSalvar").addEventListener("click", fecharModalSalvar);
    document.getElementById("btnConfirmarSalvar").addEventListener("click", confirmarSalvar);
    
    document.getElementById("modalNomeFavorito").addEventListener("input", atualizarBotaoSalvar);
    
    function atualizarBotaoSalvar() {
        var nome = document.getElementById("modalNomeFavorito").value.trim();
        var origem = document.getElementById("modalOrigemSalvar").value.trim();
        var destino = document.getElementById("modalDestinoSalvar").value.trim();
        document.getElementById("btnConfirmarSalvar").disabled = !nome || !origem || !destino;
    }
    
    document.getElementById("btnFecharModalEditar").addEventListener("click", fecharModalEditar);
    document.getElementById("btnCancelarEditar").addEventListener("click", fecharModalEditar);
    document.getElementById("btnConfirmarEditar").addEventListener("click", confirmarEditar);
    
    document.getElementById("btnExcluirNoEditar").addEventListener("click", function() {
        abrirModalExclusao(idEmEdicao);
    });
    
    document.getElementById("btnCancelarExclusao").addEventListener("click", fecharModalExclusao);
    document.getElementById("btnConfirmarExclusao").addEventListener("click", confirmarExclusao);
    
    carregarFavoritos();
}