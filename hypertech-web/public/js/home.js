var contentArea = document.getElementById('main-content');

async function loadComponent(fileName) {
    try {
        contentArea.innerHTML = '<p>Carregando...</p>';
        var response = await fetch(fileName);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        var html = await response.text();
        contentArea.innerHTML = html;

        if (fileName.includes('route.html')) {
            if (typeof renderSistemaRotas === 'function') renderSistemaRotas();
        }

        if (fileName.includes('date-hour-dashboard.html')) {
            if (typeof iniciarDashboardDiaHora === 'function') iniciarDashboardDiaHora();
            
        }

        if(fileName.includes('region-dashboard.html')){
            if(typeof renderGraficoCargas === 'function') renderGraficoCargas();
        }
        
    } catch (error) {
        console.error("Error loading component:", error);
        contentArea.innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, tente novamente.</p>';
    }
}

function handleNavClick(ev) {
    var evAtual = ev.target;

    if (!evAtual.classList.contains("nav-button")) {
        evAtual = evAtual.closest('.nav-button');
    }

    var navBar = document.querySelector('.sidebar-nav');
    for (var i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('nav-button--selected');
    }
    evAtual.classList.add('nav-button--selected');

    let targetFile = "";
    let dashboardFilters = false;
    if (evAtual.id === "btn-dashboard") {
        targetFile = "./dashboard/date-hour-dashboard.html";
        dashboardFilters = true
    } else if (evAtual.id === "btn-rotas") {
        targetFile = "./route.html";
    } else if (evAtual.id === "btn-cad-func") {
        targetFile = "./add-user.html";
    }

    if(targetFile) {
        loadComponent(targetFile);
        if (dashboardFilters) {
            setTimeout(() => {
                includeFiltersInDash()
                listarFiltrosUsuario()
            }, 200);
        }
    }
}

document.getElementById('btn-dashboard').addEventListener('click', handleNavClick);
document.getElementById('btn-rotas').addEventListener('click', handleNavClick);
document.getElementById('btn-cad-func').addEventListener('click', (ev) => {
    handleNavClick(ev)
    podeEstarAqui()
});

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('./dashboard/date-hour-dashboard.html');
    setTimeout(() => {
        includeFiltersInDash()
        listarFiltrosUsuario()
    }, 200);
});

function trocarDashRegiao() {
    loadComponent('./dashboard/region-dashboard.html');
    setTimeout(() => {
        includeFiltersInDash()
        listarFiltrosUsuario();
    }, 200);
}

function trocarDashHoraDia() {
    loadComponent('./dashboard/date-hour-dashboard.html');
    setTimeout(() => {
        includeFiltersInDash();
        listarFiltrosUsuario();
    }, 200);
}

function trocarProfileDash() {
    loadComponent('./dashboard/profile-dashboard.html');

    var navBar = document.querySelector('.sidebar-nav');
    for (var i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('nav-button--selected');
    }
    
    setTimeout(() => {
        document.getElementById('idInputNomeUser').value = sessionStorage.NOME_USUARIO
        document.getElementById('idInputEmailUser').value = sessionStorage.EMAIL_USUARIO
        document.getElementById('idInputSenhaUser').value = '**********'
        let data = sessionStorage.getItem('DT_CRIACAO_USUARIO')
        let novaData = new Date(data)
        document.getElementById('idInputDtCricaoUser').value = novaData.toLocaleDateString('pt-BR');
        document.getElementById('idInputNomeEmpresa').value = sessionStorage.NOME_EMPRESA
        document.getElementById('idInputCnpjEmpresa').value = sessionStorage.CNPJ_EMPRESA
        document.getElementById('idInputEmailEmpresa').value = sessionStorage.EMAIL_EMPRESA
        document.getElementById('idInputTelefoneEmpresa').value = sessionStorage.TELEFONE_EMPRESA
        let dataEmpresa = sessionStorage.getItem('DT_CADASTRO_EMPRESA')
        let novaDataEmpresa = new Date(dataEmpresa)
        document.getElementById('idInputDtCriadoEmpresa').value = novaDataEmpresa.toLocaleDateString('pt-BR');
        document.getElementById('idButtons').style.display = 'none'

    }, 500)
}

function trocarNotificationDash() {
    loadComponent('./dashboard/notification-dashboard.html');

    var navBar = document.querySelector('.sidebar-nav');
    for (var i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('nav-button--selected');
    }
    setTimeout(() => {
        organizerScreenNotification()
    }, 200);
}

function trocarFiltroDash() {
    loadComponent('./dashboard/filter-config.html');

    var navBar = document.querySelector('.sidebar-nav');
    for (var i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('nav-button--selected');
    }

    console.log("Injetando rotinas e buscando dados do Postgres/MySQL...");
    
    if (typeof carregarOpcoesFiltros === 'function') {
        carregarOpcoesFiltros();
    } else {
        console.error("Função carregarOpcoesFiltros não encontrada. Verifique se o filter.js está importado na home.html");
    }

    if (typeof atualizarTabelaFiltros === 'function') {
        atualizarTabelaFiltros();
    }
    setTimeout(() => {
        organizerScreenNotification()
    }, 50);
}

document.getElementById('button-menu').addEventListener('click', () => {
    document.getElementById('dropdown-menu').classList.toggle('displayNone')
})

function verifyRole() {
    let role = sessionStorage.getItem('CARGO_USUARIO')

    if (role != 1) {
        document.getElementById('btn-cad-func').style.display = 'none'
    }
}

function logoutDashboard() {
    sessionStorage.clear()
    setTimeout(function () {
        window.location = "./index.html";
    }, 200); // apenas para exibir o loading
}