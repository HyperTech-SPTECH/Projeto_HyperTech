var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT usuario_id, nome, email, senha, cargo_id FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
async function cadastrar(nome, email, cnpj, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
   var idEmpresa = await database.executar(`Select empresa_id from empresa where cnpj = '${cnpj}'`);
    console.log("Estou aqui" + idEmpresa);
   if(idEmpresa.length > 0){
          var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, empresa_id, cargo_id) VALUES ('${nome}', '${email}', '${senha}', '${idEmpresa[0].empresa_id}', 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
   } else {
    console.log("cnpj não existe");
   }
  
}


module.exports = {
    autenticar,
    cadastrar
};