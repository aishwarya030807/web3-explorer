/**
 * DAO Governance & Voting Simulator
 * Demonstrates decentralized consensus, token-weighted voting, & autonomous treasury execution
 */

class DAOVotingSimulator {
  constructor() {
    this.userVotingPower = 100; // Simulated $GOV tokens
    this.proposals = [
      {
        id: 14,
        code: 'DIP-14',
        title: 'Allocate 5,000 $TREASURY to Open Source ZK-SNARK Cryptography Audits',
        description: 'Fund independent security audits for zero-knowledge privacy primitives to guarantee trustless verification.',
        proposer: '0x71c765...976f',
        yesVotes: 3450,
        noVotes: 620,
        quorumThreshold: 4000,
        userVoted: false
      },
      {
        id: 15,
        code: 'DIP-15',
        title: 'Upgrade Layer-2 Gas Compression Architecture & Rollup Adapter',
        description: 'Implement state compression protocols to reduce user transaction gas fees by an estimated 92%.',
        proposer: '0x4f8287...9023',
        yesVotes: 2100,
        noVotes: 1480,
        quorumThreshold: 4000,
        userVoted: false
      }
    ];

    this.containerEl = document.getElementById('proposals-list');
    this.logEl = document.getElementById('dao-terminal-log');
    this.init();
  }

  init() {
    this.render();
    this.log(`DAO Treasury Online: 250,000 $TREASURY | Active Governance Members: 1,420`, 'info');
  }

  log(msg, type = 'info') {
    if (!this.logEl) return;
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-${type}">${msg}</span>`;
    this.logEl.appendChild(entry);
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }

  render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = '';

    this.proposals.forEach(prop => {
      const totalVotes = prop.yesVotes + prop.noVotes;
      const yesPct = totalVotes > 0 ? ((prop.yesVotes / totalVotes) * 100).toFixed(1) : 0;
      const noPct = totalVotes > 0 ? ((prop.noVotes / totalVotes) * 100).toFixed(1) : 0;
      const quorumReached = totalVotes >= prop.quorumThreshold;
      const isPassing = quorumReached && (prop.yesVotes > prop.noVotes);

      const item = document.createElement('div');
      item.className = 'proposal-item';
      item.id = `proposal-${prop.id}`;

      item.innerHTML = `
        <div class="proposal-header">
          <div>
            <div style="display: flex; gap: var(--space-xs); align-items: center; margin-bottom: 4px;">
              <span class="badge-retro cyan">${prop.code}</span>
              <span class="badge-retro ${isPassing ? 'green' : (quorumReached ? 'red' : 'amber')}">
                ${isPassing ? '✓ QUORUM PASSED' : (quorumReached ? '✕ REJECTED' : '● VOTING ACTIVE')}
              </span>
            </div>
            <h4 style="font-size: 1.05rem; color: var(--text-bright);">${prop.title}</h4>
          </div>
          <div style="text-align: right; font-size: 0.75rem; color: var(--text-muted);">
            Proposer: <span class="hash-text" style="font-size: 0.72rem;">${prop.proposer}</span>
          </div>
        </div>

        <p style="font-size: 0.88rem; color: var(--text-muted); margin: 0;">${prop.description}</p>

        <!-- Progress track -->
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; margin-bottom: 4px;">
            <span style="color: var(--phosphor-green);">FOR: ${prop.yesVotes.toLocaleString()} (${yesPct}%)</span>
            <span style="color: var(--phosphor-red);">AGAINST: ${prop.noVotes.toLocaleString()} (${noPct}%)</span>
          </div>
          <div class="quorum-bar-track">
            <div class="quorum-fill-yes" style="width: ${yesPct}%;"></div>
            <div class="quorum-fill-no" style="width: ${noPct}%;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 4px;">
            <span>Total Cast: ${totalVotes.toLocaleString()} votes</span>
            <span>Quorum Threshold: ${prop.quorumThreshold.toLocaleString()}</span>
          </div>
        </div>

        <!-- Voting Actions -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-xs);">
          <div class="voting-btn-group">
            <button class="btn-terminal btn-terminal-sm btn-terminal-primary" id="btn-vote-yes-${prop.id}" ${prop.userVoted ? 'disabled' : ''}>
              Vote FOR (+${this.userVotingPower} $GOV)
            </button>
            <button class="btn-terminal btn-terminal-sm btn-terminal-danger" id="btn-vote-no-${prop.id}" ${prop.userVoted ? 'disabled' : ''}>
              Vote AGAINST (+${this.userVotingPower} $GOV)
            </button>
          </div>
          <span style="font-size: 0.75rem; color: ${prop.userVoted ? 'var(--phosphor-green)' : 'var(--text-muted)'};">
            ${prop.userVoted ? '✓ Your vote is recorded on-chain' : `Voting weight: ${this.userVotingPower} $GOV`}
          </span>
        </div>
      `;

      this.containerEl.appendChild(item);

      // Event Listeners
      const yesBtn = item.querySelector(`#btn-vote-yes-${prop.id}`);
      const noBtn = item.querySelector(`#btn-vote-no-${prop.id}`);

      if (yesBtn && !prop.userVoted) {
        yesBtn.addEventListener('click', () => this.castVote(prop, 'YES'));
      }
      if (noBtn && !prop.userVoted) {
        noBtn.addEventListener('click', () => this.castVote(prop, 'NO'));
      }
    });
  }

  castVote(proposal, choice) {
    if (proposal.userVoted) return;

    proposal.userVoted = true;
    if (choice === 'YES') {
      proposal.yesVotes += this.userVotingPower;
    } else {
      proposal.noVotes += this.userVotingPower;
    }

    if (window.terminalAudio) {
      choice === 'YES' ? window.terminalAudio.playSuccess() : window.terminalAudio.playClick();
    }

    this.log(`[VOTE RECORDED] Cast ${this.userVotingPower} $GOV votes ${choice} for ${proposal.code}. Transaction finalized.`, 'success');
    this.render();
  }
}

window.DAOVotingSimulator = DAOVotingSimulator;
