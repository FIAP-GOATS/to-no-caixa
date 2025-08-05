export default {
    step: {
        BEGIN: {
            default_message: 'Para cadastrar um produto, vou precisar de um algumas informações, beleza?'
        },
        AWAITING_NAME: {
            default_message: 'Qual o nome do seu produto?',
            invalid_message: 'Ops.. Parece que o nome do produto é inválido. Por favor, utilize apenas letras e números.'
        },
        AWAITING_COST_PRICE: {
            default_message: 'Qual o preço de custo do seu produto?',
            invalid_message: 'Ops.. Parece que o preço de custo informado é inválido. Por favor, informe um preço válido.'
        },
        AWAITING_SALE_PRICE: {
            default_message: 'Qual o preço de venda do seu produto?',
            invalid_message: 'Ops.. Parece que o preço de venda informado é inválido. Por favor, informe um preço válido.'
        },
        AWAITING_INVENTORY: {
            default_message: 'Qual a quantidade em estoque do seu produto?',
            invalid_message: 'Ops.. Parece que a quantidade em estoque informada é inválida. Por favor, informe um número válido.'
        },
        COMPLETED: {
            default_message: 'Boa, produto cadastrado!'
        }
    }
}