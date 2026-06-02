function showConfirmChangeNotification(textMessage, activate = false) {
    if(document.getElementById('idModalConfirmActiveDeactivateNotification')) {
        console.log('aqui')
        return;
    }

    let modal = document.createElement('section')
    modal.id = 'idModalConfirmActiveDeactivateNotification'

    let divZoneNotification = document.createElement('div')
    divZoneNotification.classList.add('zoneNotification')
    if (activate) {
        divZoneNotification.classList.add('zoneNotificationActivate')
    } else {
        divZoneNotification.classList.add('zoneNotificationDeactivate')
    }

    let divTextNotification = document.createElement('div')
    divTextNotification.classList.add('textNotification')

    let spanTextNotification = document.createElement('span')
    spanTextNotification.textContent = textMessage

    divTextNotification.appendChild(spanTextNotification)

    let divButtonsNotification = document.createElement('div')
    divButtonsNotification.classList.add('buttons-remove-cancel')

    let spanCancelConfirmNotification = document.createElement('span')
    spanCancelConfirmNotification.id = 'idCancelConfirmNotification'
    spanCancelConfirmNotification.textContent = 'Cancelar'
    spanCancelConfirmNotification.onclick = cancelChangeNotification
    
    let spanConfirmConfirmNotification = document.createElement('span')
    spanConfirmConfirmNotification.id = 'idConfirmConfirmNotification'
    spanConfirmConfirmNotification.textContent = 'Confirmar'
    
    divButtonsNotification.appendChild(spanCancelConfirmNotification)
    divButtonsNotification.appendChild(spanConfirmConfirmNotification)

    modal.appendChild(divZoneNotification)
    modal.appendChild(divTextNotification)
    modal.appendChild(divButtonsNotification)

    document.querySelector('.configuration-panel').appendChild(modal)
}

function pullDeactivateConfirmChangeNotificationDiaria() {
    showConfirmChangeNotification('Realmente deseja desativar a Notificação Diária para todos os emails cadastrados')
}

function pullActivateConfirmChangeNotificationDiaria() {
    showConfirmChangeNotification('Realmente deseja ativar a Notificação Diária para todos os emails cadastrados', true)
}

function pullDeactivateConfirmChangeNotificationSemanal() {
    showConfirmChangeNotification('Realmente deseja desativar a Notificação Semanal para todos os emails cadastrados')
}

function pullActivateConfirmChangeNotificationSemanal() {
    showConfirmChangeNotification('Realmente deseja ativar a Notificação Semanal para todos os emails cadastrados', true)
}

function pullDeactivateConfirmChangeNotificationAnual() {
    showConfirmChangeNotification('Realmente deseja desativar a Notificação Anual para todos os emails cadastrados')
}

function pullActivateConfirmChangeNotificationAnual() {
    showConfirmChangeNotification('Realmente deseja ativar a Notificação Anual para todos os emails cadastrados', true)
}

function cancelChangeNotification() {
    let modal = document.getElementById('idModalConfirmActiveDeactivateNotification')
    document.querySelector('.configuration-panel').removeChild(modal)
}