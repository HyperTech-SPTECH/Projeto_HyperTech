var contentArea = document.getElementById('main-content');

// loadComponent("./dashboard/date-hour-dashboard.html")

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
            pullInformationFromFilters()
        }
    }
}

document.getElementById('btn-dashboard').addEventListener('click', handleNavClick);
document.getElementById('btn-rotas').addEventListener('click', handleNavClick);
// document.getElementById('btn-cad-func').addEventListener('click', handleNavClick);

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('./dashboard/date-hour-dashboard.html');
    pullInformationFromFilters()
});

function trocarDashRegiao() {
    loadComponent('./dashboard/region-dashboard.html');
    pullInformationFromFilters()
}

function trocarDashHoraDia() {
    loadComponent('./dashboard/date-hour-dashboard.html');
    pullInformationFromFilters()
}