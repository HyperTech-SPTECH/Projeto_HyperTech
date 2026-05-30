// Editar perfil de Usuário
function editFields() {
    let inputs = document.getElementsByClassName('changeable-profile-data-user')
    for (i = 0; i < inputs.length; i++) {
        inputs[i].querySelector('input').removeAttribute('disabled')
    }
    document.getElementById('idButtons').style.display = 'flex'
}
// Cancelar a ediçao
function cancelEditFields() {
    let inputs = document.getElementsByClassName('changeable-profile-data-user')
    for (i = 0; i < inputs.length; i++) {
        inputs[i].querySelector('input').disabled = true
    }
    document.getElementById('idInputNomeUser').value = sessionStorage.NOME_USUARIO
    document.getElementById('idInputEmailUser').value = sessionStorage.EMAIL_USUARIO
    document.getElementById('idInputSenhaUser').value = '**********'
    document.getElementById('idButtons').style.display = 'none'

    
    idTextWarnProfile.innerText = ''
    document.getElementById('idTextWarnProfile').classList.remove('textRed')
    document.getElementById('idTextWarnProfile').classList.remove('textGreen')
}

// abrir menu para remover conta
function confirmRemoveAccount() {
    document.getElementById('idModalConfirmRemoveAccount').style.display = 'block';
}

// cancelar a remoção de conta
function cancelConfirmRemoveAccount() {
    document.getElementById('idModalConfirmRemoveAccount').style.display = 'none';
}

function alterarInformacoesPerfil() {
    var nomeVar = idInputNomeUser.value;
    var emailVar = idInputEmailUser.value;
    var senhaVar = idInputSenhaUser.value;
    var idVar = sessionStorage.ID_USUARIO


    // Verificando se há algum campo em branco
    if (nomeVar == '' ||
        emailVar == '' ||
        senhaVar == ''
    ) {
        document.getElementById('idTextWarnProfile').textContent = 'Preencha todos os campos!'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return false
    }
    
    if (nomeVar.length < 3) {
        idTextWarnProfile.innerText = 'Nome deve conter pelo menos 3 caracteres.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }

    if (!emailVar.includes('@')) {
        idTextWarnProfile.innerText = 'E-mail deve conter pelo menos 1 @.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }

    var antesA = emailVar.split('@')

    if (antesA[0].length < 3) {
        idTextWarnProfile.innerText = 'E-mail deve conter pelo menos 3 letras antes do @.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }

    if (antesA[1].length < 3) {
        idTextWarnProfile.innerText = 'E-mail deve conter pelo menos 3 letras depois do @.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }
    
    if (senhaVar.length < 8) {
        idTextWarnProfile.innerText = 'A senha deve conter no minímo 8 caracteres.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }

    var senhaNumber = false
    for (var i = 0; i < senhaVar.length; i++) {
        if (!isNaN(senhaVar[i])) {
            senhaNumber = true
        }
    }
    
    if (!senhaNumber) {
        idTextWarnProfile.innerText = 'A senha deve conter no minímo 1 número.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }
    
    var especiais = `!@#$%&*()_.,;:+-/`
    var temCEspecial = false
    for (var i = 0; i < senhaVar.length; i++) {
        if (especiais.includes(senhaVar[i])) {
            temCEspecial = true
        }
    }

    if (!temCEspecial) {
        // (! @ # $ % & * ( ) _ . , ; : + - / )
        idTextWarnProfile.innerText = 'A senha deve conter no minímo 1 caracter especial.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return
    }
    
    if (senhaVar == senhaVar.toLowerCase()) {
        idTextWarnProfile.innerText = 'A senha deve conter no minímo uma letra maiúscula.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return    
    }
    
    if (senhaVar == senhaVar.toUpperCase()) {
        idTextWarnProfile.innerText = 'A senha deve conter no minímo uma letra minúscula.'
        document.getElementById('idTextWarnProfile').classList.add('textRed')
        return    
    }

    idTextWarnProfile.innerText = ''
    document.getElementById('idTextWarnProfile').classList.remove('textRed')


    fetch("/profile/alterar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idServer: idVar,
            nomeServer: nomeVar,
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
    
        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log("a")
                console.log(JSON.stringify(json));
                console.log("b")
                sessionStorage.EMAIL_USUARIO = json[0].email;
                sessionStorage.NOME_USUARIO = json[0].nome;
                sessionStorage.ID_USUARIO = json[0].usuario_id;
                sessionStorage.CARGO_USUARIO = json[0].cargo_id;
                

                
                idTextWarnProfile.innerText = 'Conta alterada'
                document.getElementById('idTextWarnProfile').classList.add('textGreen')

            });

        } else {

            console.log("Houve um erro ao tentar realizar a alteração das informações do Usuário!");

            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })
}