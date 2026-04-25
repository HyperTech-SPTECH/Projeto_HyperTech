function sairTelaDashboard() {
    sessionStorage.clear()

    setTimeout(() => {
        window.location = 'index.html'
    }, 500);
}

function alterarTela(ev) {
    let evAtual = ev.target
    let classesAtuais = evAtual.className
    if (!classesAtuais.includes("optionNav")) {
        evAtual = evAtual.parentElement
    }

    // Trocando o selecionado do NavBar
    let navBar = document.getElementById('idNavLeftBar')
    for (let i = 0; i < navBar.children.length; i++) {
        navBar.children[i].classList.remove('optionSelecioned')
    }
    document.getElementById(evAtual.id).classList.add('optionSelecioned')

    // Trocando a Tela que está aparecendo
    let telas = document.getElementById('idConteudo')
    for (let i = 0; i < telas.children.length; i++) {
        telas.children[i].style.display = 'none'
    }
    let telaCerta = "idTela" + evAtual.id.split('idOption')[1]
    document.getElementById(telaCerta).style.display = 'block'
}

document.getElementById('idOptionDashboard').addEventListener('click', alterarTela)
document.getElementById('idOptionRotas').addEventListener('click', alterarTela)
document.getElementById('idOptionCadFunc').addEventListener('click', alterarTela)