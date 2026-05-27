function pullInformationFromFilters() {
    fetch('dashboard/infoFiltrar', {
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
    let cityFilter = []
    for (i = 0; i < allTheData.length; i++) {
        let exist = false;
        console.log(allTheData[i])
        for (j = 0; j < cityFilter.length; j++) {
            if (allTheData[i].cidade == cityFilter[j]) {
                exist = true;
            }
        }
        if (!exist) {
            cityFilter.push(allTheData[i].cidade)
            document.getElementById
        }
    }
    console.log("Todas as city:\n");
    console.log(cityFilter);

    return false
}

// function transformListOfStringInListOfObject(listString) {
//     listAuxiliar = []
//     stringAuxiliar = ''
//     for (i = 0; i < listString.length; i++) {
//         if (listString[i] == '[' || listString[i] == ']' || listString[i] == ',' || listString[i] == '{' || listString[i] == '}') {
//             if (stringAuxiliar.length != 0)  {
//                 listAuxiliar.push(JSON.stringify(stringAuxiliar))
//             }
//             stringAuxiliar = ''
//             continue;
//             console.log('aqui')
//         } else {
//             stringAuxiliar += listString[i];
//         }
//     }

//     return listAuxiliar
// }