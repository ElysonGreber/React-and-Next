<br>
<img src="./public/tokenpo.svg" alt="Logo" width="600"/>
<br>

# 🪙 Solana Rock Paper Scissors  

A fun and interactive **Rock–Paper–Scissors** game built entirely on **Solana Devnet**, where every match is powered by blockchain transactions.  
This project represents my first deep dive into **React**, **TypeScript**, and **Rust**, merging web development with on-chain logic to create a fully decentralized gaming experience.  

💡 Through this project, I learned how to:
- Build responsive and dynamic interfaces with **React** and **Next.js**  
- Connect the frontend to the **Solana blockchain** using **Web3.js**  
- Write smart contracts in **Rust** using the **Anchor framework**  
- Manage real-time scores, leaderboards, and Solana wallet interactions  

What started as a simple idea turned into a practical journey of learning — blending modern web technologies with the power of blockchain.  

---

### 🚀 Tech Stack
- **Frontend:** React, Next.js, TypeScript, TailwindCSS  
- **Blockchain:** Solana Devnet, Anchor, Rust  
- **Database & Auth:** Supabase  
- **Other:** Wallet Adapter, Web3 Integration  

---

### ✨ About the Project
This is more than just a game — it’s my **first full-stack blockchain app**, built from scratch as a personal challenge to understand how **React** and **Rust** can come together to create something meaningful, interactive, and decentralized.

---

## 🇧🇷 Versão em Português  

Um jogo divertido e interativo de **Pedra, Papel e Tesoura** construído inteiramente na **Solana Devnet**, onde cada partida é processada diretamente na blockchain.  
Este projeto marca minha primeira imersão em **React**, **TypeScript** e **Rust**, unindo o desenvolvimento web com a lógica on-chain para criar uma experiência totalmente descentralizada.  

💡 Com este projeto, aprendi a:
- Criar interfaces dinâmicas e responsivas com **React** e **Next.js**  
- Conectar o frontend à **blockchain Solana** usando **Web3.js**  
- Escrever smart contracts em **Rust** com o framework **Anchor**  
- Gerenciar pontuações em tempo real, rankings e integração de carteiras Solana  

O que começou como uma simples ideia se tornou uma jornada prática de aprendizado — combinando o melhor do desenvolvimento web moderno com o poder da blockchain.  

---

### 🚀 Tecnologias Utilizadas
- **Frontend:** React, Next.js, TypeScript, TailwindCSS  
- **Blockchain:** Solana Devnet, Anchor, Rust  
- **Banco de Dados e Autenticação:** Supabase  
- **Outros:** Wallet Adapter, Integração Web3  

---

### ✨ Sobre o Projeto
Mais do que apenas um jogo, este é o meu **primeiro aplicativo blockchain full-stack**, desenvolvido do zero como um desafio pessoal para entender como **React** e **Rust** podem trabalhar juntos para criar algo significativo, interativo e descentralizado.  

