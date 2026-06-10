function valEmail() {
    var email = document.getElementById('input_email').value

    var tamanho = email.length - 1
    
    if (email.includes('@')) { // Não pode ter mais de 1 '@'
        email = email.replace('@', '*')
        if (email.includes('@')) {
            res.innerHTML = 'Apenas 1 "@" é permitido'
        } else {
            res.innerHTML = ''
        }    
    } else {
        res.innerHTML = ''
    }    

    if (email[0] == '.' || (email[tamanho] == '.' && email[(tamanho - 1)] == '.')) { // Não deixa começar com ponto e nem ter 2 pontos seguidos
        input_email.value = input_email.value.slice(0, -1)
    }
    
    if (email[tamanho] == ' ' || email[tamanho] == ',' || email[tamanho] == ':' || email[tamanho] == ';') { // Não pode usar 'espaço', 'vírgula', ':', ';'
        input_email.value = input_email.value.slice(0, -1)
    }
}

function criarUser() {
    var nomeVar = input_nome.value.trim();
    var cnpjVar = sessionStorage.getItem('CNPJ_EMPRESA');
    var emailVar = input_email.value.trim();
    var senhaVar = input_senha.value;
    var confirmSenhaVar = input_confirmacao.value;

    
    let role = sessionStorage.getItem('CARGO_USUARIO')

    if (role != 1) {
        alert('Você não tem permissão para cadastrar um novo usuário!')
        loadComponent('./dashboard/date-hour-dashboard.html');
        setTimeout(() => {
            includeFiltersInDash()
            listarFiltrosUsuario()
        }, 200);
    }

    res.innerText = ''
    document.getElementById('res').classList.remove('textRed')
    document.getElementById('res').classList.remove('textGreen')
    // Verificando se há algum campo em branco
    if (nomeVar == '' ||
        emailVar == '' ||
        cnpjVar == '' ||
        senhaVar == '' ||
        confirmSenhaVar == ''
    ) {
        document.getElementById('res').textContent = 'Preencha todos os campos!'
        document.getElementById('res').classList.add('textRed')
        return false
    }
    
    if (nomeVar.length < 3) {
        res.innerText = 'Nome deve conter pelo menos 3 caracteres.'
        document.getElementById('res').classList.add('textRed')
        return
    }

    if (!emailVar.includes('@')) {
        res.innerText = 'E-mail deve conter pelo menos 1 @.'
        document.getElementById('res').classList.add('textRed')
        return
    }

    var antesA = emailVar.split('@')

    if (antesA[0].length < 3) {
        res.innerText = 'E-mail deve conter pelo menos 3 caracteres antes do @.'
        document.getElementById('res').classList.add('textRed')
        return
    }

    if (antesA[1].length < 3) {
        res.innerText = 'E-mail deve conter pelo menos 3 caracteres depois do @.'
        document.getElementById('res').classList.add('textRed')
        return
    }
    
    if (cnpjVar.length != 18) {
        res.innerText = 'CNPJ inválido.'
        document.getElementById('res').classList.add('textRed')
        return
    }
    
    if (senhaVar.length < 8) {
        res.innerText = 'A senha deve conter no minímo 8 caracteres.'
        document.getElementById('res').classList.add('textRed')
        return
    }

    var senhaNumber = false
    for (var i = 0; i < senhaVar.length; i++) {
        if (!isNaN(senhaVar[i])) {
            senhaNumber = true
        }
    }
    
    if (!senhaNumber) {
        res.innerText = 'A senha deve conter no minímo 1 número.'
        document.getElementById('res').classList.add('textRed')
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
        res.innerText = 'A senha deve conter no minímo 1 caracter especial.'
        document.getElementById('res').classList.add('textRed')
        return
    }
    
    if (senhaVar == senhaVar.toLowerCase()) {
        res.innerText = 'A senha deve conter no minímo uma letra maiúscula.'
        document.getElementById('res').classList.add('textRed')
        return    
    }
    
    if (senhaVar == senhaVar.toUpperCase()) {
        res.innerText = 'A senha deve conter no minímo uma letra minúscula.'
        document.getElementById('res').classList.add('textRed')
        return    
    }
    
    if (senhaVar != confirmSenhaVar) {
        res.innerText = 'O Campo Confirmar senha deve ser igual ao campo Senha'
        document.getElementById('res').classList.add('textRed')
        return        
    }

    res.innerText = ''
    document.getElementById('res').classList.remove('textRed')

    
    fetch("/usuarios/cadastrarUser", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        
        nomeServer: nomeVar,
        emailServer: emailVar,
        cnpjServer: cnpjVar,
        senhaServer: senhaVar,
        
    }),
    })
    .then(async function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {

            document.getElementById('res').classList.remove('textRed')
            res.textContent = "Cadastro realizado com sucesso!";
            document.getElementById('res').classList.add('textGreen')

            criarInformacoesNotificacao(emailVar)

        }

        let respostaVar = await resposta.json()
        
        if (respostaVar.erro === "EMAIL_DUPLICADO") {
            res.innerText = 'Este email já está cadastrado.'
            document.getElementById('res').classList.add('textRed')
            return        
        }
    })
    .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
    });

    return false;
}

function criarInformacoesNotificacao(email) {
    var emailVar = email;

    fetch("/notification/criacao", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar
        })
    }).then(function (resposta) {
    
        if (resposta.ok) {
            console.log(resposta);

            resposta.json().then(json => {
                console.log(json);
                console.log("a")
                console.log(JSON.stringify(json));
                console.log("b")
            });

        } else {

            console.log("Houve um erro ao tentar realizar a criação das informações de notificação do Usuário!");

            resposta.text().then(texto => {
                console.error(texto);
            });
        }

    }).catch(function (erro) {
        console.log(erro);
    })
}

function podeEstarAqui() {
    let role = sessionStorage.getItem('CARGO_USUARIO')

    if (role != 1) {
        alert('Você não tem permissão para cadastrar um novo usuário!')
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
}