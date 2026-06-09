var database = require("../database/config")

function montarFiltroWhere(cidade, bairro, mes) {
    var condicoes = [];

    if (cidade != null) {
        condicoes.push("cidade = '" + cidade + "'");
    }
    if (bairro != null) {
        condicoes.push("bairro = '" + bairro + "'");
    }
    if (mes != null) {
        condicoes.push("EXTRACT(MONTH FROM data_hora) = " + mes);
    }

    if (condicoes.length == 0) {
        return "";
    }

    return " WHERE " + condicoes.join(" AND ");
}

function infoFiltrar() {
    var instrucaoSql = `
        SELECT COUNT(incidente_id), cidade, bairro, EXTRACT(month from data_hora) AS mes
        FROM incidente
        GROUP BY cidade, bairro, mes
        ORDER BY mes;
    `;
    // console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function cargasMaisRoubadas(cidade, bairro, mes, limite) {
    var whereSql = montarFiltroWhere(cidade, bairro, mes);
    var limiteSql = "";

    if (limite == 6) {
        limiteSql = " LIMIT 6";
    }

    var instrucaoSql = `
        SELECT grupo_carga AS carga, COUNT(*) AS quantidade
        FROM incidente
        ${whereSql}
        GROUP BY grupo_carga
        ORDER BY quantidade DESC${limiteSql};
    `;
    // console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function periculosidadeDiaHorario(cidade, bairro, mes) {
    var whereSql = montarFiltroWhere(cidade, bairro, mes);

    var instrucaoSql = `
        SELECT
            dia_semana,
            CASE
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 0 AND 2 THEN '00h-03h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 3 AND 5 THEN '03h-06h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 6 AND 8 THEN '06h-09h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 9 AND 11 THEN '09h-12h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 12 AND 14 THEN '12h-15h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 15 AND 17 THEN '15h-18h'
                WHEN EXTRACT(HOUR FROM data_hora) BETWEEN 18 AND 20 THEN '18h-21h'
                ELSE '21h-00h'
            END AS faixa_horario,
            COUNT(*) AS total_incidentes
        FROM incidente
        ${whereSql}
        GROUP BY dia_semana, 2
        ORDER BY dia_semana, faixa_horario;
    `;
    // console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    infoFiltrar,
    cargasMaisRoubadas,
    periculosidadeDiaHorario
};