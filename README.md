# 🟢 WEB3_TERMINAL // Interactive Decentralized Explorer

An interactive, responsive, retro terminal-styled exploratory landing page designed to teach beginners foundational Web3 concepts through hands-on visuals, simulations, and real-time interactions rather than passive reading.

Built for the **Web3 Explorer Challenge** with zero external frontend runtime dependencies.

---

## 🚀 Live Demo & Repository
- **Local Entry Point**: Open [`index.html`](index.html) directly in any modern web browser or serve via a local HTTP server.
- **Repository URL**: `https://github.com/aishwarya030807/web3-explorer`

---

## 🎯 Project Purpose & Philosophy
Most Web3 educational materials either fall into two traps:
1. **Hyper-technical crypto jargon** (Merkle Patricia tries, consensus algorithms, elliptic curves) that alienates curious newcomers.
2. **Speculative marketing hype** ("To the moon! 100x guaranteed returns!"), which harms trust and obscures the underlying technological breakthrough of decentralized computation.

**WEB3_TERMINAL** takes a different path:
- **Concept First**: Every concept is anchored by an interactive model you manipulate with your own hands.
- **Retro Terminal Identity**: Avoids the generic neon purple gradient / floating 3D coin template in favor of an authentic, early cypherpunk computer terminal aesthetic.
- **High-Contrast Eye Comfort**: Designed with softened charcoal backgrounds (`#0d1117`), phosphor highlights, generous line heights, and WCAG AAA/AA compliant contrast ratios (>7:1) to prevent eye strain.

---

## 📚 Web3 Concepts Covered

| # | Concept | One-Line Explanation | Interactive Element |
|---|---|---|---|
| **01** | **Centralization vs. Decentralization** | Shifting architecture from single-point-of-failure servers to resilient distributed peer networks. | **Canvas Simulator**: Click nodes to crash the central server vs. watching peer packets reroute in a mesh. |
| **02** | **Evolution of the Web** | Web 1.0 (Read-only) $\rightarrow$ Web 2.0 (Read/Write silos) $\rightarrow$ Web 3.0 (Read/Write/Own via cryptographic consensus). | **Interactive Comparative Matrix**: Dynamic paradigm breakdown of data ownership across eras. |
| **03** | **Blockchain & Immutability** | An append-only cryptographic ledger where each block links to the previous block's SHA-256 hash. | **Live Blockchain**: Mine blocks with custom payloads; click **"Tamper Block #1"** to watch the chain break. |
| **04** | **Smart Contracts** | Deterministic, self-executing code stored on-chain that runs automatically without middlemen. | **Vending Machine Simulator**: Select tokenized items and step through line-by-line Solidity execution. |
| **05** | **Cryptocurrencies & Gas Economics** | Native digital tokens that pay for computation (gas) and economically incentivize distributed validators. | **Gas Fee Calculator**: Live EIP-1559 gas estimator based on transaction complexity and network traffic. |
| **06** | **NFTs & Digital Provenance** | Unique, verifiable tokens (ERC-721) that prove cryptographic ownership of non-fungible digital assets. | **Retro ASCII Gallery**: Inspect raw JSON metadata and execute simulated on-chain ownership transfers. |
| **07** | **DAOs (Decentralized Governance)** | Organizations governed transparently by code, where proposals and treasury funds are voted on by token holders. | **Governance Console**: Cast simulated `$GOV` votes and watch quorum progress bars recalculate in real time. |
| **08** | **Web3 Insights Archive** | Surprising historical milestones and cryptographic breakthroughs that define the decentralized web. | **Terminal Log Carousel**: Keyboard-accessible carousel featuring Satoshi's Genesis block headline, the 99.95% energy drop from The Merge, Zero-Knowledge proofs, and IPFS. |
| **09** | **Web3 Wallets (EIP-1193 Bonus)** | Non-custodial public/private keypair managers that securely sign transactions without leaking secrets. | **Wallet Console**: Live `window.ethereum` MetaMask connector with account/chain detection + built-in Simulation Mode. |

