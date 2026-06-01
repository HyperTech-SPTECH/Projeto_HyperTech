var database = require("../database/config")

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
async function criacao(email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function criacao():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql00 = `
        SELECT usuario_id FROM usuario WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql00);
    let result00 = await database.mysqlExecutar(instrucaoSql00);

    console.log(result00)
    
    var instrucaoSql01 = `
    INSERT INTO usuario_email_notificacao (usuario_id, email) VALUES ('${result00[0].usuario_id}', '${email}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql01);
    let result01 = await database.mysqlExecutar(instrucaoSql01);
    
    var instrucaoSql02 = `
    SELECT id FROM usuario_email_notificacao WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql02);
    let result02 = await database.mysqlExecutar(instrucaoSql02)
    
    var instrucaoSql03 = `
    INSERT INTO preferencias_notificacao (usuario_email_id, tipo) VALUES ('${result02[0].id}', 'DIARIA'), ('${result02[0].id}', 'SEMANAL'), ('${result02[0].id}', 'ANUAL')
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql03);
    let result03 = await database.mysqlExecutar(instrucaoSql03);


    console.log("Executando a instrução SQL: \n" + instrucaoSql01);
    return result01;
}

// function remover(id) {
//     console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function remover():",);
    
//     // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
//     //  e na ordem de inserção dos dados.
//     var instrucaoSql = `
//         DELETE FROM usuario WHERE usuario_id = '${id}';
//     `;
//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.mysqlExecutar(instrucaoSql);
// }


module.exports = {
    criacao
};