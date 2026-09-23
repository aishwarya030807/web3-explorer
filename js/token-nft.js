/**
 * NFT (Non-Fungible Token) & Digital Provenance Simulator
 * Demonstrates ERC-721 uniqueness, verifiable metadata, & cryptographic ownership transfer
 */

class NFTGallerySimulator {
  constructor() {
    this.nfts = [
      {
        id: 42,
        name: 'CyberKey #0042',
        contract: '0x71c7656ec7ab88b098defb751b7401b5f6d8976f',
        creator: '0x0000000000000000000000000000000000000001',
        owner: '0x8a92F1c356A15217983693e5C48A25fE7364e41C',
        art: `
    ┌──────────┐
    │ [★] KEY  │
    │  ╔═╗══╦  │
    │  ╚═╝  ╩  │
    │  #0042   │
    └──────────┘`,
        attributes: { type: 'Access Key', encryption: 'Quantum-Grade', rarity: 'Legendary' }
      },
      {
        id: 1,
        name: 'GenesisNode #0001',
        contract: '0x329239599Ac606f13a985161249da26e22442f78',
        creator: '0x1111111111111111111111111111111111111111',
        owner: '0x4f8287F138245892D17228833918294918239023',
        art: `
    ┌──────────┐
    │  NODE #1 │
    │   (●)    │
    │  / | \\   │
    │ (●)-(●)  │
    └──────────┘`,
        attributes: { role: 'Validator', genesis_block: 0, uptime: '99.99%' }
      },
      {
        id: 777,
        name: 'TerminalPioneer #0777',
        contract: '0x5829a28104820194820194820194820194820194',
        creator: '0x2222222222222222222222222222222222222222',
        owner: '0x9923847291847192847192847192847192847192',
        art: `
    ┌──────────┐
    │ >_ RETRO │
    │ [■ _ ■]  │
    │  HACKER  │
    │  #0777   │
    └──────────┘`,
        attributes: { guild: 'Cypherpunks', badge_level: 99, status: 'Active' }
      }
    ];

    this.containerEl = document.getElementById('nft-gallery-grid');
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';

    this.nfts.forEach(nft => {
      const card = document.createElement('div');
      card.className = 'nft-card';
      card.id = `nft-card-${nft.id}`;

      const jsonMetadata = JSON.stringify({
        token_id: nft.id,
        name: nft.name,
        contract: nft.contract,
        creator_signature: '0x98f2...verified',
        current_owner: nft.owner,
        attributes: nft.attributes
      }, null, 2);

      card.innerHTML = `
        <div class="terminal-header">
          <div class="terminal-controls">
            <span class="control-dot close"></span>
            <span class="control-dot minimize"></span>
            <span class="control-dot maximize"></span>
          </div>
          <span class="terminal-title">token_id_${nft.id}.json</span>
          <span class="badge-retro cyan">ERC-721</span>
        </div>

        <div class="nft-visual-window">
          <pre class="ascii-art">${nft.art}</pre>
        </div>

        <div class="nft-card-body">
          <div style="display: flex; justify-content: space-between; align-items: baseline;">
            <h4 style="font-size: 1rem; color: var(--text-bright);">${nft.name}</h4>
            <span class="badge-retro green">AUTHENTIC</span>
          </div>

          <div class="block-field">
            <span class="field-label">CURRENT OWNER</span>
            <div class="field-value hash-text" id="owner-display-${nft.id}" title="${nft.owner}">
              ${nft.owner.slice(0, 10)}...${nft.owner.slice(-6)}
            </div>
          </div>

          <div style="display: flex; gap: var(--space-xs); margin-top: 4px;">
            <button class="btn-terminal btn-terminal-sm" id="btn-toggle-meta-${nft.id}">
              Inspect Metadata
            </button>
            <button class="btn-terminal btn-terminal-sm btn-terminal-primary" id="btn-transfer-${nft.id}">
              Simulate Transfer
            </button>
          </div>

          <div class="nft-meta-raw" id="meta-view-${nft.id}" style="display: none;">
            <pre>${jsonMetadata}</pre>
          </div>
        </div>
      `;

      this.containerEl.appendChild(card);

      // Event: Toggle Metadata View
      const toggleMetaBtn = card.querySelector(`#btn-toggle-meta-${nft.id}`);
      const metaView = card.querySelector(`#meta-view-${nft.id}`);
      toggleMetaBtn.addEventListener('click', () => {
        const isHidden = metaView.style.display === 'none';
        metaView.style.display = isHidden ? 'block' : 'none';
        toggleMetaBtn.textContent = isHidden ? 'Hide Metadata' : 'Inspect Metadata';
        if (window.terminalAudio) window.terminalAudio.playClick();
      });

      // Event: Simulate Transfer
      const transferBtn = card.querySelector(`#btn-transfer-${nft.id}`);
      transferBtn.addEventListener('click', () => {
        this.simulateTransfer(nft);
      });
    });
  }

  simulateTransfer(nft) {
    // Generate new random hex address
    const randomHex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newOwner = `0x${randomHex}`;
    const prevOwner = nft.owner;
    nft.owner = newOwner;

    const ownerDisplay = document.getElementById(`owner-display-${nft.id}`);
    if (ownerDisplay) {
      ownerDisplay.style.color = 'var(--phosphor-green)';
      ownerDisplay.textContent = `${newOwner.slice(0, 10)}...${newOwner.slice(-6)}`;
      ownerDisplay.title = newOwner;
    }

    // Update metadata json in preview if open
    const metaView = document.getElementById(`meta-view-${nft.id}`);
    if (metaView) {
      metaView.querySelector('pre').textContent = JSON.stringify({
        token_id: nft.id,
        name: nft.name,
        contract: nft.contract,
        creator_signature: '0x98f2...verified',
        current_owner: nft.owner,
        attributes: nft.attributes
      }, null, 2);
    }

    if (window.terminalAudio) window.terminalAudio.playSuccess();
    alert(`[ON-CHAIN TRANSFER EVENT]\nToken #${nft.id} (${nft.name}) successfully transferred!\n\nFrom: ${prevOwner}\nTo: ${newOwner}\n\nOwnership cryptographic state updated on-chain.`);
  }
}

window.NFTGallerySimulator = NFTGallerySimulator;
