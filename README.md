# SeniorGuardian — Modo Guardião (Blindagem Prateada)

O **SeniorGuardian — Modo Guardião** é o painel de segurança patrimonial (Dashboard) desenvolvido para que executivos e familiares possam monitorar e proteger parentes idosos contra fraudes financeiras e golpes, de forma passiva e sem invadir a privacidade do ente querido.

## 🚀 Funcionalidades Principais

- **Dashboard Integrado**: Visão geral de alertas, status de proteção e atividades recentes.
- **Gestão de Alertas**: Notificações em tempo real sobre transações suspeitas, tentativas de fraude (ex: Pix anormal) ou comportamentos atípicos.
- **Relatórios de Segurança**: Resumos de atividades financeiras e bloqueios preventivos realizados pelo sistema.
- **Configurações de Privacidade e Dispositivos**: Gerenciamento remoto do dispositivo pareado com o idoso de maneira não intrusiva.
- **Interface Premium**: Design moderno e responsivo, focado em alta usabilidade e voltado para necessidades de cuidadores/executivos ocupados.

## 🛠️ Tecnologias Utilizadas

O projeto web moderno utiliza as seguintes tecnologias (arquitetura SPA com backend leve em Javascript):

### Frontend
- **HTML5**
- **CSS3 (Custom Properties e Vanilla CSS)**
- **JavaScript (Vanilla JS ou ESModules)**

### Backend
- **Node.js**
- **Express.js** (Servidor HTTP para gerenciar o roteamento e servir as páginas estáticas)

## 📂 Estrutura do Projeto

Não se trata mais do app Flutter nativo. A nova estrutura do repositório front-end web é assim definida:

```text
senior-guardian/
├── public/                # Arquivos públicos e estáticos
│   ├── index.html         # Página principal da aplicação (SPA)
│   └── favicon.svg        # Ícone do navegador
├── src/                   # Código fonte e recursos do frontend
│   ├── app.js             # Lógica principal, Roteamento e Componentes (Módulos JS)
│   └── styles/            # Módulos de estilização (CSS)
│       ├── variables.css 
│       ├── global.css   
│       ├── layout.css     
│       └── components.css 
├── server.js              # Servidor Node/Express de inicialização (fallback SPA)
├── package.json           # Metadados do projeto e scripts npm
└── README.md              # Documentação principal
```

*Nota: As ramificações de mobile (Flutter / lib / ios / android) citadas anteriormente não fazem parte do repositório front-end do Modo Guardião.*

## 🚀 Como Começar

### Pré-requisitos
- **Node.js**: Instalado (versão mais recente recomendada)
- **NPM** ou **Yarn**

### Instalação

1. Clone o repositório na sua máquina:
   ```bash
   git clone <url-do-repositorio>
   cd senior-guardian
   ```

2. Instale as dependências associadas ao Express:
   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm start
   # ou
   npm run dev
   ```

4. Acesse no navegador:
   O aplicativo estará disponível localmente em: `http://localhost:3000`

## 🤝 Contribuindo

Contribuições são bem-vindas! Verifique se seu código segue o padrão de Javascript limpo sem frameworks para componentes adicionais antes de enviar um Pull Request.

## 📄 Licença

Este projeto é licenciado sob a Licença MIT.