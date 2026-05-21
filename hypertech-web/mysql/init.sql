/* ====================================================================
   TABELAS DE SISTEMA (MYSQL)
   ==================================================================== */

CREATE TABLE empresa (
    empresa_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone VARCHAR(18),
    email VARCHAR(255) UNIQUE,
    data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cargo (
    cargo_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

CREATE TABLE permissao (
    permissao_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

CREATE TABLE cargo_permissao (
    cargo_id INT NOT NULL,
    permissao_id INT NOT NULL,
    data_permissao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (cargo_id, permissao_id),
    FOREIGN KEY (cargo_id) REFERENCES cargo(cargo_id) ON DELETE CASCADE,
    FOREIGN KEY (permissao_id) REFERENCES permissao(permissao_id) ON DELETE CASCADE
);

CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    cargo_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_recuperacao_senha VARCHAR(255),
    token_expiracao TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES empresa(empresa_id),
    FOREIGN KEY (cargo_id) REFERENCES cargo(cargo_id)
);
