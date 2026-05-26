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
    
    function capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    function aoDigitar(campo) {
        var valorDigitado = document.getElementById("input" + capitalizar(campo)).value.trim();
        coordenadasSelecionadas[campo].lat = null;
        coordenadasSelecionadas[campo].lng = null;
        
        if (campo === "origem")
            clearTimeout(timerOrigem);
        else 
            clearTimeout(timerDestino);
        
        var timer = setTimeout(function() { 
            buscarSugestoes(campo, valorDigitado); 
        }, 400);
        
        if (campo === "origem")
            timerOrigem  = timer;
        else
            timerDestino = timer;
    }
    
    async function buscarSugestoes(campo, textoBuscado) {
        try {
            var resposta = await fetch(
                URL_GEOCODE + "?q=" + encodeURIComponent(textoBuscado)
            );
            
            if (!resposta.ok) 
                return;
            
            var listaDeSugestoes = await resposta.json();
            exibirListaDeSugestoes(campo, listaDeSugestoes);
        } catch (erro) {
            console.error("Erro ao buscar sugestões:", erro.message);
        }
    }
    
    function exibirListaDeSugestoes(campo, sugestoes) {
        var elementoLista = document.getElementById("sugestoes" + capitalizar(campo));
        elementoLista.innerHTML = "";
        
        if (campo === "origem") 
            indiceSelecionadoOrigem  = -1;
        else
            indiceSelecionadoDestino = -1;
        
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
        
        if (marcadorDestino !== null) 
            marcadorDestino.remove();
        
        if (campo === "origem") {
            marcadorOrigem = L.marker([enderecoSelecionado.lat, enderecoSelecionado.lng])
            .addTo(mapa).bindPopup("📍 Origem: " + textoResumido);
        } else {
            marcadorDestino = L.marker([enderecoSelecionado.lat, enderecoSelecionado.lng])
            .addTo(mapa).bindPopup("🏁 Destino: " + textoResumido);
        }
        
        mapa.setView([enderecoSelecionado.lat, enderecoSelecionado.lng], 15);
    }
    
    function esconderLista(campo) {
        document.getElementById("sugestoes" + capitalizar(campo)).style.display = "none";
    }
    
    document.addEventListener("click", function(evento) {
        if (!evento.target.closest("#inputOrigem")  && !evento.target.closest("#sugestoesOrigem"))  esconderLista("origem");
        if (!evento.target.closest("#inputDestino") && !evento.target.closest("#sugestoesDestino")) esconderLista("destino");
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
        document.getElementById("areaResultados").style.display = "none";
        
        try {
            console.log(latOrigem)
            console.log(lngOrigem)
            console.log(latDestino)
            console.log(lngDestino)

            var resposta = await fetch(URL_CALCULAR, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    origemLat: latOrigem, 
                    origemLng: lngOrigem, 
                    destLat: latDestino, 
                    destLng: lngDestino }),
            });
            
            var dados = await resposta.json();
            console.log(dados)

            if (!resposta.ok) { 
                alert("Erro: " + (dados.error || "Erro desconhecido")); 
                return; 
            }
            
            dados.poligonos_risco.forEach(function(geometriaGeoJSON) {
                L.geoJSON(geometriaGeoJSON, {
                    style: { color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.2, weight: 1.5 },
                }).addTo(camadaPoligonos);
            });
            
            if (dados.rota_padrao && dados.rota_padrao.geometria) {
                linhaRotaDireta = L.geoJSON(dados.rota_padrao.geometria, {
                    style: { color: "#fb923c", weight: 5, opacity: 0.85 },
                }).addTo(mapa);
            }
            
            console.log("6");
            
            if (dados.rota_segura && dados.rota_segura.geometria) {
                linhaRotaSegura = L.geoJSON(dados.rota_segura.geometria, {
                    style: { color: "#22c55e", weight: 5, opacity: 0.9 },
                }).addTo(mapa);
            }
            
            console.log("7");
            
            
            if      (linhaRotaSegura !== null) mapa.fitBounds(linhaRotaSegura.getBounds(), { padding: [50, 50] });
            else if (linhaRotaDireta !== null) mapa.fitBounds(linhaRotaDireta.getBounds(), { padding: [50, 50] });
            
            document.getElementById("distanciaRotaDireta").textContent = dados.rota_padrao ? dados.rota_padrao.distancia_km : "—";
            document.getElementById("distanciaRotaSegura").textContent = dados.rota_segura ? dados.rota_segura.distancia_km : "—";
            document.getElementById("areaResultados").style.display = "block";
            
            console.log("8");
            
            
        } catch (erro) {
            console.log("9");
            
            alert("Falha na requisição: " + erro.message);
        }
    }
    
    function limparTudo() {
        document.getElementById("inputOrigem").value  = "";
        document.getElementById("inputDestino").value = "";
        coordenadasSelecionadas.origem.lat  = null;
        coordenadasSelecionadas.origem.lng  = null;
        coordenadasSelecionadas.destino.lat = null;
        coordenadasSelecionadas.destino.lng = null;
        esconderLista("origem");
        esconderLista("destino");
        if (marcadorOrigem  !== null) { marcadorOrigem.remove();  marcadorOrigem  = null; }
        if (marcadorDestino !== null) { marcadorDestino.remove(); marcadorDestino = null; }
        if (linhaRotaDireta !== null) { linhaRotaDireta.remove(); linhaRotaDireta = null; }
        if (linhaRotaSegura !== null) { linhaRotaSegura.remove(); linhaRotaSegura = null; }
        camadaPoligonos.clearLayers();
        document.getElementById("areaResultados").style.display = "none";
    }
    
    document.getElementById("inputOrigem").addEventListener("input", function() {
        console.log("aoDigitar")
        aoDigitar('origem');
    });
    
    document.getElementById("inputDestino").addEventListener("input", function() {
        aoDigitar('destino');
    });
    
    document.getElementById("btnCalcularRota").addEventListener("click", calcularRota);
    document.getElementById("btnLimparTudo").addEventListener("click", limparTudo);  
    
    console.log("fim")
}