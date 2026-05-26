const { Pool } = require('pg');

const pool = new Pool ({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

pool.connect((error, client, release) => {
    if (error) {
        console.error("ERRO ao conectar ao PostgreSQL!", error.message);
    } else { 
        console.log("PostgreSQL conectado!"); release(); 
    }
});

function executar(instrucao) {
    if (process.env.AMBIENTE_PROCESSO !== "producao" && process.env.AMBIENTE_PROCESSO !== "desenvolvimento") {
        console.log("\nO AMBIENTE (produção OU desenvolvimento) NÃO FOI DEFINIDO EM .env OU dev.env OU app.js\n");
        return Promise.reject("AMBIENTE NÃO CONFIGURADO EM .env");
    }
    
    return new Promise(function (resolve, reject) {
        pool.query(instrucao)
        .then(resultado => {
            console.log(resultado.rows);
            resolve(resultado.rows);
        })
        .catch(erro => {
            console.error("ERRO POSTGRES:", erro)
            reject(erro);
        })
    });
}

module.exports = {
    executar,
    pool
};