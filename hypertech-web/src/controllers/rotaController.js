var rotaModel = require("../models/rotaModel");
var {buscarEnderecos} = require("../services/geocodingService");

// Função chama o geocondignService para tentar exibir para o usuario sugestões de endereço
async function geocode(req, res) {
    var {q} = req.query;
    
    if (!q) {
        return res.status(400).json({ erro: "Parâmetro q é obrigatório." });
    }
    
    try {
        var sugestoes = await buscarEnderecos(q);
        
        if (!sugestoes.length) {
            return res.status(404).json({ erro: "Endereço não encontrado." });
        }
        
        return res.json(sugestoes);
    } catch (err) {
        console.error("Erro no geocoding:", err.message);
        return res.status(500).json({ 
            erro: "Falha ao consultar geocoder.", 
            mensagem: err.message 
        });
    }
}

function coordenadaInvalida(value) {
    return value == null || isNaN(value);
}

// Chama o postgree para gerar duas rotas: mais segura e mais rápida.
async function calcular(req, res) {
    var {origemLat, origemLng, destLat, destLng} = req.body;
    
    if (coordenadaInvalida(origemLat) || coordenadaInvalida(origemLng) || coordenadaInvalida(destLat) || coordenadaInvalida(destLng)) {
        return res.status(400).json({ erro: "Coordenadas inválidas ou ausentes." });
    }
    
    try {
        var [resOrig, resDest] = await Promise.all([
            rotaModel.buscarNoMaisProximo(origemLng, origemLat),
            rotaModel.buscarNoMaisProximo(destLng, destLat),
        ]);
        
        var idOrigem  = resOrig.rows[0]?.id;
        var idDestino = resDest.rows[0]?.id;
        
        if (!idOrigem || !idDestino) {
            return res.status(404).json({ erro: "Nenhum nó próximo encontrado." });
        }
        
        console.log(`origem=${idOrigem} | destino=${idDestino}`);
        
        var resultado = await rotaModel.calcularRotas(idOrigem, idDestino, origemLng, origemLat, destLng, destLat);
        var dadosEnvio = resultado.rows[0]?.dados_json;
        
        if (!dadosEnvio) {
            return res.status(404).json({ erro: "Nenhuma rota encontrada entre os pontos." });
        }
        
        console.log("Rota traçada com sucesso.")
        return res.json(dadosEnvio);
        
    } catch (err) {
        console.error("Erro no cálculo de rota:", err.message);
        return res.status(500).json({ erro: "Erro interno.", detalhe: err.message });
    }
}

module.exports = { geocode, calcular };


async function buscarFavoritos(req, res) {
    var idUsuario = parseInt(req.query.idUsuario);
    
    if (!idUsuario || isNaN(idUsuario)) {
        return res.status(400).json({ erro: "ID do usuário inválido ou ausente." });
    }
    
    try {
        var resultado = await rotaModel.buscarFavoritosPorUsuario(idUsuario);
        return res.json(resultado.rows);
    } catch (err) {
        console.error("Erro ao buscar favoritos:", err.message);
        return res.status(500).json({ erro: "Erro ao buscar favoritos.", detalhe: err.message });
    }
}

async function salvarFavorito(req, res) {
    var {idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota} = req.body;
    
    if (!idUsuario || !nome || !origem || !destino) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes: idUsuario, nome, origem, destino." });
    }
    
    try {
        var resultado = await rotaModel.inserirFavorito(
            parseInt(idUsuario), 
            nome, 
            origem, 
            destino,
            origemLat ?? null,
            origemLng ?? null,
            destinoLat ?? null, 
            destinoLng ?? null,
            rota ?? null
        );
        
        return res.status(201).json({ id_favorito: resultado.rows[0].id_favorito });
    } catch (err) {
        console.error("Erro ao salvar favorito:", err.message);
        return res.status(500).json({ erro: "Erro ao salvar favorito.", detalhe: err.message });
    }
}

async function editarFavorito(req, res) {
    var idFavorito = parseInt(req.params.id);
    var {idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota} = req.body;
    
    if (isNaN(idFavorito) || !idUsuario || !nome || !origem || !destino) {
        return res.status(400).json({ 
            erro: "Campos obrigatórios ausentes." 
        });
    }
    
    try {
        var resultado = await rotaModel.atualizarFavorito(
            idFavorito, 
            parseInt(idUsuario), 
            nome, 
            origem, 
            destino,
            origemLat ?? null,
            origemLng ?? null,
            destinoLat ?? null, 
            destinoLng ?? null,
            rota ?? null
        );
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({erro: "Favorito não encontrado ou sem permissão."});
        }
        
        return res.json({mensagem: "Favorito atualizado com sucesso."});
    } catch (err) {
        console.error("Erro ao editar favorito:", err.message);
        return res.status(500).json({ erro: "Erro ao editar favorito.", detalhe: err.message });
    }
}

async function deletarFavorito(req, res) {
    var idFavorito = parseInt(req.params.id);
    var idUsuario = parseInt(req.query.idUsuario);
    
    if (isNaN(idFavorito) || isNaN(idUsuario)) {
        return res.status(400).json({ erro: "Parâmetros inválidos." });
    }
    
    try {
        var resultado = await rotaModel.excluirFavorito(idFavorito, idUsuario);
        
        if (resultado.rowCount === 0) {
            return res.status(404).json({ erro: "Favorito não encontrado ou sem permissão." });
        }
        
        return res.json({ mensagem: "Favorito excluído com sucesso." });
    } catch (err) {
        console.error("Erro ao excluir favorito:", err.message);
        return res.status(500).json({ erro: "Erro ao excluir favorito.", detalhe: err.message });
    }
}

module.exports = { geocode, calcular, buscarFavoritos, salvarFavorito, editarFavorito, deletarFavorito };