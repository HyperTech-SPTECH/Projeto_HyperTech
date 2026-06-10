var { pool, mysqlExecutar } = require("../database/config.js");

function buscarNoMaisProximo(lng, lat) {
    return pool.query({
        text: `
            SELECT 
                CASE WHEN dist_source <= dist_target THEN source ELSE target END AS id
            FROM (
                SELECT 
                    source, target,
                    ST_Distance(ST_StartPoint(the_geom), ST_SetSRID(ST_MakePoint($1,$2),4326)) AS dist_source,
                    ST_Distance(ST_EndPoint(the_geom),   ST_SetSRID(ST_MakePoint($1,$2),4326)) AS dist_target
                FROM public.ways
                ORDER BY the_geom <-> ST_SetSRID(ST_MakePoint($1,$2),4326)
                LIMIT 5
            ) t
            ORDER BY LEAST(dist_source, dist_target)
            LIMIT 1
        `,
        values: [lng, lat]
    });
}

// Bounding box é um retângulo no mapa que envolve todas as coordenadas necessárias para ir da origem ao destino.
function calcularRotas(idOrigem, idDestino, origemLng, origemLat, destLng, destLat) {
    var bboxSubquery = (costCol, revCostCol) => `
        SELECT gid AS id, source, target, ${costCol} AS cost, ${revCostCol} AS reverse_cost
        FROM public.ways
        WHERE the_geom && ST_Expand(
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
                    WHEN rota.node = ruas.source THEN ruas.the_geom
                    ELSE ST_Reverse(ruas.the_geom)
                END AS geom,
                rota.seq
            FROM pgr_bdDijkstra(
                '${bboxSubquery('cost', 'reverse_cost')}',
                ${idOrigem}, ${idDestino}, true
            ) AS rota
            JOIN public.ways AS ruas ON rota.edge = ruas.gid
            WHERE rota.edge != -1
        ),
        calc_seguro AS (
            SELECT 
                CASE 
                    WHEN rota.node = ruas.source THEN ruas.the_geom
                    ELSE ST_Reverse(ruas.the_geom)
                END AS geom,
                rota.seq
            FROM pgr_bdDijkstra(
                '${bboxSubquery('custo_risco', 'custo_risco_reverso')}',
                ${idOrigem}, ${idDestino}, true
            ) AS rota
            JOIN public.ways AS ruas ON rota.edge = ruas.gid
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
            FROM public.poligono_risco_2025 p
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

function buscarFavoritosPorUsuario(idUsuario) {
    return mysqlExecutar(
        `SELECT id_favorito, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota FROM favorito_rota WHERE id_usuario = ? ORDER BY id_favorito ASC`,
        [idUsuario]
    );
}

function inserirFavorito(idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota) {
    return mysqlExecutar(
        `INSERT INTO favorito_rota (id_usuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, JSON.stringify(rota)]
    );
}

function atualizarFavorito(idFavorito, idUsuario, nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, rota) {
    return mysqlExecutar(
        `UPDATE favorito_rota SET nome = ?, origem = ?, destino = ?, origemLat = ?, origemLng = ?, destinoLat = ?, destinoLng = ?, rota = ? WHERE id_favorito = ? AND id_usuario = ?`,
        [nome, origem, destino, origemLat, origemLng, destinoLat, destinoLng, JSON.stringify(rota), idFavorito, idUsuario]
    );
}

function excluirFavorito(idFavorito, idUsuario) {
    return mysqlExecutar(
        `DELETE FROM favorito_rota WHERE id_favorito = ? AND id_usuario = ?`,
        [idFavorito, idUsuario]
    );
}

module.exports = { buscarNoMaisProximo, calcularRotas, buscarFavoritosPorUsuario, inserirFavorito, atualizarFavorito, excluirFavorito };