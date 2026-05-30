var database = require("../database/config")

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
async function alterar(id, nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function alterar():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql = `
        UPDATE usuario SET nome = '${nome}', email = '${email}', senha = '${senha}' WHERE usuario_id = ${id};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}


module.exports = {
    alterar
};