```bash
├── Diagram
│   ├── F.png
│   ├── React-and-Next_diagram.png
│   ├── React-and-Next_diagramB.png
│   ├── React-and-Next_diagramC.png
│   ├── src_diagramD.png
│   └── src_diagramE.png
├── README.md
├── buss.md
├── components.json
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── public
│   ├── BGpattern.svg
│   ├── BGpatternGD.svg
│   ├── BgDust.svg
│   ├── ChartProgress.tsx
│   ├── Circle-darkblu.svg
│   ├── Circle-green.svg
│   ├── Gem.png
│   ├── Gema.svg
│   ├── HirukoBlackAlternate.ttf
│   ├── PL90.svg
│   ├── Point.tsx
│   ├── RPL90.tsx
│   ├── RRL90.tsx
│   ├── RSL90.tsx
│   ├── SquareGrad.svg
│   ├── armsPL.svg
│   ├── armsRL.svg
│   ├── armsSL.svg
│   ├── bg2.png
│   ├── bg3.png
│   ├── bgHF.png
│   ├── bgabs.jpeg
│   ├── dark-bento-03-performance.png
│   ├── dark-bento-03-security.png
│   ├── gema.tsx
│   ├── hands
│   │   ├── armsPL.svg
│   │   ├── armsRL.svg
│   │   └── armsSL.svg
│   ├── icon-square.svg
│   ├── logojkp.svg
│   ├── logovert.png
│   ├── solanaLogoMark.svg
│   ├── sollogo.avif
│   ├── sqr-shine.svg
│   └── tokenpo.svg
├── solanastyle.md
├── src
│   ├── app
│   │   ├── account
│   │   │   ├── [address]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── api
│   │   │   └── crypto-prices
│   │   │       ├── crypto-prices.ts
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── globals.md
│   │   ├── globalscopy.md
│   │   ├── layout.tsx
│   │   ├── leadboard
│   │   │   └── page.tsx
│   │   ├── market
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── register
│   │   │   ├── [address]
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   └── tasks
│   │       └── page.tsx
│   ├── components
│   │   ├── account
│   │   │   ├── account-data-access.tsx
│   │   │   ├── account-data-game-statistic.tsx
│   │   │   ├── account-detail-feature.tsx
│   │   │   ├── account-list-feature.tsx
│   │   │   ├── account-ui.tsx
│   │   │   └── fixed-data-balance.tsx
│   │   ├── app-alert.tsx
│   │   ├── app-chart-lollypop.tsx
│   │   ├── app-footer copy.md
│   │   ├── app-footer.tsx
│   │   ├── app-header.tsx
│   │   ├── app-hero.tsx
│   │   ├── app-layout.tsx
│   │   ├── app-leadboard.tsx
│   │   ├── app-levelprogress.tsx
│   │   ├── app-modal.tsx
│   │   ├── app-providers.tsx
│   │   ├── app-toaster.tsx
│   │   ├── bkp
│   │   │   └── dashboard-feature.md
│   │   ├── cluster
│   │   │   ├── cluster-data-access.tsx
│   │   │   └── cluster-ui.tsx
│   │   ├── dashboard
│   │   │   ├── dashboard-feature.tsx
│   │   │   └── ui
│   │   │       ├── bentoG.tsx
│   │   │       ├── dashboard-bot.tsx
│   │   │       ├── dashboard-feature.md
│   │   │       ├── dashboard-topc.tsx
│   │   │       ├── mainslider.tsx
│   │   │       └── solana
│   │   │           └── solana-provider.tsx
│   │   ├── kokonutui
│   │   │   ├── anthropic-dark.tsx
│   │   │   ├── anthropic.tsx
│   │   │   ├── bento-grid.tsx
│   │   │   ├── deepseek.tsx
│   │   │   ├── gemini.tsx
│   │   │   ├── mistral.tsx
│   │   │   ├── open-ai-dark.tsx
│   │   │   └── open-ai.tsx
│   │   ├── market
│   │   │   ├── crypto-market.tsx
│   │   │   └── market-feature.tsx
│   │   ├── react-query-provider.tsx
│   │   ├── register
│   │   │   └── register-feature.tsx
│   │   ├── tasks
│   │   │   └── socialtasks.tsx
│   │   ├── theme-provider.tsx
│   │   ├── theme-select.tsx
│   │   └── ui
│   │       ├── Coin.module.css
│   │       ├── alert.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── footer-chat-props.tsx
│   │       ├── icon-move.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── micah-avatar.tsx
│   │       ├── shine-border.tsx
│   │       ├── sonner.tsx
│   │       ├── table.tsx
│   │       ├── toast.tsx
│   │       ├── twitter.tsx
│   │       └── usermenu.tsx
│   ├── lib
│   │   ├── levelUtils.ts
│   │   ├── rankingUtils.ts
│   │   ├── solanaHelper.tsx
│   │   ├── supabaseClient.ts
│   │   ├── useSolprice.ts
│   │   ├── useSyncRanking.ts
│   │   └── utils.ts
│   └── types
│       └── react-three-fiber.d.ts
├── tailwind.config.js
└── tsconfig.json
