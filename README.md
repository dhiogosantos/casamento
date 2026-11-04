# Casamento Dhiogo & Laura 💜

Site do casamento com lista de presentes e confirmação de presença (RSVP).
17 de Julho de 2027 às 16h30 — Spaço Verde, Uberlândia - MG.

## Estrutura do projeto

```
casamento/
├── index.html                   # Página única com todas as seções
├── css/
│   └── style.css                # Estilos, paleta lilás e animações
├── js/
│   ├── config.js                # URL da Planilha Google (Apps Script)
│   ├── data.js                  # Data/local do evento + lista de presentes de demonstração
│   ├── gifts.js                  # Renderização e reserva da lista de presentes
│   ├── rsvp.js                   # Lógica do formulário de confirmação de presença
│   └── main.js                  # Navegação, contagem regressiva, mapa, animações
├── assets/
│   ├── images/
│   │   └── brasao.png          # Imagem provisória (brasão) usada em todo o site
│   └── icons/
├── google-apps-script/
│   └── Code.gs                   # Script que conecta o site à Planilha Google
└── brasao.png                     # Arquivo original enviado
```

## Como rodar no localhost

Abrir o `index.html` direto no navegador funciona, mas o ideal é servir os arquivos
por um servidor local (evita bloqueios de CORS e deixa tudo igual ao ambiente real):

**Opção 1 — Python (já vem instalado na maioria dos PCs):**
```bash
cd casamento
python -m http.server 8000
```
Depois acesse: http://localhost:8000

**Opção 2 — Node.js:**
```bash
cd casamento
npx serve .
```

## Trocando as fotos do pré-wedding

Todas as imagens hoje usam `assets/images/brasao.png` como placeholder. Quando
tiver as fotos do pré-wedding, basta:

1. Colocar as fotos em `assets/images/` (ex: `hero.jpg`, `casal-1.jpg`...).
2. Trocar o `src` correspondente no `index.html` (seção Hero) e em `js/data.js`
   (campo `image` de cada presente, se quiser imagens reais dos produtos).

## Controle de confirmações e presentes (Planilha Google)

O site é **estático** (HTML/CSS/JS puro), então não existe um servidor/banco de
dados por trás. Para vocês terem controle real de quem confirmou presença e
quem já deu presente — vendo e editando tudo numa planilha — o site se conecta
a uma Planilha Google através de um Google Apps Script gratuito.

Sem configurar isso, o site funciona em **modo demonstração**: RSVP e reservas
de presente ficam salvos só no navegador de quem respondeu (`localStorage`) e
não chegam até vocês. Siga os passos abaixo para ativar o modo real.

### Passo 1 — Criar a planilha

1. Crie uma planilha nova em [sheets.google.com](https://sheets.google.com).
2. Renomeie a primeira aba para `Confirmacoes` e, na linha 1, cole estes
   cabeçalhos (uma coluna por célula):
   ```
   DataEnvio	Nome	Whatsapp	Email	Vai	Acompanhantes	Mensagem
   ```
3. Crie uma segunda aba chamada `Presentes`, com estes cabeçalhos na linha 1:
   ```
   Nome	Descricao	Preco	Imagem	Status	DadoPor	Data
   ```
   - `Imagem` é opcional (URL de uma foto; se deixar vazio, usa o brasão).
   - `Status` vazio ou `Disponível` = presente ainda não escolhido.
4. Cadastre os presentes um a um nas linhas seguintes dessa aba — é exatamente
   essa planilha que vira a lista de presentes do site, e que vocês usam para
   marcar manualmente quando algo for dado (preenchendo `Status`, `DadoPor` e
   `Data`).

### Passo 2 — Publicar o Apps Script

1. Na planilha, vá em **Extensões → Apps Script**.
2. Apague o conteúdo padrão e cole o conteúdo de `google-apps-script/Code.gs`
   (deste projeto).
3. Clique em **Implantar → Nova implantação**.
4. Em "Tipo", escolha **App da Web**.
5. Configure: "Executar como" = **Eu**; "Quem pode acessar" = **Qualquer pessoa**.
6. Clique em **Implantar** e autorize o acesso (é a sua própria planilha).
7. Copie a URL gerada, que termina em `/exec`.

### Passo 3 — Conectar o site

Cole essa URL em `js/config.js`:
```js
const SHEETS_API_URL = "https://script.google.com/macros/s/SEU_ID/exec";
```

A partir disso:
- Toda confirmação de presença do formulário vira uma linha na aba `Confirmacoes`.
- A seção "Lista de Presentes" do site passa a ler os itens direto da aba
  `Presentes` (não precisa mais editar código para adicionar presente).
- Quando um convidado clica em "Presentear" e digita o nome, o site marca
  automaticamente `Status = Reservado` e `DadoPor` na planilha — mas vocês
  continuam podendo editar, corrigir ou cadastrar manualmente qualquer linha
  direto no Google Sheets, a qualquer momento.

> Se você editar o script depois, repita o passo 2 escolhendo **Gerenciar
> implantações → editar → Nova versão** (senão a URL antiga continua servindo
> o código antigo).

## Publicando no GitHub Pages (depois)

1. Criar um repositório no GitHub e subir esta pasta.
2. Em Settings → Pages, selecionar a branch (ex: `main`) e a pasta raiz `/`.
3. O site ficará disponível em `https://<seu-usuario>.github.io/<repositorio>/`.

## Personalização rápida

- **Cores**: variáveis no topo de `css/style.css` (`:root { --color-primary... }`).
- **Data/local/mensagem**: `index.html` (texto) e `js/data.js` (data do evento,
  usada na contagem regressiva, no mapa e no botão "Adicionar ao Calendário").
- **Fontes**: Google Fonts `Parisienne` (nomes/assinatura), `Playfair Display`
  (títulos) e `Poppins` (texto), carregadas no `<head>` do `index.html`.
