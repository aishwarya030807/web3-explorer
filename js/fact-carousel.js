/**
 * Quick-Fact Terminal Carousel
 * Keyboard-navigable, accessible carousel with auto-advance and pause-on-hover
 */

class FactCarousel {
  constructor() {
    this.slides = [
      {
        id: 1,
        tag: 'FACT_LOG // 01',
        title: 'The Hidden Headline in the Genesis Block',
        desc: 'On January 3, 2009, Satoshi Nakamoto mined the very first Bitcoin block and permanently encoded a headline into the coinbase data: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks". It was both a verifiable timestamp and a clear philosophical critique of fractional-reserve central banking.'
      },
      {
        id: 2,
        tag: 'FACT_LOG // 02',
        title: 'The 99.95% Green Transition: "The Merge"',
        desc: 'In September 2022, Ethereum executed "The Merge," transitioning its consensus mechanism from computational energy-intensive Proof of Work (mining) to Proof of Stake (validators). This historic architectural upgrade slashed the entire network\'s global electricity consumption by ~99.95% overnight.'
      },
      {
        id: 3,
        tag: 'FACT_LOG // 03',
        title: 'True Ownership: Zero "Forgot Password" Buttons',
        desc: 'In Web2, companies hold your credentials in a database and can reset your password. In Web3, your public/private keypair is mathematically sovereign. If you lose your private key or seed phrase, no company, government, or customer support hotline can recover your assets.'
      },
      {
        id: 4,
        tag: 'FACT_LOG // 04',
        title: 'Composability: The "Money Legos" Phenomenon',
        desc: 'Smart contracts on a public blockchain are open and permissionless. Any developer can invoke and combine existing contracts without API keys, license agreements, or corporate permission—enabling financial protocols to assemble together just like software LEGO bricks.'
      },
      {
        id: 5,
        tag: 'FACT_LOG // 05',
        title: 'Zero-Knowledge Proofs: Truth Without Exposure',
        desc: 'ZK-SNARKs allow one party to prove to another that a statement is mathematically true (e.g., "I am over 18 years old" or "My wallet has sufficient balance") without revealing the underlying private data (birthdate or exact balance) to the verifier.'
      },
      {
        id: 6,
        tag: 'FACT_LOG // 06',
        title: 'Content Addressing vs Location Addressing',
        desc: 'The traditional web relies on Location Addressing (URLs like `site.com/doc.pdf`). If the server goes down, the link breaks (404). Decentralized protocols like IPFS use Content Addressing (the cryptographic hash of the file itself), meaning files are located by what they are, not where they live.'
      }
    ];

    this.currentIndex = 0;
    this.timer = null;
    this.isPaused = false;

    this.viewportEl = document.getElementById('carousel-viewport');
    this.dotsContainerEl = document.getElementById('carousel-dots');
    this.counterEl = document.getElementById('carousel-counter');
    this.btnPrev = document.getElementById('carousel-btn-prev');
    this.btnNext = document.getElementById('carousel-btn-next');
    this.containerEl = document.getElementById('facts-carousel-container');

    this.init();
  }

  init() {
    this.renderSlides();
    this.renderDots();
    this.updateSlide(0);
    this.bindEvents();
    this.startAutoPlay();
  }

  renderSlides() {
    if (!this.viewportEl) return;
    this.viewportEl.innerHTML = '';

    this.slides.forEach((slide, index) => {
      const slideEl = document.createElement('div');
      slideEl.className = `fact-slide ${index === 0 ? 'active' : ''}`;
      slideEl.setAttribute('data-index', index);
      slideEl.setAttribute('role', 'group');
      slideEl.setAttribute('aria-roledescription', 'slide');
      slideEl.setAttribute('aria-label', `${index + 1} of ${this.slides.length}`);

      slideEl.innerHTML = `
        <div class="fact-badge">// ${slide.tag}</div>
        <h3 class="fact-headline">${slide.title}</h3>
        <p class="fact-description">${slide.desc}</p>
      `;

      this.viewportEl.appendChild(slideEl);
    });
  }

  renderDots() {
    if (!this.dotsContainerEl) return;
    this.dotsContainerEl.innerHTML = '';

    this.slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        this.updateSlide(index);
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
      this.dotsContainerEl.appendChild(dot);
    });
  }

  updateSlide(index) {
    this.currentIndex = (index + this.slides.length) % this.slides.length;

    // Update slides
    const slideEls = this.viewportEl.querySelectorAll('.fact-slide');
    slideEls.forEach((el, idx) => {
      el.classList.toggle('active', idx === this.currentIndex);
    });

    // Update dots
    const dots = this.dotsContainerEl.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === this.currentIndex);
    });

    // Update counter
    if (this.counterEl) {
      this.counterEl.textContent = `[0${this.currentIndex + 1}/0${this.slides.length}]`;
    }
  }

  next() {
    this.updateSlide(this.currentIndex + 1);
  }

  prev() {
    this.updateSlide(this.currentIndex - 1);
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.timer = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, 6500);
  }

  stopAutoPlay() {
    if (this.timer) clearInterval(this.timer);
  }

  bindEvents() {
    if (this.btnNext) {
      this.btnNext.addEventListener('click', () => {
        this.next();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
    }

    if (this.btnPrev) {
      this.btnPrev.addEventListener('click', () => {
        this.prev();
        if (window.terminalAudio) window.terminalAudio.playClick();
      });
    }

    if (this.containerEl) {
      this.containerEl.addEventListener('mouseenter', () => {
        this.isPaused = true;
      });
      this.containerEl.addEventListener('mouseleave', () => {
        this.isPaused = false;
      });

      // Keyboard arrow navigation
      this.containerEl.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          this.next();
          if (window.terminalAudio) window.terminalAudio.playClick();
        } else if (e.key === 'ArrowLeft') {
          this.prev();
          if (window.terminalAudio) window.terminalAudio.playClick();
        }
      });
    }
  }
}

window.FactCarousel = FactCarousel;
