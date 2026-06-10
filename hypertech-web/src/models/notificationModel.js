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

async function remover(userId, emailId) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function remover():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSql01 = `
        DELETE FROM preferencias_notificacao WHERE usuario_email_id = '${emailId}';
    `
    await database.mysqlExecutar(instrucaoSql01)

    var instrucaoSql02 = `
        DELETE FROM usuario_email_notificacao WHERE id = '${emailId}';
    `
    await database.mysqlExecutar(instrucaoSql02)

    var instrucaoSql03 = `
        SELECT eNotificacao.id as emailN_id, eNotificacao.email as emailN, preferencias.id as tipoNotificacao_id, preferencias.tipo as tipoNotificacao, preferencias.ativo as ativoTipoNotificacao FROM usuario JOIN usuario_email_notificacao as eNotificacao ON usuario.usuario_id = eNotificacao.usuario_id JOIN preferencias_notificacao as preferencias ON eNotificacao.id = preferencias.usuario_email_id WHERE usuario.usuario_id = '${userId}';
    `
    
    return await database.mysqlExecutar(instrucaoSql03);
}

async function criar(id, email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function criar():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados
    var instrucaoSql01 = `
    INSERT INTO usuario_email_notificacao (usuario_id, email) VALUES ('${id}', '${email}');
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

    var instrucaoSql04 = `
    SELECT eNotificacao.id as emailN_id, eNotificacao.email as emailN, preferencias.id as tipoNotificacao_id, preferencias.tipo as tipoNotificacao, preferencias.ativo as ativoTipoNotificacao FROM usuario JOIN usuario_email_notificacao as eNotificacao ON usuario.usuario_id = eNotificacao.usuario_id JOIN preferencias_notificacao as preferencias ON eNotificacao.id = preferencias.usuario_email_id WHERE usuario.usuario_id = '${id}';
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSql04);
    return await database.mysqlExecutar(instrucaoSql04);
}

async function alterarCurrentEmail(email, nDiaria, nSemanal, nAnual, enviarN) {

    // PEGAR ID
    var instrucaoSqlId = `
    SELECT id, usuario_id FROM usuario_email_notificacao WHERE email = '${email}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlId);
    let resultId = await database.mysqlExecutar(instrucaoSqlId);

    // DIARIA
    var instrucaoSqlDiaria = `
    UPDATE preferencias_notificacao SET ativo = '${nDiaria}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'DIARIA';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlDiaria);
    let result01 = await database.mysqlExecutar(instrucaoSqlDiaria);

    // SEMANAL
    var instrucaoSqlSemanal = `
    UPDATE preferencias_notificacao SET ativo = '${nSemanal}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'SEMANAL';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlSemanal);
    let result02 = await database.mysqlExecutar(instrucaoSqlSemanal);

    // ANUAL
    var instrucaoSqlAnual = `
    UPDATE preferencias_notificacao SET ativo = '${nAnual}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'ANUAL';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSqlAnual);
    let result03 = await database.mysqlExecutar(instrucaoSqlAnual);

    // ENVIAR EMAIL - TODOS
    // DIARIA - ENVIAR EMAIL
    if (enviarN == 0) {
        var instrucaoSqlDiariaTodos = `
        UPDATE preferencias_notificacao SET ativo = '${enviarN}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'DIARIA';
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSqlDiariaTodos);
        let result01Todos = await database.mysqlExecutar(instrucaoSqlDiariaTodos);
    
        // SEMANAL - ENVIAR EMAIL
        var instrucaoSqlSemanalTodos = `
        UPDATE preferencias_notificacao SET ativo = '${enviarN}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'SEMANAL';
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSqlSemanalTodos);
        let result02Todos = await database.mysqlExecutar(instrucaoSqlSemanalTodos);
    
        // ANUAL - ENVIAR EMAIL
        var instrucaoSqlAnualTodos = `
        UPDATE preferencias_notificacao SET ativo = '${enviarN}' WHERE usuario_email_id = '${resultId[0].id}' AND tipo = 'ANUAL';
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSqlAnualTodos);
        let result03Todos = await database.mysqlExecutar(instrucaoSqlAnualTodos);
    }

    var instrucaoSqlSelect = `
    SELECT eNotificacao.id as emailN_id, eNotificacao.email as emailN, preferencias.id as tipoNotificacao_id, preferencias.tipo as tipoNotificacao, preferencias.ativo as ativoTipoNotificacao FROM usuario JOIN usuario_email_notificacao as eNotificacao ON usuario.usuario_id = eNotificacao.usuario_id JOIN preferencias_notificacao as preferencias ON eNotificacao.id = preferencias.usuario_email_id WHERE usuario.usuario_id = '${resultId[0].usuario_id}';
    `
    console.log("Executando a instrução SQL: \n" + instrucaoSqlSelect);
    return await database.mysqlExecutar(instrucaoSqlSelect);
}

async function alterarN(userId, tipoN, ativoN) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function alterarN():",);
    
    // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
    //  e na ordem de inserção dos dados.
    var instrucaoSqlId = `
        SELECT id FROM usuario_email_notificacao WHERE usuario_id = '${userId}';
    `
    let resultId = await database.mysqlExecutar(instrucaoSqlId)

    for (let i = 0; i < resultId.length; i++) {
        await database.mysqlExecutar(`UPDATE preferencias_notificacao SET ativo = '${ativoN}' WHERE usuario_email_id = '${resultId[i].id}' AND tipo = '${tipoN}'`)
    }

    var instrucaoSqlSelectAll = `
        SELECT eNotificacao.id as emailN_id, eNotificacao.email as emailN, preferencias.id as tipoNotificacao_id, preferencias.tipo as tipoNotificacao, preferencias.ativo as ativoTipoNotificacao FROM usuario JOIN usuario_email_notificacao as eNotificacao ON usuario.usuario_id = eNotificacao.usuario_id JOIN preferencias_notificacao as preferencias ON eNotificacao.id = preferencias.usuario_email_id WHERE usuario.usuario_id = '${userId}';
    `
    
    return await database.mysqlExecutar(instrucaoSqlSelectAll);
}

module.exports = {
    criacao,
    remover,
    criar,
    alterarCurrentEmail,
    alterarN
};