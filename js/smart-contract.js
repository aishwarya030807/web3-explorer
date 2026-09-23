/**
 * Smart Contract Simulator: The Cryptographic Vending Machine
 * Demonstrates deterministic, autonomous code execution without intermediaries
 */

class SmartContractSimulator {
  constructor() {
    this.items = [
      { id: 1, name: 'CyberSoda', price: 0.02, stock: 4, icon: '🥤' },
      { id: 2, name: 'CryptoCoffee', price: 0.01, stock: 6, icon: '☕' },
      { id: 3, name: 'ZK-Snack', price: 0.03, stock: 3, icon: '🥨' }
    ];

    this.selectedItemId = 1;
    this.depositedEth = 0.02;
    this.isExecuting = false;

    this.vendingShelfEl = document.getElementById('vending-shelf');
    this.depositedEthDisplay = document.getElementById('deposited-eth-val');
    this.btnExecute = document.getElementById('btn-execute-contract');
    this.btnAdd01 = document.getElementById('btn-add-01');
    this.btnAdd02 = document.getElementById('btn-add-02');
    this.btnResetEth = document.getElementById('btn-reset-eth');
    this.contractLogEl = document.getElementById('contract-terminal-log');

    this.init();
  }

  init() {
    this.renderShelf();
    this.updateEthDisplay();
    this.bindEvents();
    this.log('Smart contract [Web3VendingMachine.sol] deployed at 0x93f4...2b01', 'info');
  }

  renderShelf() {
    if (!this.vendingShelfEl) return;
    this.vendingShelfEl.innerHTML = '';

    this.items.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `vending-item-btn ${item.id === this.selectedItemId ? 'selected' : ''}`;
      btn.setAttribute('data-id', item.id);
      btn.innerHTML = `
        <span class="item-icon">${item.icon}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-price">${item.price} ETH</span>
        <span class="badge-retro ${item.stock > 0 ? 'green' : 'red'}" style="font-size: 0.7rem;">
          Stock: ${item.stock}
        </span>
      `;

      btn.addEventListener('click', () => {
        if (this.isExecuting) return;
        this.selectedItemId = item.id;
        this.renderShelf();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });

      this.vendingShelfEl.appendChild(btn);
    });
  }

  updateEthDisplay() {
    if (this.depositedEthDisplay) {
      this.depositedEthDisplay.textContent = `${this.depositedEth.toFixed(2)} ETH`;
    }
  }

  highlightLine(lineNumber) {
    document.querySelectorAll('.solidity-code .code-line').forEach(el => {
      el.classList.remove('active');
    });
    const target = document.getElementById(`sol-line-${lineNumber}`);
    if (target) {
      target.classList.add('active');
    }
  }

  clearHighlight() {
    document.querySelectorAll('.solidity-code .code-line').forEach(el => {
      el.classList.remove('active');
    });
  }

  log(msg, type = 'info') {
    if (!this.contractLogEl) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">${msg}</span>`;
    this.contractLogEl.appendChild(entry);
    this.contractLogEl.scrollTop = this.contractLogEl.scrollHeight;
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async executeContract() {
    if (this.isExecuting) return;
    this.isExecuting = true;
    this.btnExecute.disabled = true;

    const item = this.items.find(i => i.id === this.selectedItemId);

    this.log(`> CALL: purchase(itemId: ${item.id}) with msg.value: ${this.depositedEth.toFixed(2)} ETH`, 'info');

    // Step 1: Function entry
    this.highlightLine(1);
    await this.sleep(400);

    // Step 2: Validate item stock
    this.highlightLine(2);
    await this.sleep(400);
    if (item.stock <= 0) {
      this.log(`[EVM REVERT] "Out of stock": Item ${item.name} has 0 inventory. Transaction cancelled.`, 'error');
      if (window.terminalAudio) window.terminalAudio.playWarning();
      this.isExecuting = false;
      this.btnExecute.disabled = false;
      this.clearHighlight();
      return;
    }

    // Step 3: Validate payment
    this.highlightLine(3);
    await this.sleep(400);
    if (this.depositedEth < item.price) {
      this.log(`[EVM REVERT] "Insufficient ETH": Item costs ${item.price} ETH but received ${this.depositedEth.toFixed(2)} ETH. Gas refunded.`, 'error');
      if (window.terminalAudio) window.terminalAudio.playWarning();
      this.isExecuting = false;
      this.btnExecute.disabled = false;
      this.clearHighlight();
      return;
    }

    // Step 4: State mutation (decrement stock)
    this.highlightLine(4);
    item.stock -= 1;
    this.renderShelf();
    await this.sleep(400);

    // Step 5: Transfer / Dispense token
    this.highlightLine(5);
    await this.sleep(400);

    // Step 6: Refund excess if applicable
    const excess = parseFloat((this.depositedEth - item.price).toFixed(2));
    this.highlightLine(6);
    if (excess > 0) {
      this.log(`[REFUND] Excess ${excess} ETH returned to caller (msg.sender)`, 'warn');
    }
    await this.sleep(400);

    // Step 7: Emit event
    this.highlightLine(7);
    this.log(`[EVENT EMITTED] ItemDispensed(buyer: 0xUser...4f82, item: "${item.name}") ✓ SUCCESS`, 'success');
    if (window.terminalAudio) window.terminalAudio.playSuccess();
    await this.sleep(300);

    // Reset payment
    this.depositedEth = 0.00;
    this.updateEthDisplay();

    this.clearHighlight();
    this.isExecuting = false;
    this.btnExecute.disabled = false;
  }

  bindEvents() {
    if (this.btnExecute) {
      this.btnExecute.addEventListener('click', () => {
        this.executeContract();
      });
    }

    if (this.btnAdd01) {
      this.btnAdd01.addEventListener('click', () => {
        if (this.isExecuting) return;
        this.depositedEth = parseFloat((this.depositedEth + 0.01).toFixed(2));
        this.updateEthDisplay();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
    }

    if (this.btnAdd02) {
      this.btnAdd02.addEventListener('click', () => {
        if (this.isExecuting) return;
        this.depositedEth = parseFloat((this.depositedEth + 0.02).toFixed(2));
        this.updateEthDisplay();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
    }

    if (this.btnResetEth) {
      this.btnResetEth.addEventListener('click', () => {
        if (this.isExecuting) return;
        this.depositedEth = 0.00;
        this.updateEthDisplay();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
    }
  }
}

window.SmartContractSimulator = SmartContractSimulator;