---

## 🛠️ Tech Stack
- **HTML5**: Clean, semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) with ARIA roles and labels.
- **CSS3**: Modular architecture with CSS Custom Properties (tokens), Flexbox, CSS Grid, custom retro scrollbars, and toggleable CRT scanline overlays.
- **Vanilla JavaScript (ES6+)**:
  - `crypto.subtle` Web Crypto API for real SHA-256 block hashing.
  - HTML5 Canvas API for high-performance node network physics and packet routing.
  - Native Web Audio API for synthesized 8-bit retro sound effects (zero audio assets needed).
  - EIP-1193 standard provider integration for Web3 wallets.
  - `IntersectionObserver` for scroll-triggered reveal animations.

---

## 💻 How to Run Locally

### Option 1: Direct File Opening
Double-click [`index.html`](index.html) or open it in any modern browser (Chrome, Brave, Firefox, Edge, Safari).

### Option 2: Local HTTP Server (Recommended)
Running through an HTTP server ensures full Web Crypto and EIP-1193 browser extension support:

```bash
# Using Python 3:
python -m http.server 8000

# Using Node.js npx:
npx serve .

# Or using PHP:
php -S localhost:8000
```
Then navigate to `http://localhost:8000` in your browser.

---

## 🦊 Web3 Wallet Integration (10% Bonus)

The wallet module supports **two modes**:

### 1. Real MetaMask / EIP-1193 Browser Extension:
- Click `> connect_wallet` in the header or in Section 08.
- Triggers standard `window.ethereum.request({ method: 'eth_requestAccounts' })`.
- Displays truncated address (`0x71c...976f`), detected chain network (Mainnet, Sepolia, Polygon, etc.), and balance in ETH via `eth_getBalance`.
- Gracefully handles user rejection (EIP-1193 error 4001) without unhandled console errors.
- If no extension is installed, presents a friendly terminal modal with safe links to MetaMask.

### 2. Built-in "Simulation Mode" (For Judges & Evaluators):
- Toggle the **"Simulated Wallet Mode"** switch in the Wallet playground section.
- Instantly connects a mock account `0x8a92...e41C` with `2.4500 ETH` on `Sepolia Testnet`.
- Allows anyone without MetaMask installed to test the complete user experience!

> **Security Note:** This implementation is strictly frontend-only. It never requests private keys, never asks for seed phrases, and never stores credentials.

---

## ♿ Accessibility & Usability (WCAG AA/AAA)
- **Contrast**: Muted body text (`#c9d1d9`) on dark charcoal (`#0d1117`) achieves an **11.5:1 contrast ratio**, far exceeding the 4.5:1 WCAG AA minimum.
- **Reduced Motion**: Respects `prefers-reduced-motion` to disable animations and scanlines for sensitive users.
- **CRT Toggle**: A quick-access button in the header allows users to toggle scanlines ON or OFF.
- **Keyboard Navigation**: Skip-to-content link, logical tab indexes, and Arrow key navigation in the Fact Carousel.
- **Screen Readers**: Semantic tags and ARIA live regions for log updates.

---

## 📜 Git Hygiene & Commit History
The project was developed with clean, incremental git commits adhering to the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat: project structure and retro terminal design tokens`
- `feat: interactive network simulator canvas (centralized vs decentralized)`
- `feat: sha-256 blockchain ledger simulator and tamper demonstration`
- `feat: smart contract vending machine with line-by-line solidity trace`
- `feat: crypto gas estimator and comparison architecture`
- `feat: erc-721 nft inspector and simulated transfer`
- `feat: dao governance voting console with real-time quorum`
- `feat: quick-fact terminal carousel and 8-bit web audio effects`
- `feat: eip-1193 wallet connect integration and simulation fallback`
- `docs: comprehensive documentation and setup guide`

---

## ⚖️ Disclaimer
*This website is an educational demonstration built for a hackathon challenge. All blockchain transactions, mining steps, and token balances are simulated client-side. Nothing on this site constitutes financial or investment advice.*
