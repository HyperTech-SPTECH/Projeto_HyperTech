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
        var queryNo = (lng, lat) => ({
            text: `
                SELECT 
                    CASE WHEN dist_source <= dist_target THEN source ELSE target END AS id
                FROM (
                    SELECT 
                        source, target,
                        ST_Distance(ST_StartPoint(geom), ST_SetSRID(ST_MakePoint($1,$2),4326)) AS dist_source,
                        ST_Distance(ST_EndPoint(geom),   ST_SetSRID(ST_MakePoint($1,$2),4326)) AS dist_target
                    FROM public.ways
                    ORDER BY geom <-> ST_SetSRID(ST_MakePoint($1,$2),4326)
                    LIMIT 5
                ) t
                ORDER BY LEAST(dist_source, dist_target)
                LIMIT 1
            `,
            values: [lng, lat]
        });
        
        var [resOrig, resDest] = await Promise.all([
            pool.query(queryNo(origemLng, origemLat)),
            pool.query(queryNo(destLng, destLat)),
        ]);
        
        var idOrigem  = resOrig.rows[0]?.id;
        var idDestino = resDest.rows[0]?.id;
        
        if (!idOrigem || !idDestino) {
            return res.status(404).json({ erro: "Nenhum nó próximo encontrado." });
        }
        
        // Antes toda vez ele varria a tabela ways (que tem 1.750.500 registors), isso leva muito tempo.
        // Isso faz com que invés dele carregar todas as arestas, ele carrega somente as próximas as coordenadas passadas.
        // Bounding box é um retangulo no mapa que envolve todas as coordenadas necessarias para ir da origem ao destino.
        
        var bboxSubquery = (costCol, revCostCol) => `
            SELECT id, source, target, ${costCol} AS cost, ${revCostCol} AS reverse_cost
            FROM public.ways
            WHERE geom && ST_Expand(
                ST_Envelope(ST_Collect(
                    ST_SetSRID(ST_MakePoint(${destLng},  ${destLat}),  4326),
                    ST_SetSRID(ST_MakePoint(${origemLng}, ${origemLat}), 4326)
                )), 0.05
            )
        `;
        
        const query = `
            WITH calc_padrao AS (
                SELECT 
                    CASE 
                        WHEN rota.node = ruas.source THEN ruas.geom
                        ELSE ST_Reverse(ruas.geom)
                    END AS geom,
                    rota.seq
                FROM pgr_bdDijkstra(
                    '${bboxSubquery('cost', 'reverse_cost')}',
                    ${idOrigem}, ${idDestino}, true
                ) AS rota
                JOIN public.ways AS ruas ON rota.edge = ruas.id
                WHERE rota.edge != -1
            ),
            calc_seguro AS (
                SELECT 
                    CASE 
                        WHEN rota.node = ruas.source THEN ruas.geom
                        ELSE ST_Reverse(ruas.geom)
                    END AS geom,
                    rota.seq
                FROM pgr_bdDijkstra(
                    '${bboxSubquery('custo_risco', 'custo_risco_reverso')}',
                    ${idOrigem}, ${idDestino}, true
                ) AS rota
                JOIN public.ways AS ruas ON rota.edge = ruas.id
                WHERE rota.edge != -1
            ),
            resumo_padrao AS (
                SELECT
                    ROUND((SUM(ST_Length(geom::geography)) / 1000.0)::numeric, 2) AS distancia_km,
                    ST_AsGeoJSON(ST_Simplify(ST_MakeLine(geom ORDER BY seq), 0.0001))::jsonb AS geometria
                FROM calc_padrao
            ),
            resumo_seguro AS (
                SELECT
                    ROUND((SUM(ST_Length(geom::geography)) / 1000.0)::numeric, 2) AS distancia_km,
                    ST_AsGeoJSON(ST_Simplify(ST_MakeLine(geom ORDER BY seq), 0.0001))::jsonb AS geometria,
                    ST_Envelope(ST_Collect(geom)) AS caixa_envolvente
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