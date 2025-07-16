export default {
    step: {
        BEGIN: {
            default_message: 'Olá, vamos iniciar o seu cadastro!'
        },
        AWAITING_NAME: {
            default_message: 'Qual o nome do seu estabelecimento?',
            invalid_message: 'Ops.. Parece que o nome do seu estabelecimento é inválido. Por favor, utilize apenas letras e números.'
        },
        AWAITING_EMAIL: {
            default_message: 'Qual seu email?',
            invalid_message: 'Ops.. Parece que o email informado é inválido. Por favor, informe um email válido.'
        },
        AWAITING_CNPJ: {
            default_message: 'Qual seu CNPJ?',
            invalid_message: 'Ops.. Parece que o CNPJ informado não é válido. Por favor, informe um CNPJ válido.'
        },
        AWAITING_PRODUCTS: {
            default_message: 'Estamos quase terminando! Agora, envie seus produtos no formato:\n\nProduto - Preço\nEx: Coca 2L - 10.00',
        },
        AWAITING_TYPE: {
            default_message: 'Qual o tipo do ponto de venda? (ex: Mercado, Padaria, etc)',
            invalid_message: 'Ops.. Parece que esse ponto de venda é inválido. Por favor, informe um válido.'
        },
        AWAITING_ADRESS : {
            default_message: 'Qual o logradouro do seu estabelecimento? (Rua, Bairro e Número)',
            invalid_message: 'Ops... O logradouro informado é inválido. Por favor, informe um logradouro válido.'
        },
        AWAITING_CITY: {
            default_message: 'Qual a cidade do seu estabelecimento?',
            invalid_message: 'Ops... A cidade informada é inválida. Por favor, informe uma cidade válida.'
        },
        AWAITING_STATE: {
            default_message: 'Qual o estado do seu estabelecimento? (Ex: SP, RJ, MG, etc...)',
            invalid_message: 'Ops... Estado inválido. Por favor, utilize apenas as siglas dos estados brasileiros.'
        },
        AWAITING_POSTAL_CODE: {
            default_message: 'Qual o CEP do seu estabelecimento?',
            invalid_message: 'Ops... O CEP informado é inválido. Por favor, informe um CEP válido.'
        },
        COMPLETED: {
            default_message: 'Você já está cadastrado. Envie "vender" para começar a registrar vendas.'
        }
    },
    logo: {
        default_message: `
            ::::::::::: ::::::::        ::::    :::  ::::::::         ::::::::      :::     ::::::::::: :::    :::     :::     
                :+:    :+:    :+:       :+:+:   :+: :+:    :+:       :+:    :+:   :+: :+:       :+:     :+:    :+:   :+: :+:   
                +:+    +:+    +:+       :+:+:+  +:+ +:+    +:+       +:+         +:+   +:+      +:+      +:+  +:+   +:+   +:+  
                +#+    +#+    +:+       +#+ +:+ +#+ +#+    +:+       +#+        +#++:++#++:     +#+       +#++:+   +#++:++#++: 
                +#+    +#+    +#+       +#+  +#+#+# +#+    +#+       +#+        +#+     +#+     +#+      +#+  +#+  +#+     +#+ 
                #+#    #+#    #+#       #+#   #+#+# #+#    #+#       #+#    #+# #+#     #+#     #+#     #+#    #+# #+#     #+# 
                ###     ########        ###    ####  ########         ########  ###     ### ########### ###    ### ###     ###
        `
    },
}