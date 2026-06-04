function showConfirmChangeNotification(textMessage, activate = false) {
    if (document.getElementById('idModalEditCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalCreateNewEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmRemoveCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmActiveDeactivateNotification')) {
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

function confirmRemoveCurrentEmail(currentEmail) {
    if (document.getElementById('idModalEditCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalCreateNewEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmRemoveCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmActiveDeactivateNotification')) {
        console.log('aqui')
        return;

    }

    let modal = document.createElement('section')
    modal.id = 'idModalConfirmRemoveCurrentEmail'

    let containerModal = document.createElement('section')
    containerModal.classList.add('containerModalConfirmRemoveCurrentEmail')

    let divZoneCurrentEmail = document.createElement('div')
    divZoneCurrentEmail.classList.add('zoneCurrentEmail')

    let divTextTitleCurrentEmail = document.createElement('div')
    divTextTitleCurrentEmail.classList.add('textTitleCurrentEmail')

    let spanTextTitleCurrentEmail = document.createElement('span')
    spanTextTitleCurrentEmail.textContent = 'Realmente deseja remover o Email abaixo?'

    divTextTitleCurrentEmail.appendChild(spanTextTitleCurrentEmail)

    let divTextEmailCurrentEmail = document.createElement('div')
    divTextEmailCurrentEmail.classList.add('textEmailCurrentEmail')

    let spanTextEmailCurrentEmail = document.createElement('span')
    spanTextEmailCurrentEmail.textContent = currentEmail

    divTextEmailCurrentEmail.appendChild(spanTextEmailCurrentEmail)



    let divButtonsCurrentEmail = document.createElement('div')
    divButtonsCurrentEmail.classList.add('buttons-remove-cancel')

    let spanCancelConfirmCurrentEmail = document.createElement('span')
    spanCancelConfirmCurrentEmail.id = 'idCancelConfirmCurrentEmail'
    spanCancelConfirmCurrentEmail.textContent = 'Cancelar'
    spanCancelConfirmCurrentEmail.onclick = cancelRemoveCurrentEmail
    
    let spanConfirmConfirmCurrentEmail = document.createElement('span')
    spanConfirmConfirmCurrentEmail.id = 'idConfirmConfirmNotification'
    spanConfirmConfirmCurrentEmail.textContent = 'Confirmar'
    
    divButtonsCurrentEmail.appendChild(spanCancelConfirmCurrentEmail)
    divButtonsCurrentEmail.appendChild(spanConfirmConfirmCurrentEmail)

    containerModal.appendChild(divZoneCurrentEmail)
    containerModal.appendChild(divTextTitleCurrentEmail)
    containerModal.appendChild(divTextEmailCurrentEmail)
    containerModal.appendChild(divButtonsCurrentEmail)

    modal.appendChild(containerModal)

    document.querySelector('.configuration-panel').appendChild(modal)
}

function cancelRemoveCurrentEmail() {
    let modal = document.getElementById('idModalConfirmRemoveCurrentEmail')
    document.querySelector('.configuration-panel').removeChild(modal)
}

function modalCreateNewEmail() {
    if (document.getElementById('idModalEditCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalCreateNewEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmRemoveCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmActiveDeactivateNotification')) {
        console.log('aqui')
        return;

    }

    let modal = document.createElement('section')
    modal.id = 'idModalCreateNewEmail'

    let divZoneCreateEmail = document.createElement('div')
    divZoneCreateEmail.classList.add('zoneCreateEmail')

    let divTextCreateEmail = document.createElement('div')
    divTextCreateEmail.classList.add('textCreateEmail')

    let labelTextCreateEmail = document.createElement('label')
    labelTextCreateEmail.htmlFor = 'idTextCreateEmail'
    labelTextCreateEmail.textContent = 'Digite um novo Email'
    let inputTextCreateEmail = document.createElement('input')
    inputTextCreateEmail.id = 'idTextCreateEmail'
    inputTextCreateEmail.type = 'text'
    inputTextCreateEmail.oniput = valEmail
    let spanTextCreateEmail = document.createElement('span')
    spanTextCreateEmail.id = 'idMsgWarn'

    divTextCreateEmail.appendChild(labelTextCreateEmail)
    divTextCreateEmail.appendChild(inputTextCreateEmail)
    divTextCreateEmail.appendChild(spanTextCreateEmail)

    let divButtonsCreateEmail = document.createElement('div')
    divButtonsCreateEmail.classList.add('buttons-remove-cancel')

    let spanCancelConfirmCreateEmail = document.createElement('span')
    spanCancelConfirmCreateEmail.id = 'idCancelConfirmCreateEmail'
    spanCancelConfirmCreateEmail.textContent = 'Cancelar'
    spanCancelConfirmCreateEmail.onclick = cancelCreateNewEmail
    
    let spanConfirmConfirmCreateEmail = document.createElement('span')
    spanConfirmConfirmCreateEmail.id = 'idConfirmConfirmCreateEmail'
    spanConfirmConfirmCreateEmail.textContent = 'Adicionar'
    
    divButtonsCreateEmail.appendChild(spanCancelConfirmCreateEmail)
    divButtonsCreateEmail.appendChild(spanConfirmConfirmCreateEmail)

    modal.appendChild(divZoneCreateEmail)
    modal.appendChild(divTextCreateEmail)
    modal.appendChild(divButtonsCreateEmail)

    document.querySelector('.configuration-panel').appendChild(modal)
}

function cancelCreateNewEmail() {
    let modal = document.getElementById('idModalCreateNewEmail')
    document.querySelector('.configuration-panel').removeChild(modal)
}

function modalEditCurrentEmail(currentEmail) {
    if (document.getElementById('idModalEditCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalCreateNewEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmRemoveCurrentEmail')) {
        console.log('aqui')
        return;

    } else if (document.getElementById('idModalConfirmActiveDeactivateNotification')) {
        console.log('aqui')
        return;

    }

    let modal = document.createElement('section')
    modal.id = 'idModalEditCurrentEmail'

    let containerModal = document.createElement('div')
    containerModal.classList.add('containerModalEditCurrentEmail')

    let divZoneEditCurrentEmail = document.createElement('div')
    divZoneEditCurrentEmail.classList.add('zoneEditCurrentEmail')

    let divTextTitleEditCurrentEmail = document.createElement('div')
    divTextTitleEditCurrentEmail.classList.add('textTitleEditCurrentEmail')
    let spanTextTitleEditCurrentEmail = document.createElement('span')
    spanTextTitleEditCurrentEmail.textContent = 'Modifique as configurações do Email abaixo'

    divTextTitleEditCurrentEmail.appendChild(spanTextTitleEditCurrentEmail)
    
    let divTextEmailEditCurrentEmail = document.createElement('div')
    divTextEmailEditCurrentEmail.classList.add('textEmailEditCurrentEmail')
    let spanTextEmailEditCurrentEmail = document.createElement('span')
    spanTextEmailEditCurrentEmail.textContent = currentEmail

    divTextEmailEditCurrentEmail.appendChild(spanTextEmailEditCurrentEmail)

    let divContainerEditCurrentEmail = document.createElement('div')
    divContainerEditCurrentEmail.classList.add('containerEditCurrentEmail')

    // 1
    let divOptionSelectEditCurrentEmail1 = document.createElement('div')
    divOptionSelectEditCurrentEmail1.classList.add('optionSelect')
    let spanOptionSelectEditCurrentEmail1 = document.createElement('span')
    spanOptionSelectEditCurrentEmail1.textContent = 'Notificação Diária'
    let selectOptionSelectEditCurrentEmail1 = document.createElement('select')
    selectOptionSelectEditCurrentEmail1.id = 'idSelectDiaria'
    let option1OptionSelectEditCurrentEmail1 = document.createElement('option')
    option1OptionSelectEditCurrentEmail1.value = 1
    option1OptionSelectEditCurrentEmail1.textContent = 'Ativado'
    let option2OptionSelectEditCurrentEmail1 = document.createElement('option')
    option2OptionSelectEditCurrentEmail1.value = 0
    option2OptionSelectEditCurrentEmail1.textContent = 'Desativado'
    selectOptionSelectEditCurrentEmail1.appendChild(option1OptionSelectEditCurrentEmail1)
    selectOptionSelectEditCurrentEmail1.appendChild(option2OptionSelectEditCurrentEmail1)
    
    divOptionSelectEditCurrentEmail1.appendChild(spanOptionSelectEditCurrentEmail1)
    divOptionSelectEditCurrentEmail1.appendChild(selectOptionSelectEditCurrentEmail1)

    // 2
    let divOptionSelectEditCurrentEmail2 = document.createElement('div')
    divOptionSelectEditCurrentEmail2.classList.add('optionSelect')
    let spanOptionSelectEditCurrentEmail2 = document.createElement('span')
    spanOptionSelectEditCurrentEmail2.textContent = 'Notificação Semanal'
    let selectOptionSelectEditCurrentEmail2 = document.createElement('select')
    selectOptionSelectEditCurrentEmail2.id = 'idSelectSemanal'
    let option1OptionSelectEditCurrentEmail2 = document.createElement('option')
    option1OptionSelectEditCurrentEmail2.value = 1
    option1OptionSelectEditCurrentEmail2.textContent = 'Ativado'
    let option2OptionSelectEditCurrentEmail2 = document.createElement('option')
    option2OptionSelectEditCurrentEmail2.value = 0
    option2OptionSelectEditCurrentEmail2.textContent = 'Desativado'
    selectOptionSelectEditCurrentEmail2.appendChild(option1OptionSelectEditCurrentEmail2)
    selectOptionSelectEditCurrentEmail2.appendChild(option2OptionSelectEditCurrentEmail2)
    
    divOptionSelectEditCurrentEmail2.appendChild(spanOptionSelectEditCurrentEmail2)
    divOptionSelectEditCurrentEmail2.appendChild(selectOptionSelectEditCurrentEmail2)

    // 3
    let divOptionSelectEditCurrentEmail3 = document.createElement('div')
    divOptionSelectEditCurrentEmail3.classList.add('optionSelect')
    let spanOptionSelectEditCurrentEmail3 = document.createElement('span')
    spanOptionSelectEditCurrentEmail3.textContent = 'Notificação Anual'
    let selectOptionSelectEditCurrentEmail3 = document.createElement('select')
    selectOptionSelectEditCurrentEmail3.id = 'idSelectAnual'
    let option1OptionSelectEditCurrentEmail3 = document.createElement('option')
    option1OptionSelectEditCurrentEmail3.value = 1
    option1OptionSelectEditCurrentEmail3.textContent = 'Ativado'
    let option2OptionSelectEditCurrentEmail3 = document.createElement('option')
    option2OptionSelectEditCurrentEmail3.value = 0
    option2OptionSelectEditCurrentEmail3.textContent = 'Desativado'
    selectOptionSelectEditCurrentEmail3.appendChild(option1OptionSelectEditCurrentEmail3)
    selectOptionSelectEditCurrentEmail3.appendChild(option2OptionSelectEditCurrentEmail3)
    
    divOptionSelectEditCurrentEmail3.appendChild(spanOptionSelectEditCurrentEmail3)
    divOptionSelectEditCurrentEmail3.appendChild(selectOptionSelectEditCurrentEmail3)

    // 4
    let divOptionSelectEditCurrentEmail4 = document.createElement('div')
    divOptionSelectEditCurrentEmail4.classList.add('optionSelect')
    let spanOptionSelectEditCurrentEmail4 = document.createElement('span')
    spanOptionSelectEditCurrentEmail4.textContent = 'Enviar Notificação'
    let selectOptionSelectEditCurrentEmail4 = document.createElement('select')
    selectOptionSelectEditCurrentEmail4.id = 'idSelectEnviarN'
    let option1OptionSelectEditCurrentEmail4 = document.createElement('option')
    option1OptionSelectEditCurrentEmail4.value = 1
    option1OptionSelectEditCurrentEmail4.textContent = 'Ativado'
    let option2OptionSelectEditCurrentEmail4 = document.createElement('option')
    option2OptionSelectEditCurrentEmail4.value = 0
    option2OptionSelectEditCurrentEmail4.textContent = 'Desativado'
    selectOptionSelectEditCurrentEmail4.appendChild(option1OptionSelectEditCurrentEmail4)
    selectOptionSelectEditCurrentEmail4.appendChild(option2OptionSelectEditCurrentEmail4)
    
    divOptionSelectEditCurrentEmail4.appendChild(spanOptionSelectEditCurrentEmail4)
    divOptionSelectEditCurrentEmail4.appendChild(selectOptionSelectEditCurrentEmail4)


    divContainerEditCurrentEmail.appendChild(divOptionSelectEditCurrentEmail1)
    divContainerEditCurrentEmail.appendChild(divOptionSelectEditCurrentEmail2)
    divContainerEditCurrentEmail.appendChild(divOptionSelectEditCurrentEmail3)
    divContainerEditCurrentEmail.appendChild(divOptionSelectEditCurrentEmail4)

    let divButtonsEditCurrentEmail = document.createElement('div')
    divButtonsEditCurrentEmail.classList.add('buttons-remove-cancel')

    let spanCancelConfirmEditCurrentEmail = document.createElement('span')
    spanCancelConfirmEditCurrentEmail.id = 'idCancelConfirmEditCurrentEmail'
    spanCancelConfirmEditCurrentEmail.textContent = 'Cancelar'
    spanCancelConfirmEditCurrentEmail.onclick = cancelEditCurrentEmail
    
    let spanConfirmConfirmEditCurrentEmail = document.createElement('span')
    spanConfirmConfirmEditCurrentEmail.id = 'idConfirmConfirmEditCurrentEmail'
    spanConfirmConfirmEditCurrentEmail.textContent = 'Salvar'
    
    divButtonsEditCurrentEmail.appendChild(spanCancelConfirmEditCurrentEmail)
    divButtonsEditCurrentEmail.appendChild(spanConfirmConfirmEditCurrentEmail)

    containerModal.appendChild(divZoneEditCurrentEmail)
    containerModal.appendChild(divTextTitleEditCurrentEmail)
    containerModal.appendChild(divTextEmailEditCurrentEmail)
    containerModal.appendChild(divContainerEditCurrentEmail)
    containerModal.appendChild(divButtonsEditCurrentEmail)

    modal.appendChild(containerModal)
    document.querySelector('.configuration-panel').appendChild(modal)
}

function cancelEditCurrentEmail() {
    let modal = document.getElementById('idModalEditCurrentEmail')
    document.querySelector('.configuration-panel').removeChild(modal)
}

function valEmail() {
    var email = document.getElementById('idTextCreateEmail').value

    var tamanho = email.length - 1
    
    if (email.includes('@')) { // Não pode ter mais de 1 '@'
        email = email.replace('@', '*')
        if (email.includes('@')) {
            idMsgWarn.innerHTML = 'Apenas 1 "@" é permitido'
        } else {
            idMsgWarn.innerHTML = ''
        }    
    } else {
        idMsgWarn.innerHTML = ''
    }    

    if (email[0] == '.' || (email[tamanho] == '.' && email[(tamanho - 1)] == '.')) { // Não deixa começar com ponto e nem ter 2 pontos seguidos
        idTextCreateEmail.value = idTextCreateEmail.value.slice(0, -1)
    }
    
    if (email[tamanho] == ' ' || email[tamanho] == ',' || email[tamanho] == ':' || email[tamanho] == ';') { // Não pode usar 'espaço', 'vírgula', ':', ';'
        idTextCreateEmail.value = idTextCreateEmail.value.slice(0, -1)
    }
}