export default {
    step: {
        BEGIN: {
            default_message: 'Olá, vamos iniciar o seu cadastro!'
        },
        AWAITING_NAME: {
            default_message: 'Qual o nome do seu estabelecimento?'
        },
        AWAITING_EMAIL: {
            default_message: 'Qual seu email?'
        },
        AWAITING_CNPJ: {
            default_message: 'Qual seu CNPJ?',
            invalid_message: 'O CNPJ informado não é válido'
        },
        AWAITING_PRODUCTS: {
            default_message: 'Estamos quase terminando! Agora, envie seus produtos no formato:\n\nProduto - Preço\nEx: Coca 2L - 10.00',
        },
        AWAITING_TYPE: {
            default_message: 'Qual o tipo do ponto de venda? (ex: mercado, padaria, etc)'
        },
        AWAITING_ADRESS : {
            default_message: 'Qual o endereço do seu estabelecimento?'
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