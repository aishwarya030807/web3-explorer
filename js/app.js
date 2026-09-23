/**
 * Application Entry & Coordination Script
 * Manages module initialization, CRT scanlines, audio toggles, gas calculator, and scroll triggers
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Subsystems
  const audio = window.terminalAudio;
  const netSim = new window.NetworkSimulator('network-canvas');
  const chainSim = new window.BlockchainSimulator();
  const contractSim = new window.SmartContractSimulator();
  const nftSim = new window.NFTGallerySimulator();
  const daoSim = new window.DAOVotingSimulator();
  const carousel = new window.FactCarousel();
  const walletConn = new window.Web3WalletConnector();

  // 2. Network Simulator Mode Toggle Buttons
  const btnModeCentral = document.getElementById('btn-mode-central');
  const btnModeDecentral = document.getElementById('btn-mode-decentral');
  const btnKillServer = document.getElementById('btn-kill-server');

  if (btnModeCentral && btnModeDecentral) {
    btnModeCentral.addEventListener('click', () => {
      btnModeCentral.classList.add('active');
      btnModeDecentral.classList.remove('active');
      netSim.setMode('centralized');
      if (btnKillServer) btnKillServer.style.display = 'inline-flex';
      if (audio) audio.playClick();
    });

    btnModeDecentral.addEventListener('click', () => {
      btnModeDecentral.classList.add('active');
      btnModeCentral.classList.remove('active');
      netSim.setMode('decentralized');
      if (btnKillServer) btnKillServer.style.display = 'none';
      if (audio) audio.playClick();
    });
  }

  if (btnKillServer) {
    btnKillServer.addEventListener('click', () => {
      netSim.toggleCentralServer();
    });
  }

  // 3. CRT Scanline Toggle
  const toggleCrtBtn = document.getElementById('toggle-crt');
  const isCrtSavedOff = localStorage.getItem('web3_terminal_crt') === 'off';
  if (isCrtSavedOff) {
    document.body.classList.add('crt-off');
    if (toggleCrtBtn) toggleCrtBtn.classList.remove('active');
  } else {
    if (toggleCrtBtn) toggleCrtBtn.classList.add('active');
  }

  if (toggleCrtBtn) {
    toggleCrtBtn.addEventListener('click', () => {
      const isOff = document.body.classList.toggle('crt-off');
      toggleCrtBtn.classList.toggle('active', !isOff);
      localStorage.setItem('web3_terminal_crt', isOff ? 'off' : 'on');
      if (audio) audio.playClick();
    });
  }

  // 4. Sound FX Toggle
  const toggleSoundBtn = document.getElementById('toggle-sound');
  if (toggleSoundBtn) {
    toggleSoundBtn.addEventListener('click', () => {
      const isSoundOn = audio.toggle();
      toggleSoundBtn.classList.toggle('active', isSoundOn);
      toggleSoundBtn.innerHTML = isSoundOn ? '<span>🔊</span> SOUND: ON' : '<span>🔇</span> SOUND: OFF';
      if (isSoundOn) audio.playSuccess();
    });
  }

  // 5. Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      if (audio) audio.playClick();
    });

    // Close when clicking nav links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 6. Interactive Gas Fee Estimator
  let selectedTxGas = 21000; // default simple transfer
  let selectedGwei = 20;     // default medium

  const txPills = document.querySelectorAll('[data-gas-tx]');
  const gweiPills = document.querySelectorAll('[data-gas-gwei]');
  const gasTotalEthEl = document.getElementById('gas-total-eth');
  const gasTotalUsdEl = document.getElementById('gas-total-usd');
  const gasFormulaDetail = document.getElementById('gas-formula-detail');

  function calculateGas() {
    const ethPriceUsd = 3000;
    // Total ETH = Gas Limit * Gas Price in Gwei * 10^-9
    const totalEth = (selectedTxGas * selectedGwei * 1e-9);
    const totalUsd = totalEth * ethPriceUsd;

    if (gasTotalEthEl) gasTotalEthEl.textContent = `${totalEth.toFixed(6)} ETH`;
    if (gasTotalUsdEl) gasTotalUsdEl.textContent = `~$${totalUsd.toFixed(2)} USD`;
    if (gasFormulaDetail) {
      gasFormulaDetail.textContent = `${selectedTxGas.toLocaleString()} units × ${selectedGwei} Gwei`;
    }
  }

  txPills.forEach(pill => {
    pill.addEventListener('click', () => {
      txPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedTxGas = parseInt(pill.getAttribute('data-gas-tx'), 10);
      calculateGas();
      if (audio) audio.playClick();
    });
  });

  gweiPills.forEach(pill => {
    pill.addEventListener('click', () => {
      gweiPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedGwei = parseInt(pill.getAttribute('data-gas-gwei'), 10);
      calculateGas();
      if (audio) audio.playClick();
    });
  });

  calculateGas();

  // 7. Scroll-Triggered Reveal Animations
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach(el => observer.observe(el));
});
