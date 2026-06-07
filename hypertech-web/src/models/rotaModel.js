var { pool } = require("../database/config.js");

function buscarNoMaisProximo(lng, lat) {
    return pool.query({
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
}

// Antes toda vez ele varria a tabela ways (que tem 1.750.500 registros), isso leva muito tempo.
// Isso faz com que invés de carregar todas as arestas, ele carrega somente as próximas às coordenadas passadas.
// Bounding box é um retângulo no mapa que envolve todas as coordenadas necessárias para ir da origem ao destino.
function calcularRotas(idOrigem, idDestino, origemLng, origemLat, destLng, destLat) {
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

    var query = `
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

    return pool.query(query);
}

module.exports = { buscarNoMaisProximo, calcularRotas };


function buscarFavoritosPorUsuario(idUsuario) {
    return pool.query({
        text: `
            SELECT id_favorito, nome, origem, destino,
                   origemlat, origemlng, destinolat, destinolng, rota
            FROM public.favorito_rota
            WHERE id_usuario = ${idUsuario}
            ORDER BY id_favorito ASC
        `,
    });
}

function inserirFavorito(idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota) {
    return pool.query({
        text: `
            INSERT INTO public.favorito_rota
                (id_usuario, nome, origem, destino, origemlat, origemlng, destinolat, destinolng, rota)
            VALUES (${idUsuario}, ${nome}, ${origem}, ${destino}, ${origemLat}, ${origemLng}, ${destinoLat}, ${destinoLng}, ${rota})
            RETURNING id_favorito
        `,
    });
}

function atualizarFavorito(idFavorito, idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota) {
    return pool.query({
        text: `
            UPDATE public.favorito_rota
            SET nome = ${nome}, origem = ${origem}, destino = ${destino},
                origemlat = ${origemLat}, origemlng = ${origemLng}, destinolat = ${destinoLat}, destinolng = ${destinoLng}, rota = ${rota}
            WHERE id_favorito = ${idFavorito} AND id_usuario = ${idUsuario}
        `,
    });
}

function excluirFavorito(idFavorito, idUsuario) {
    return pool.query({
        text: `DELETE FROM public.favorito_rota WHERE id_favorito = ${idFavorito} AND id_usuario = ${idUsuario}`,
    });
}

module.exports = { buscarNoMaisProximo, calcularRotas, buscarFavoritosPorUsuario, inserirFavorito, atualizarFavorito, excluirFavorito };
