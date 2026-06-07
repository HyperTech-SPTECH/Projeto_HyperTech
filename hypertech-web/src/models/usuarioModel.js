var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
        SELECT  usuario.usuario_id,  usuario.nome,  usuario.email,  usuario.senha,  usuario.cargo_id,  usuario.data_criacao,  empresa.nome as nome_empresa,  empresa.cnpj,  empresa.telefone,  empresa.email as email_empresa,  empresa.data_cadastro, eNotificacao.id as emailN_id, eNotificacao.email as emailN, preferencias.id as tipoNotificacao_id, preferencias.tipo as tipoNotificacao, preferencias.ativo as ativoTipoNotificacao FROM usuario JOIN empresa ON usuario.empresa_id = empresa.empresa_id JOIN usuario_email_notificacao as eNotificacao ON usuario.usuario_id = eNotificacao.usuario_id JOIN preferencias_notificacao as preferencias ON eNotificacao.id = preferencias.usuario_email_id WHERE usuario.email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
}

// Coloque os mesmos parâmetros aqui. Vá para a var instrucaoSql
async function cadastrar(nome, email, cnpj, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nome, email, senha);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
   var idEmpresa = await database.mysqlExecutar(`Select empresa_id from empresa where cnpj = '${cnpj}'`);
    console.log("Estou aqui" + idEmpresa);
   if(idEmpresa.length > 0){
          var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, empresa_id, cargo_id) VALUES ('${nome}', '${email}', '${senha}', '${idEmpresa[0].empresa_id}', 1);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.mysqlExecutar(instrucaoSql);
   } else {
    console.log("cnpj não existe");
   }
  
}


module.exports = {
    autenticar,
    cadastrar
};