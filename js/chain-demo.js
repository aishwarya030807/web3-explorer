/**
 * Interactive Blockchain Simulator
 * Cryptographic Hashing (SHA-256), Block Mining, & Immutability Tamper Demo
 */

class BlockchainSimulator {
  constructor() {
    this.chain = [];
    this.difficulty = 1; // Number of leading hex zeros required for proof-of-work demo
    this.isTampered = false;
    this.tamperedBlockIndex = -1;

    this.chainTrackEl = document.getElementById('chain-track');
    this.blockDataInput = document.getElementById('block-data-input');
    this.mineBtn = document.getElementById('btn-mine-block');
    this.tamperBtn = document.getElementById('btn-tamper-chain');
    this.restoreBtn = document.getElementById('btn-restore-chain');
    this.terminalLogEl = document.getElementById('chain-terminal-log');

    this.init();
  }

  // Pure Web Crypto SHA-256 calculation
  async sha256(message) {
    if (window.crypto && window.crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Simple fallback 32-bit hash if subtle crypto not in secure context
      let hash = 0;
      for (let i = 0; i < message.length; i++) {
        hash = ((hash << 5) - hash) + message.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16).padStart(64, '0');
    }
  }

  async init() {
    this.log('Initializing cryptographic chain simulator...', 'info');
    // Create Genesis Block #0
    const genesisTime = new Date().toLocaleTimeString();
    const genesisData = 'Genesis Block: Hello Decentralized World';
    const genesisPrevHash = '0000000000000000000000000000000000000000000000000000000000000000';
    const { nonce, hash } = await this.mineProofOfWork(0, genesisTime, genesisData, genesisPrevHash);

    this.chain.push({
      index: 0,
      timestamp: genesisTime,
      data: genesisData,
      prevHash: genesisPrevHash,
      nonce: nonce,
      hash: hash,
      originalData: genesisData,
      originalHash: hash
    });

    // Pre-populate Block #1 for immediate visual chain
    await this.addBlock('Alice -> Bob: 2.50 ETH [Tx #001]', false);

    this.render();
    this.bindEvents();
    this.log('[BLOCK #0] Genesis block initialized. Consensus: 100% Valid.', 'success');
  }

  async mineProofOfWork(index, timestamp, data, prevHash) {
    let nonce = 0;
    const prefix = '0'.repeat(this.difficulty);
    while (true) {
      const raw = `${index}-${timestamp}-${data}-${prevHash}-${nonce}`;
      const hash = await this.sha256(raw);
      if (hash.startsWith(prefix)) {
        return { nonce, hash };
      }
      nonce++;
      if (nonce > 10000) return { nonce, hash }; // safety break
    }
  }

  async addBlock(customData, logMessage = true) {
    const prevBlock = this.chain[this.chain.length - 1];
    const index = this.chain.length;
    const timestamp = new Date().toLocaleTimeString();
    const data = customData || `Tx: User_${Math.floor(Math.random() * 900 + 100)} transfer 0.85 ETH`;
    const prevHash = prevBlock ? prevBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';

    if (logMessage) {
      this.log(`Mining Block #${index}... Searching for valid nonce (difficulty: ${this.difficulty})...`, 'info');
    }

    const { nonce, hash } = await this.mineProofOfWork(index, timestamp, data, prevHash);

    const newBlock = {
      index,
      timestamp,
      data,
      prevHash,
      nonce,
      hash,
      originalData: data,
      originalHash: hash
    };

    this.chain.push(newBlock);
    this.render();

    if (logMessage) {
      this.log(`[BLOCK #${index} MINED] Nonce: ${nonce} | Hash: ${hash.slice(0, 16)}... ✓ Linked to #${index - 1}`, 'success');
      if (window.terminalAudio) window.terminalAudio.playSuccess();
    }
  }

  // Tamper with Block #1 to demonstrate immutability breakdown
  async tamperBlock(index = 1) {
    if (this.chain.length <= index) {
      this.log('Please mine at least one block before testing tampering.', 'warn');
      return;
    }

    this.isTampered = true;
    this.tamperedBlockIndex = index;
    const targetBlock = this.chain[index];

    // Alter data maliciously
    targetBlock.data = 'MALICIOUS_INJECTION: Eve transferred 500 ETH to Hacker_Vault';
    // Recompute target block's hash with altered data
    const raw = `${targetBlock.index}-${targetBlock.timestamp}-${targetBlock.data}-${targetBlock.prevHash}-${targetBlock.nonce}`;
    targetBlock.hash = await this.sha256(raw);

    this.render();
    this.log(`[TAMPER DETECTED] Block #${index} payload altered! Hash changed to: ${targetBlock.hash.slice(0, 16)}...`, 'error');
    this.log(`[CHAIN BROKEN] Block #${index + 1} previousHash mismatch! Cryptographic integrity broken!`, 'error');

    if (window.terminalAudio) window.terminalAudio.playWarning();
  }

