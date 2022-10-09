# Import contacts from Google Sheets to Hubspot

<!---Esses são exemplos. Veja https://shields.io para outras pessoas ou para personalizar este conjunto de escudos. Você pode querer incluir dependências, status do projeto e informações de licença aqui--->

![GitHub repo size](https://img.shields.io/github/repo-size/rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot?style=for-the-badge)

> Script node.js buscando importar dados de uma planilha do Google Sheets como contato para o Hubspot CRM.

## 💻 Pré-requisitos

Antes de começar, verifique se você atendeu aos seguintes requisitos:

- Você está utilizando a mesma versão do Node.js em que o projeto foi desenvolvido (16.13.2)
- Preencheu o arquivo `.env` na raiz do projeto com as variavéis conforme o `.env.example`

## 🚀 Instalando

Para instalar o projeto, siga estas etapas:

- Clone o repositório

  ```bash
  git clone git@github.com:rafhaeldeandrade/import-contacts-from-googlesheets-to-hubspot.git
  ```

- Instale as dependências

  ```
  cd import-contacts-from-googlesheets-to-hubspot && yarn
  ```

  ou

  ```
  cd import-contacts-from-googlesheets-to-hubspot && npm install
  ```

## ☕ Usando

Para usar o projeto, siga estas etapas:

1. Abra o terminal, entre no diretório em que o projeto foi clonado
2. Inicie o script para permitir que o aplicativo tenha acesso `readonly` aos seus spreadsheets do Google rodando o script `yarn google-auth` ou `npm run google-auth`
3. Copie a url gerada e cole no browser para prosseguir com a autorização
   <img src="https://i.imgur.com/BLI7N4w.png" alt="rodando script google-auth">
4. Copie o código gerado no final da autorização, para isso, pode-se clicar no ícone marcado com vermelho
   <img src="https://i.imgur.com/GVwPKW5.png" alt="primeira tela da autorização" width="463" height="600">
   <img src="https://i.imgur.com/njl2j4F.png" alt="última tela da autorização" width="463" height="600">
5. Tenha certeza de que a primeira linha do spreadsheet está com os headers corretos: `Nome da empresa`, `Nome completo`, `Email`, `Telefone`, `Website`. Exemplo: [Link para o spreadsheet de exemplo](https://docs.google.com/spreadsheets/d/19E2iYFSF2ikxLLWi3n_p0Uy6Udf8qBmuyGxLfmWDoSY/edit?usp=sharing)
6. Tenha o id do spreadsheet e o nome da página em que os contatos estão [Mini-tutorial](https://i.imgur.com/mF3afn5.png)
7. Retorne ao terminal com o código de autorização, id do spreadsheet e o nome da página em mãos e rode o script `yarn start --code <CÓDIGO DE AUTORIZAÇÃo DO GOOGLE> --spreadsheetId <ID DO SPREADSHEET> --pageName <NOME DA PÁGINA>` ou `npm start -- --code <CÓDIGO DE AUTORIZAÇÃo DO GOOGLE> --spreadsheetId <ID DO SPREADSHEET> --pageName <NOME DA PÁGINA>`
