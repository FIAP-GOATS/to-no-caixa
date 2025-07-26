export default {
    step: {
        BEGIN: {
            default_message: 'Para cadastrar um fornecedor, vou precisar de um algumas informações, beleza?'
        },
        AWAITING_NAME: {
            default_message: 'Qual o nome do seu fornecedor?',
            invalid_message: 'Ops.. Parece que o nome do fornecedor é inválido. Por favor, utilize apenas letras e números.'
        },
        AWAITING_CPF_OR_CNPJ: {
            default_message: 'Qual o CPF ou CNPJ do seu fornecedor?',
            invalid_message: 'Ops.. Parece que o CPF/CNPJ informado é inválido. Por favor, informe um email válido.'
        },
        COMPLETED: {
            default_message: 'Boa, fornecedor cadastrado!'
        }
    }
}