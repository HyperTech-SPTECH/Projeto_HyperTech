let allTheDataAll = []
let cityFilters = []
let monthFilters = []

async function pullInformationFromFilters() {
    await fetch('dashboard/infoFiltrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }        
    })
        .then(function (resposta) {
            if (resposta.ok) {
                console.log("Dados chegou ok!");
                resposta.json().then(json => {
                    sessionStorage.DATA_FILTERS = JSON.stringify(json)
                })
            } else {
                alert('Houve um erro para chegar dados de filtros')
                console.log('Houve um erro para chegar dados de filtros')
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`)
        })

    // Colocar dados nos filtros
    // Cidades
    let allTheData = JSON.parse(sessionStorage.DATA_FILTERS)
    allTheDataAll = allTheData
    // City
    cityFilters = functionFilterCity(allTheData)
    functionIncludeDataInTheCityFilter(cityFilters)
    
    // Bairro acontece quando troca a Cidade

    // Month
    monthFilters = functionFilterMeses()

    return false
}

// Filtros de Cidade
function functionFilterCity(data) {
    let listAuxiliarFunction = []
    for (let i = 0; i < data.length; i++) {
        let exist = false;
        for (let j = 0; j < listAuxiliarFunction.length; j++) {
            if (data[i].cidade == listAuxiliarFunction[j]) {
                exist = true;
            }
        }
        if (!exist) {
            listAuxiliarFunction.push(data[i].cidade)
        }
    }
    
    return listAuxiliarFunction
}

// Colocar filtros da Cidade
function functionIncludeDataInTheCityFilter(citys) {
    let containerFilter = document.getElementById('idContainerFiltroCidade')
    console.log(containerFilter)
    let span = document.createElement('span')
    span.textContent = 'Cidade:'
    let filter = document.createElement('select')
    filter.id = 'idSelectFiltroCidade'
    filter.onchange = filterBairroAndMonth

    let options = []

    let option = document.createElement('option')
    option.value = '#'
    option.textContent = 'Todas as Cidades'
    option.selected = true
    option.disabled = true
    filter.appendChild(option)
    for (let i = 0; i < citys.length; i++) {
        option = document.createElement('option')
        option.value = citys[i]

        // Padronização
        let newItem = ''
        let cityAtual = citys[i]
        let podeTerMaiuscula = false
        for (let i = 0; i < cityAtual.length; i++) {
            if (i == 0) {
                newItem += cityAtual[i].toUpperCase()
                continue
            }
            if (podeTerMaiuscula) {
                newItem += cityAtual[i].toUpperCase()
                podeTerMaiuscula = false
                continue
            }
            if (cityAtual[i] == ' ' || cityAtual[i] == ',' || cityAtual[i] == '.') {
                podeTerMaiuscula = true
            }
            newItem += cityAtual[i]
        }
        option.textContent = newItem
        filter.appendChild(option)
    }

    // while (containerFilter.firstElementChild) {
    //     containerFilter.removeChild(containerFilter.firstElementChild)
    // }
    containerFilter.innerHTML = ''
    containerFilter.appendChild(span)
    containerFilter.append(filter)
}

// Filtros de Bairro
function functionFilterBairro() {
    let cityAtual = document.getElementById('idSelectFiltroCidade').value
    let listAuxiliarFunction = []
    for (let i = 0; i < allTheDataAll.length; i++) {
        if (allTheDataAll[i].cidade == cityAtual) {
            listAuxiliarFunction.push(allTheDataAll[i].bairro)
        }
    }

    functionIncludeDataInTheBairroFilter(listAuxiliarFunction)
    
    return listAuxiliarFunction
}

// Colocar filtros do Bairro
function functionIncludeDataInTheBairroFilter(bairros) {
    let containerFilter = document.getElementById('idContainerFiltroBairro')
    console.log(containerFilter)
    let span = document.createElement('span')
    span.textContent = 'Bairro:'
    let filter = document.createElement('select')
    filter.id = 'idSelectFiltroBairro'
    filter.onchange = functionFilterMeses

    let options = []

    let option = document.createElement('option')
    option.value = '#'
    option.textContent = 'Todos os Bairros'
    option.selected = true
    option.disabled = true
    filter.appendChild(option)
    for (let i = 0; i < bairros.length; i++) {
        option = document.createElement('option')
        option.value = bairros[i]

        // Padronização
        let newItem = ''
        let bairroAtual = bairros[i]
        let podeTerMaiuscula = false
        if (bairroAtual != null) {
            for (let i = 0; i < bairroAtual.length; i++) {
                if (i == 0) {
                    newItem += bairroAtual[i].toUpperCase()
                    continue
                }
                if (podeTerMaiuscula) {
                    newItem += bairroAtual[i].toUpperCase()
                    podeTerMaiuscula = false
                    continue
                }
                if (bairroAtual[i] == ' ' || bairroAtual[i] == ',' || bairroAtual[i] == '.') {
                    podeTerMaiuscula = true
                }
                newItem += bairroAtual[i]
            }
            option.textContent = newItem
            filter.appendChild(option)
        }
    }

    containerFilter.innerHTML = ''
    containerFilter.appendChild(span)
    containerFilter.append(filter)
}

// Filtros de meses
function functionFilterMeses() {
    let cityAtual = document.getElementById('idSelectFiltroCidade').value
    let bairroAtual = document.getElementById('idSelectFiltroBairro').value
    let listAuxiliarFunction = []
    for (let i = 0; i < allTheDataAll.length; i++) {
        if (
            (allTheDataAll[i].cidade == cityAtual || cityAtual == '#') && 
            (allTheDataAll[i].bairro == bairroAtual || bairroAtual == '#')
        ) {
            let exist = false;
            for (let j = 0; j < listAuxiliarFunction.length; j++) {
                if (allTheDataAll[i].mes == listAuxiliarFunction[j]) {
                    exist = true;
                }
            }
            if (!exist) {
                listAuxiliarFunction.push(allTheDataAll[i].mes)
            }
        }
    }

    functionIncludeDataInTheMonthFilter(listAuxiliarFunction)

    return listAuxiliarFunction
}

// Colocar filtros do Mes
function functionIncludeDataInTheMonthFilter(meses) {
    let containerFilter = document.getElementById('idContainerFiltroMes')
    console.log(containerFilter)
    let span = document.createElement('span')
    span.textContent = 'Mês:'
    let filter = document.createElement('select')
    filter.id = 'idSelectFiltroMes'

    let options = []

    let option = document.createElement('option')
    option.value = '#'
    option.textContent = 'Todos os Meses'
    option.selected = true
    option.disabled = true
    filter.appendChild(option)
    for (let i = 0; i < meses.length; i++) {
        option = document.createElement('option')
        option.value = meses[i]
        option.textContent = meses[i]
        filter.appendChild(option)
    }

    containerFilter.innerHTML = ''
    containerFilter.appendChild(span)
    containerFilter.append(filter)
    functionPadronizarMeses()
}

function functionPadronizarMeses() {
    let meses = document.getElementById('idSelectFiltroMes').childNodes
    let valor = ''
    for (let i = 0; i < meses.length; i++) {
        switch (meses[i].value) {
            case '1':
                valor = 'Janeiro'
                break
            case '2':
                valor = 'Fevereiro'
                break
            case '3':
                valor = 'Março'
                break
            case '4':
                valor = 'Abril'
                break
            case '5':
                valor = 'Maio'
                break
            case '6':
                valor = 'Junho'
                break
            case '7':
                valor = 'Julho'
                break
            case '8':
                valor = 'Agosto'
                break
            case '9':
                valor = 'Setembro'
                break
            case '10':
                valor = 'Outubro'
                break
            case '11':
                valor = 'Novembro'
                break
            case '12':
                valor = 'Dezembro'
                break
            default:
                valor = 'Todos os Meses'
        }
        meses[i].textContent = valor
    }
}

function filterBairroAndMonth() {
    functionFilterBairro()
    functionFilterMeses()
}