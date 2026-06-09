// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var profileRouter = require("./src/routes/profileRoute");
var filtrosRouter = require("./src/routes/filtros");
var rotasRouter = require("./src/routes/rotas");
var dashboardRouter = require("./src/routes/dashboard")
var notificationRouter = require("./src/routes/notificationRoute");
var emailRouter = require("./src/routes/emailRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public"), { index: 'index.html' }));

app.use(cors());

// Aumentando o limite de tráfego da API para comportar payloads GeoJSON de até 50 MB, preicsa disso para o editar rotas favoritas funcionar
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/profile", profileRouter);
app.use("/filtros", filtrosRouter);
app.use("/rotas", rotasRouter);
app.use("/dashboard", dashboardRouter);
app.use("/notification", notificationRouter);
app.use("/email", emailRouter);

app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    `)
});
