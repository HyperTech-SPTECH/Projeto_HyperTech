let allTheDataAll = []
let cityFilters = []

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
                    // Converter para string
                    // listAuxiliarJson = transformListOfStringInListOfObject(JSON.stringify(json))
                    // console.log(JSON.stringify(json))
                    // console.log(listAuxiliarJson)
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

    return false
}

// Filtros de Cidade
function functionFilterCity(data) {
    let listAuxiliarFunction = []
    let listAuxiliarFunction2 = []
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
    filter.onchange = functionFilterBairro

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
        option.textContent = citys[i]
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
        option.textContent = bairros[i]
        filter.appendChild(option)
    }

    // while (containerFilter.firstElementChild) {
    //     containerFilter.removeChild(containerFilter.firstElementChild)
    // }
    containerFilter.innerHTML = ''
    containerFilter.appendChild(span)
    containerFilter.append(filter)
}