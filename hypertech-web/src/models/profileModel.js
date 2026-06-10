var database = require("../database/config")

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
function alterar(id, nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function alterar():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}', senha = '${senha}' WHERE usuario_id = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}

async function remover(id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function remover():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.

    var instrucaoSqlSelect = `
        SELECT id FROM usuario_email_notificacao WHERE usuario_id = '${id}';
    `;
    let resultSelect = await database.mysqlExecutar(instrucaoSqlSelect)

    await database.mysqlExecutar(`DELETE FROM filtro_favorito WHERE usuario_id = '${id}';`)
    
    for (let i = 0; i < resultSelect.length; i++) {
        await database.mysqlExecutar(`DELETE FROM preferencias_notificacao WHERE usuario_email_id = '${resultSelect[i].id}'`)
    }

    var instrucaoSqlTabela01 = `
        DELETE FROM usuario_email_notificacao WHERE usuario_id = '${id}';
    `
    await database.mysqlExecutar(instrucaoSqlTabela01)

    var instrucaoSql = `
        DELETE FROM usuario WHERE usuario_id = '${id}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return await database.mysqlExecutar(instrucaoSql);
}


module.exports = {
    alterar,
    remover
};