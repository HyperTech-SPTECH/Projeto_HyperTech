var { pool } = require("../database/config.js");
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
// Nem sempre a mais segura será mais demorada.
async function calcular(req, res) {
    var {origemLat, origemLng, destLat, destLng} = req.body;
    
    if (coordenadaInvalida(origemLat) || coordenadaInvalida(origemLng) || coordenadaInvalida(destLat) || coordenadaInvalida(destLng)) {
        return res.status(400).json({ erro: "Coordenadas inválidas ou ausentes." });
    }
    
    try {
        // Busca o nó mais próximo do endereço de ORIGEM
        var respostaNoOrigem = await pool.query(
            `SELECT id FROM public.ways_vertices_pgr
             ORDER BY geom <-> ST_SetSRID(ST_MakePoint(${origemLng}, ${origemLat}), 4326)
             LIMIT 1`,
        );
        
        // Busca o nó mais próximo do endereço de DESTINO
        var respostaNoDestino = await pool.query(
            `SELECT id FROM public.ways_vertices_pgr
             ORDER BY geom <-> ST_SetSRID(ST_MakePoint(${destLng}, ${destLat}), 4326)
             LIMIT 1`,
        );
        
        var idOrigem = respostaNoOrigem.rows[0]?.id;
        var idDestino = respostaNoDestino.rows[0]?.id;
        
        if (!idOrigem || !idDestino) {
            return res.status(404).json({ erro: "Nenhum nó próximo encontrado." });
        }
        
        console.log(`origem=${idOrigem} | destino=${idDestino}`);
        
        // rota direta + rota segura + polígonos de risco
        var query = `
            WITH calc_padrao AS (
                SELECT ruas.geom
                FROM pgr_dijkstra(
                    'SELECT id, source, target, cost, reverse_cost FROM public.ways',
                    ${idOrigem}, ${idDestino}, true
                ) AS rota
                JOIN public.ways AS ruas ON rota.edge = ruas.id
            ),
            calc_seguro AS (
                SELECT ruas.geom
                FROM pgr_dijkstra(
                    'SELECT id, source, target, custo_risco AS cost, custo_risco_reverso AS reverse_cost FROM public.ways',
                    ${idOrigem}, ${idDestino}, true
                ) AS rota
                JOIN public.ways AS ruas ON rota.edge = ruas.id
            ),
            resumo_padrao AS (
                SELECT
                    ROUND((SUM(ST_Length(geom::geography)) / 1000.0)::numeric, 2) AS distancia_km,
                    ST_AsGeoJSON(ST_Simplify(ST_MakeLine(geom), 0.0001))::jsonb    AS geometria
                FROM calc_padrao
            ),
            resumo_seguro AS (
                SELECT
                    ROUND((SUM(ST_Length(geom::geography)) / 1000.0)::numeric, 2) AS distancia_km,
                    ST_AsGeoJSON(ST_Simplify(ST_MakeLine(geom), 0.0001))::jsonb    AS geometria,
                    ST_Envelope(ST_Collect(geom))                                  AS caixa_envolvente
                FROM calc_seguro
            ),
            poligonos_relevantes AS (
                SELECT jsonb_agg(ST_AsGeoJSON(p.geom_poligono)::jsonb) AS lista_poligonos
                FROM public.poligonos_risco_2025 p
                JOIN resumo_seguro rs ON ST_Intersects(p.geom_poligono, ST_Expand(rs.caixa_envolvente, 0.02))
            )
            SELECT jsonb_build_object(
                'rota_padrao',     (SELECT jsonb_build_object('distancia_km', distancia_km, 'geometria', geometria) FROM resumo_padrao),
                'rota_segura',     (SELECT jsonb_build_object('distancia_km', distancia_km, 'geometria', geometria) FROM resumo_seguro),
                'poligonos_risco', (SELECT COALESCE(lista_poligonos, '[]'::jsonb) FROM poligonos_relevantes)
            ) AS dados_json
        `;
        
        var resultado = await pool.query(query);
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