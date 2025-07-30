# To No Caixa

Pequenos negócios enfrentam dificuldades com ERPs tradicionais por serem caros, complexos e pouco acessíveis, o que leva muitos a ainda controlarem vendas, estoque e finanças de forma manual e desorganizada. Nossa solução é um ERP completo e fácil de usar, totalmente operado via WhatsApp, que permite ao empreendedor gerenciar estoque, registrar vendas, acompanhar o fluxo de caixa e acessar relatórios, tudo por comandos simples e direto no aplicativo que ele já usa no dia a dia.

## Estado de desenvolvimento

- Backend em andamento
- Frontend a iniciar

## Arquitetura

O projeto segue uma arquitetura modular, separando responsabilidades em diferentes módulos:

- **src/main.js**: Ponto de entrada da aplicação.
- **modules/app**: Inicialização e orquestração dos módulos.
- **modules/database**: Integração com banco de dados PostgreSQL.
- **modules/companies**: Gerenciamento de empresas (CRUD).
- **modules/sign-up**: Fluxo de cadastro de empresas via WhatsApp.
- **modules/whatsapp**: Integração com WhatsApp usando [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js).
- **modules/messages**: Manipulação de mensagens recebidas.
- **modules/customer**: Lógica de atendimento ao cliente
- **util.js**: Funções utilitárias.
...

A comunicação entre módulos é feita por injeção de dependências.

## Pré-requisitos

- [Node.js](https://nodejs.org/) >= 16
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- WhatsApp instalado em um smartphone para autenticação

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

   ```sh
   cp example.env .env

2. Edite o arquivo .env com as configurações do seu banco de dados PostgreSQL.

## Rodando com Docker

1. Suba o banco de dados PostgreSQL:

    ```sh
    docker-compose --env-file ./.env -f docker/docker-compose.yaml up -d

## Rodando a aplicação

1. Instale as dependências:
    
    npm install

2. Inicie a aplicação:

    npm start

O terminal exibirá um QR Code. Escaneie com o WhatsApp do seu celular para autenticar o bot.

## Observações

- O banco de dados deve estar rodando e acessível conforme as variáveis do .env.
- O bot só funcionará após autenticação via QR Code.

<br><br>




