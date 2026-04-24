const contentArea = document.getElementById('main-content');

async function loadComponent(fileName) {
    try {
        contentArea.innerHTML = '<p>Carregando...</p>';
        
        const response = await fetch(fileName);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const html = await response.text();
        contentArea.innerHTML = html;

        if (fileName.includes('date-hour-dashboard.html')) {
            if (typeof renderHeatmap === 'function') {
                renderHeatmap();
            }
        }
        
    } catch (error) {
        console.error("Error loading component:", error);
        contentArea.innerHTML = '<p>Erro ao carregar o conteúdo. Por favor, tente novamente.</p>';
    }
}

function handleNavClick(ev) {
    let evAtual = ev.target;
    
    if (!evAtual.classList.contains("nav-button")) {
        evAtual = evAtual.closest('.nav-button');
    }

    let navBar = document.getElementById('sidebar-nav');
    for (let i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('nav-button--selected');
    }
    evAtual.classList.add('nav-button--selected');

    let targetFile = "";
    if (evAtual.id === "btn-dashboard") {
        targetFile = "./dashboard/date-hour-dashboard.html";
    } else if (evAtual.id === "btn-rotas") {
        targetFile = "./route.html";
    } else if (evAtual.id === "btn-cad-func") {
        targetFile = "./add-user.html";
    }

    if(targetFile) {
        loadComponent(targetFile);
    }
}

document.getElementById('btn-dashboard').addEventListener('click', handleNavClick);
document.getElementById('btn-rotas').addEventListener('click', handleNavClick);
document.getElementById('btn-cad-func').addEventListener('click', handleNavClick);

document.addEventListener('DOMContentLoaded', () => {
    loadComponent('./dashboard/date-hour-dashboard.html');
});