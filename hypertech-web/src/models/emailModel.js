var database = require("../database/config")

function enviar(email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function enviar(): ", email)
    var instrucaoSql = `
        INSERT INTO fale_conosco (email) VALUES ('${email}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}


module.exports = {
    enviar
};