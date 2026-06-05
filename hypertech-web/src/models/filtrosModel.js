var database = require("../database/config");

function excluirFiltro(idUsuario, idFiltro) {
    console.log("ACESSANDO FILTROS MODEL");

    var instrucaoSql = `
        DELETE FROM filtro_favorito WHERE usuario_id = '${idUsuario}' 
            AND filtro_id = '${idFiltro}';
    `
    console.log("Executando query: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}

function listarFiltros(idUsuario) {
    console.log("ACESSANDO FILTROS MODEL");

    var instrucaoSql = `
        SELECT 
            filtro_id, 
            nome_filtro, 
            cidade, 
            bairro, 
            mes 
        FROM filtro_favorito 
        WHERE usuario_id = '${idUsuario}';
    `;
    console.log("Execuntado query: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}

function cadastrarFiltro(idUsuario, nomeFiltro, cidade, bairro, mes) {
    console.log("ACESSANDO FILTROS MODEL -> CADASTRAR");

    var instrucaoSql = `
        INSERT INTO filtro_favorito (nome_filtro, cidade, bairro, mes, usuario_id) 
        VALUES ('${nomeFiltro}', '${cidade}', '${bairro}', '${mes}', '${idUsuario}');
    `;
    
    console.log("Executando query: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}


function atualizarFiltro(idFiltro, idUsuario, nomeFiltro, cidade, bairro, mes) {
    console.log("ACESSANDO FILTROS MODEL -> ATUALIZAR");

    var instrucaoSql = `
        UPDATE filtro_favorito 
        SET nome_filtro = '${nomeFiltro}', 
            cidade = '${cidade}', 
            bairro = '${bairro}', 
            mes = '${mes}' 
        WHERE filtro_id = '${idFiltro}' AND usuario_id = '${idUsuario}';
    `;
    
    console.log("Executando query: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}

function buscarOpcoesFiltro() {
    console.log("ACESSANDO FILTROS MODEL)");

    var instrucaoSql = `
        SELECT DISTINCT cidade, bairro 
        FROM incidente 
        WHERE cidade IS NOT NULL AND bairro IS NOT NULL
        ORDER BY cidade, bairro;
    `;
    
    console.log("Executando query no Postgres: \n" + instrucaoSql);
    return database.executar(instrucaoSql); 
}


module.exports = {
    listarFiltros,
    cadastrarFiltro,
    atualizarFiltro,
    excluirFiltro,
    buscarOpcoesFiltro
};