  // Restore chain back to authentic state
  async restoreChain() {
    this.isTampered = false;
    this.tamperedBlockIndex = -1;

    for (let i = 0; i < this.chain.length; i++) {
      const b = this.chain[i];
      b.data = b.originalData;
      b.hash = b.originalHash;
      if (i > 0) {
        b.prevHash = this.chain[i - 1].hash;
      }
    }

    this.render();
    this.log('[CONSENSUS RESTORED] Cryptographic hashes validated. All blocks re-linked successfully.', 'success');
    if (window.terminalAudio) window.terminalAudio.playSuccess();
  }

  render() {
    if (!this.chainTrackEl) return;
    this.chainTrackEl.innerHTML = '';

    this.chain.forEach((block, idx) => {
      const isBlockTampered = this.isTampered && idx >= this.tamperedBlockIndex;
      const isGenesis = idx === 0;

      // Render Block Card
      const card = document.createElement('div');
      card.className = `block-card ${isBlockTampered ? 'tampered' : 'valid'}`;
      card.setAttribute('data-block-id', block.index);

      card.innerHTML = `
        <div class="block-header">
          <span class="block-num">${isGenesis ? 'GENESIS BLOCK #0' : `BLOCK #${block.index}`}</span>
          <span class="block-timestamp">${block.timestamp}</span>
        </div>

        <div class="block-field">
          <span class="field-label">DATA / LEDGER TRANSACTIONS</span>
          <div class="field-value" title="${block.data}">${block.data}</div>
        </div>

        <div class="block-field">
          <span class="field-label">PREVIOUS HASH</span>
          <div class="field-value hash-text" title="${block.prevHash}">${block.prevHash.slice(0, 18)}...</div>
        </div>

        <div class="block-field">
          <span class="field-label">CURRENT HASH (SHA-256)</span>
          <div class="field-value hash-text" title="${block.hash}">${block.hash.slice(0, 18)}...</div>
        </div>

        <div class="block-field" style="display: flex; flex-direction: row; justify-content: space-between; align-items: center;">
          <span class="field-label">PROOF NONCE: <strong style="color: var(--phosphor-amber)">${block.nonce}</strong></span>
          <span class="badge-retro ${isBlockTampered ? 'red' : 'green'}">
            ${isBlockTampered ? '✕ INVALID' : '✓ VERIFIED'}
          </span>
        </div>
      `;

      this.chainTrackEl.appendChild(card);

      // Render chain link arrow if not the last block
      if (idx < this.chain.length - 1) {
        const link = document.createElement('div');
        const isNextTampered = this.isTampered && (idx + 1 >= this.tamperedBlockIndex);
        link.className = `chain-link-arrow ${isNextTampered ? 'broken' : ''}`;
        link.innerHTML = isNextTampered ? '⤬' : '⇄';
        link.title = isNextTampered ? 'Broken cryptographic link' : 'Cryptographically verified pointer';
        this.chainTrackEl.appendChild(link);
      }
    });

    // Auto-scroll track to the right
    this.chainTrackEl.parentElement.scrollLeft = this.chainTrackEl.parentElement.scrollWidth;
  }

  log(msg, type = 'info') {
    if (!this.terminalLogEl) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">${msg}</span>`;
    this.terminalLogEl.appendChild(entry);
    this.terminalLogEl.scrollTop = this.terminalLogEl.scrollHeight;
  }

  bindEvents() {
    if (this.mineBtn) {
      this.mineBtn.addEventListener('click', async () => {
        const customData = this.blockDataInput ? this.blockDataInput.value.trim() : '';
        this.mineBtn.disabled = true;
        await this.addBlock(customData || undefined, true);
        if (this.blockDataInput) this.blockDataInput.value = '';
        this.mineBtn.disabled = false;
      });
    }

    if (this.tamperBtn) {
      this.tamperBtn.addEventListener('click', () => {
        this.tamperBlock(1);
      });
    }

    if (this.restoreBtn) {
      this.restoreBtn.addEventListener('click', () => {
        this.restoreChain();
      });
    }
  }
}

window.BlockchainSimulator = BlockchainSimulator;
