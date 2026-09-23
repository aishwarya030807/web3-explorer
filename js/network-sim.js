/**
 * Interactive Network Topology Simulator (Centralized vs Decentralized Mesh)
 * Demonstrates Single Point of Failure vs Distributed Resilience
 */

class NetworkSimulator {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.mode = 'centralized'; // 'centralized' | 'decentralized'
    this.nodes = [];
    this.packets = [];
    this.isCentralServerDown = false;
    this.animFrameId = null;
    this.hudActiveNodes = document.getElementById('hud-active-nodes');
    this.hudNetworkStatus = document.getElementById('hud-network-status');
    this.hudLatency = document.getElementById('hud-latency');

    this.initCanvasSize();
    this.initNodes();
    this.bindEvents();
    this.startLoop();
  }

  initCanvasSize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height || 320;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  setMode(mode) {
    this.mode = mode;
    this.isCentralServerDown = false;
    this.initNodes();
    this.updateHUD();
  }

  initNodes() {
    this.nodes = [];
    this.packets = [];
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.36;

    if (this.mode === 'centralized') {
      // Centralized: Hub at center, 7 satellites around
      this.nodes.push({
        id: 'center',
        x: cx,
        y: cy,
        label: 'CENTRAL_SERVER',
        isCenter: true,
        isDown: this.isCentralServerDown,
        radius: 18
      });

      const count = 7;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        this.nodes.push({
          id: `client-${i}`,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          label: `CLIENT_${i + 1}`,
          isCenter: false,
          isDown: false,
          radius: 9
        });
      }
    } else {
      // Decentralized P2P: 8 peer nodes in a resilient mesh
      const count = 8;
      for (let i = 0; i < count; i++) {
        const angle = (i * 2 * Math.PI) / count;
        this.nodes.push({
          id: `peer-${i}`,
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle),
          label: `NODE_${i + 1}`,
          isCenter: false,
          isDown: false,
          radius: 12
        });
      }
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.initCanvasSize();
      this.initNodes();
    });

    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Check if user clicked a node
      for (const node of this.nodes) {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        if (Math.hypot(dx, dy) <= node.radius + 8) {
          if (this.mode === 'centralized') {
            if (node.isCenter) {
              this.toggleCentralServer();
            }
          } else {
            // Decentralized mode: toggle individual peer
            node.isDown = !node.isDown;
            if (window.terminalAudio) {
              node.isDown ? window.terminalAudio.playWarning() : window.terminalAudio.playClick();
            }
            this.updateHUD();
          }
          break;
        }
      }
    });
  }

  toggleCentralServer() {
    this.isCentralServerDown = !this.isCentralServerDown;
    const centerNode = this.nodes.find(n => n.isCenter);
    if (centerNode) centerNode.isDown = this.isCentralServerDown;

    if (window.terminalAudio) {
      this.isCentralServerDown ? window.terminalAudio.playWarning() : window.terminalAudio.playSuccess();
    }
    this.updateHUD();
  }

  updateHUD() {
    const activeCount = this.nodes.filter(n => !n.isDown).length;
    if (this.hudActiveNodes) {
      this.hudActiveNodes.textContent = `${activeCount}/${this.nodes.length} ONLINE`;
    }
    if (this.hudNetworkStatus) {
      if (this.mode === 'centralized') {
        if (this.isCentralServerDown) {
          this.hudNetworkStatus.textContent = 'SYSTEM OUTAGE: 0% REACHABLE';
          this.hudNetworkStatus.style.color = 'var(--phosphor-red)';
        } else {
          this.hudNetworkStatus.textContent = 'CENTRALIZED (SINGLE POINT OF FAILURE)';
          this.hudNetworkStatus.style.color = 'var(--phosphor-amber)';
        }
      } else {
        const healthyRatio = activeCount / this.nodes.length;
        if (healthyRatio >= 0.5) {
          this.hudNetworkStatus.textContent = 'RESILIENT: CONSENSUS ACTIVE (100% UPTIME)';
          this.hudNetworkStatus.style.color = 'var(--phosphor-green)';
        } else {
          this.hudNetworkStatus.textContent = 'DEGRADED: MINORITY NODES ONLINE';
          this.hudNetworkStatus.style.color = 'var(--phosphor-amber)';
        }
      }
    }
    if (this.hudLatency) {
      this.hudLatency.textContent = this.isCentralServerDown ? 'ERR_TIMEOUT' : `${Math.floor(18 + Math.random() * 8)}ms`;
    }
  }

  spawnPacket() {
    if (this.mode === 'centralized') {
      if (this.isCentralServerDown) return;
      const centerNode = this.nodes[0];
      const clients = this.nodes.slice(1);
      const randomClient = clients[Math.floor(Math.random() * clients.length)];

      const toCenter = Math.random() > 0.5;
      this.packets.push({
        from: toCenter ? randomClient : centerNode,
        to: toCenter ? centerNode : randomClient,
        progress: 0,
        speed: 0.015 + Math.random() * 0.01,
        color: '#58a6ff'
      });
    } else {
      const aliveNodes = this.nodes.filter(n => !n.isDown);
      if (aliveNodes.length < 2) return;

      const from = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
      let to = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
      while (to === from && aliveNodes.length > 1) {
        to = aliveNodes[Math.floor(Math.random() * aliveNodes.length)];
      }

      this.packets.push({
        from,
        to,
        progress: 0,
        speed: 0.012 + Math.random() * 0.01,
        color: '#3fb950'
      });
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background grid lines (subtle retro terminal graph)
    this.ctx.strokeStyle = 'rgba(40, 52, 70, 0.25)';
    this.ctx.lineWidth = 1;
    const step = 32;
    for (let x = 0; x < this.width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Draw Connections
    if (this.mode === 'centralized') {
      const center = this.nodes[0];
      for (let i = 1; i < this.nodes.length; i++) {
        const client = this.nodes[i];
        this.ctx.beginPath();
        this.ctx.moveTo(center.x, center.y);
        this.ctx.lineTo(client.x, client.y);

        if (this.isCentralServerDown) {
          this.ctx.strokeStyle = 'rgba(248, 81, 73, 0.25)';
          this.ctx.setLineDash([4, 4]);
        } else {
          this.ctx.strokeStyle = 'rgba(88, 166, 255, 0.22)';
          this.ctx.setLineDash([]);
        }
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        this.ctx.setLineDash([]);
      }
    } else {
      // Mesh connections: connect each node to its 2 neighbors + 1 chord
      const count = this.nodes.length;
      this.ctx.lineWidth = 1.5;
      for (let i = 0; i < count; i++) {
        const n1 = this.nodes[i];
        const nextIndices = [(i + 1) % count, (i + 2) % count, (i + 4) % count];

        for (const idx of nextIndices) {
          const n2 = this.nodes[idx];
          const isLinkBroken = n1.isDown || n2.isDown;

          this.ctx.beginPath();
          this.ctx.moveTo(n1.x, n1.y);
          this.ctx.lineTo(n2.x, n2.y);

          if (isLinkBroken) {
            this.ctx.strokeStyle = 'rgba(248, 81, 73, 0.15)';
            this.ctx.setLineDash([4, 6]);
          } else {
            this.ctx.strokeStyle = 'rgba(63, 185, 80, 0.25)';
            this.ctx.setLineDash([]);
          }
          this.ctx.stroke();
          this.ctx.setLineDash([]);
        }
      }
    }

    // Draw & Update Packets
    if (Math.random() < 0.22 && this.packets.length < 15) {
      this.spawnPacket();
    }

    for (let i = this.packets.length - 1; i >= 0; i--) {
      const p = this.packets[i];
      if (p.from.isDown || p.to.isDown) {
        this.packets.splice(i, 1);
        continue;
      }

      p.progress += p.speed;
      if (p.progress >= 1) {
        this.packets.splice(i, 1);
        continue;
      }

      const currX = p.from.x + (p.to.x - p.from.x) * p.progress;
      const currY = p.from.y + (p.to.y - p.from.y) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(currX, currY, 3, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Draw Nodes
    for (const node of this.nodes) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      let fillColor = '#161b22';
      let strokeColor = '#3fb950';

      if (this.mode === 'centralized') {
        if (node.isCenter) {
          strokeColor = node.isDown ? '#f85149' : '#58a6ff';
          fillColor = node.isDown ? 'rgba(248, 81, 73, 0.2)' : 'rgba(88, 166, 255, 0.25)';
        } else {
          strokeColor = this.isCentralServerDown ? '#8b949e' : '#58a6ff';
        }
      } else {
        strokeColor = node.isDown ? '#f85149' : '#3fb950';
        fillColor = node.isDown ? 'rgba(248, 81, 73, 0.15)' : 'rgba(63, 185, 80, 0.15)';
      }

      this.ctx.fillStyle = fillColor;
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = strokeColor;
      this.ctx.stroke();

      // Inner pulse dot if online
      if (!node.isDown && (!this.isCentralServerDown || !node.isCenter)) {
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.isCenter ? 5 : 3, 0, Math.PI * 2);
        this.ctx.fillStyle = strokeColor;
        this.ctx.fill();
      }

      // Label
      this.ctx.font = '10px "JetBrains Mono", monospace';
      this.ctx.fillStyle = node.isDown ? '#f85149' : '#8b949e';
      this.ctx.textAlign = 'center';
      const labelText = node.isDown ? 'OFFLINE' : node.label;
      this.ctx.fillText(labelText, node.x, node.y + node.radius + 14);
    }
  }

  startLoop() {
    const loop = () => {
      this.draw();
      this.animFrameId = requestAnimationFrame(loop);
    };
    loop();
  }

  destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
  }
}

window.NetworkSimulator = NetworkSimulator;
