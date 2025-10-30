/* ===============================
   BIRTHDAY EXPERIENCE APP
   Interactive multi-stage birthday journey
================================ */

(() => {
  'use strict';

  // ============================================
// Global object to store user selections
// ============================================
// Initialize global object to store user selections
const userSelections = {
  quizAnswer: '',
  memoryChoice: '',
  galleryChoice: ''
};

  // ============================================
  // DOM ELEMENT REFERENCES
  // ============================================
  const stageArea = document.getElementById('stage-area');
  const particleField = document.getElementById('particle-field');
  const starfield = document.getElementById('starfield');

  // ============================================
  // APPLICATION STATE
  // ============================================
  let stage = 0;
  let password = '';
  let quizAnswer = '';
  let selectedMemory = null;
  let puzzleOrder = [];
  let secretCode = '';
  let shakeDetected = false;
  let isLocked = true;
  let transitionInProgress = false;

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
      particleCount: 50,
      starCount: 150,
      transitionDuration: 400,
      successDelay: 800,
      confettiCount: 60
  };

  // Image preloading for smooth transitions
  const IMAGES = [
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1000&q=80',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      'https://images.unsplash.com/photo-1464347601390-25b83ea7f5d7?w=800&q=80',
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80',
      'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80',
      'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80',
      'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=800&q=80'
  ];

  // ============================================
  // INITIALIZATION
  // ============================================
  function init() {
      preloadImages();
      createStarfield();
      setupEventListeners();
      setStage(0);
  }

  // ============================================
  // IMAGE PRELOADING
  // ============================================
  function preloadImages() {
      IMAGES.forEach(src => {
          const img = new Image();
          img.src = src;
      });
  }

  // ============================================
  // STARFIELD BACKGROUND
  // ============================================
  function createStarfield() {
      if (!starfield) return;
      
      starfield.innerHTML = '';
      for (let i = 0; i < CONFIG.starCount; i++) {
          const star = document.createElement('div');
          const size = Math.random() * 2 + 1;
          const left = Math.random() * 100;
          const top = Math.random() * 100;
          const duration = Math.random() * 3 + 2;
          const delay = Math.random() * 2;
          
          star.style.cssText = `
              position: absolute;
              width: ${size}px;
              height: ${size}px;
              left: ${left}%;
              top: ${top}%;
              background: white;
              border-radius: 50%;
              opacity: ${Math.random() * 0.7 + 0.3};
              animation: sparkle ${duration}s ease-in-out ${delay}s infinite;
              box-shadow: 0 0 ${size * 2}px rgba(255, 255, 255, 0.5);
          `;
          
          starfield.appendChild(star);
      }
  }

  // ============================================
  // PARTICLE SYSTEM
  // ============================================
  function createParticles(count = CONFIG.particleCount) {
      if (!particleField) return;
      
      particleField.innerHTML = '';
      
      for (let i = 0; i < count; i++) {
          const particle = document.createElement('div');
          const size = 3 + Math.random() * 8;
          const left = Math.random() * 100;
          const duration = 5 + Math.random() * 6;
          const delay = Math.random() * 3;
          const hue = Math.random() * 60 + 300; // Purple to pink range
          
          particle.className = 'particle';
          particle.style.cssText = `
              width: ${size}px;
              height: ${size}px;
              left: ${left}%;
              background: radial-gradient(
                  circle, 
                  hsla(${hue}, 90%, 85%, 0.95) 0%, 
                  hsla(${hue}, 80%, 70%, 0.5) 100%
              );
              animation-duration: ${duration}s;
              animation-delay: ${delay}s;
              box-shadow: 0 0 ${size * 2}px hsla(${hue}, 80%, 70%, 0.6);
          `;
          
          particleField.appendChild(particle);
      }
  }

  // ============================================
  // CONFETTI BURST EFFECT
  // ============================================
  function createConfetti() {
      for (let i = 0; i < CONFIG.confettiCount; i++) {
          const confetti = document.createElement('div');
          const size = 8 + Math.random() * 15;
          const startLeft = 30 + Math.random() * 40;
          const xOffset = (Math.random() - 0.5) * 400;
          const hue = Math.random() * 360;
          const shape = Math.random() > 0.5 ? '50%' : '0';
          const rotation = Math.random() * 720;
          const duration = 2.5 + Math.random() * 1.5;
          
          confetti.className = 'confetti';
          confetti.style.cssText = `
              width: ${size}px;
              height: ${size}px;
              left: ${startLeft}%;
              top: 50%;
              background: hsl(${hue}, 90%, 65%);
              border-radius: ${shape};
              --x-offset: ${xOffset}px;
              animation: confettiBurst ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
              box-shadow: 0 0 10px hsla(${hue}, 90%, 65%, 0.5);
          `;
          
          document.body.appendChild(confetti);
          
          setTimeout(() => confetti.remove(), duration * 1000);
      }
  }

  // ============================================
  // STAGE TRANSITION MANAGEMENT
  // ============================================
  function setStage(nextStage) {
      if (transitionInProgress) return;
      
      transitionInProgress = true;
      const panel = stageArea.querySelector('.panel');
      
      if (panel) {
          panel.classList.add('exit');
          
          setTimeout(() => {
              stage = nextStage;
              if (stage > 0) createParticles();
              renderStage();
              transitionInProgress = false;
          }, CONFIG.transitionDuration);
      } else {
          stage = nextStage;
          if (stage > 0) createParticles();
          renderStage();
          transitionInProgress = false;
      }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================
  function clearArea() {
      stageArea.innerHTML = '';
  }

  function createElement(tag, className = '', innerHTML = '') {
      const element = document.createElement(tag);
      if (className) element.className = className;
      if (innerHTML) element.innerHTML = innerHTML;
      return element;
  }

  function showSuccess(message, callback) {
      const panel = stageArea.querySelector('.panel');
      if (panel) {
          const successDiv = createElement('div', 'mt-3 text-success fw-bold fade-in');
          successDiv.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${message}`;
          panel.appendChild(successDiv);
      }
      
      if (callback) {
          setTimeout(callback, CONFIG.successDelay);
      }
  }

  function showError(inputElement, message) {
      if (inputElement) {
          inputElement.classList.add('error');
          setTimeout(() => inputElement.classList.remove('error'), 600);
      }
      
      // Optional: Show error message in UI instead of alert
      alert(message);
  }

  // ============================================
  // EVENT LISTENERS SETUP
  // ============================================
  function setupEventListeners() {
      // Prevent page unload when locked
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Keyboard shortcuts
      document.addEventListener('keydown', handleKeyboardShortcuts);
  }

  function handleBeforeUnload(e) {
      if (isLocked && stage < 11) {
          e.preventDefault();
          e.returnValue = 'Are you sure you want to leave? Your progress will be lost!';
          return e.returnValue;
      }
  }

  function handleKeyboardShortcuts(e) {
      // ESC key handling
      if (e.key === 'Escape' && stage === 5) {
          puzzleOrder = [];
          setStage(5);
      }
  }

  // ============================================
  // STAGE RENDERING
  // ============================================
  function renderStage() {
      clearArea();

      // Route to appropriate stage renderer
      const stageRenderers = {
          0: renderStage0_Welcome,
          1: renderStage1_Password,
          2: renderStage2_AccessGranted,
          3: renderStage3_Quiz,
          4: renderStage4_MemorySelection,
          5: renderStage5_Puzzle,
          6: renderStage6_Gallery,
          7: renderStage7_SecretCode,
          8: renderStage8_AlmostThere,
          9: renderStage9_Unlock,
          10: renderStage10_FinalReveal,
          11: renderStage11_Complete
      };

      const renderer = stageRenderers[stage];
      if (renderer) {
          renderer();
      } else {
          console.error(`No renderer for stage ${stage}`);
      }
  }

  // ============================================
  // STAGE 0: WELCOME SCREEN
  // ============================================
  function renderStage0_Welcome() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-lock-fill float-icon" 
                 style="font-size:72px;color:#ffb6d5;"></i>
          </div>
          <h1 class="display-4 gradient-text mb-4 text-glow">
              Exclusive Birthday Experience
          </h1>
          <div class="my-4 media-card" style="height:260px;">
              <img src="${IMAGES[0]}" alt="Gift boxes" />
              <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(to bottom, transparent, rgba(0,0,0,0.5));">
                  <div class="p-4 scale-in" style="background:rgba(0,0,0,0.5);border-radius:20px;backdrop-filter:blur(15px);border:1px solid rgba(255,255,255,0.2);">
                      <i class="bi bi-gift-fill" style="font-size:48px;color:#fff;"></i>
                      <p class="mb-0 mt-3 fs-5 fw-bold">A Special Surprise Awaits</p>
                  </div>
              </div>
          </div>
          <p class="lead mt-4 mb-2">Someone special prepared this magical journey just for you.</p>
          <p class="text-muted">Complete the challenges to unlock your surprise.</p>
      `;
      
      const startBtn = createElement('button', 'btn btn-cta mt-4 px-5 py-3');
      startBtn.innerHTML = '<i class="bi bi-arrow-right-circle-fill me-2"></i>Start the Journey';
      startBtn.onclick = () => setStage(1);
      
      panel.appendChild(startBtn);
      stageArea.appendChild(panel);
  }

  // ============================================
  // STAGE 1: PASSWORD CHALLENGE
  // ============================================
  function renderStage1_Password() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-key-fill" 
                 style="font-size:64px;color:#93c5fd;animation:iconPulse 2s ease-in-out infinite;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Challenge #1: Access Code</h2>
          <p class="lead mb-2">Enter the magic word to proceed</p>
          <p class="text-muted mb-4">
              <i class="bi bi-lightbulb-fill me-2"></i>
              Hint: Think about whose special day this is...
          </p>
      `;
      
      const inputGroup = createElement('div', 'mb-4');
      const input = createElement('input', 'form-control form-control-lg');
      input.type = 'text';
      input.placeholder = 'Type your answer here...';
      input.autocomplete = 'off';
      input.addEventListener('input', (e) => password = e.target.value.trim());
      input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') checkPassword();
      });
      
      inputGroup.appendChild(input);
      panel.appendChild(inputGroup);
      
      const submitBtn = createElement('button', 'btn btn-cta w-100 py-3');
      submitBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Submit Answer';
      submitBtn.onclick = checkPassword;
      
      panel.appendChild(submitBtn);
      stageArea.appendChild(panel);
      
      // Auto-focus input
      setTimeout(() => input.focus(), 500);
  }

  // ============================================
  // STAGE 2: ACCESS GRANTED
  // ============================================
  function renderStage2_AccessGranted() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-check-circle-fill success-check" 
                 style="font-size:80px;color:#34d399;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Access Granted! ✓</h2>
          <p class="lead mb-4">Excellent! Preparing your next challenge...</p>
          <div class="progress mb-4">
              <div class="progress-bar" 
                   role="progressbar" 
                   style="width:25%;background:linear-gradient(90deg,#34d399,#60a5fa);">
              </div>
          </div>
          <p class="text-muted">
              <i class="bi bi-hourglass-split me-2"></i>
              Loading... Please wait
          </p>
      `;
      
      const continueBtn = createElement('button', 'btn btn-cta w-100 py-3 mt-3');
      continueBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Continue Journey';
      continueBtn.onclick = () => setStage(3);
      
      panel.appendChild(continueBtn);
      stageArea.appendChild(panel);
  }

// ============================================
// STAGE 3: PERSONAL QUIZ
// ============================================
function renderStage3_Quiz() {
  const panel = createElement('div', 'panel text-center text-white');

  panel.innerHTML = `
      <div class="mb-4">
          <i class="bi bi-chat-heart-fill" 
             style="font-size:64px;color:#fb7185;animation:iconPulse 2s ease-in-out infinite;"></i>
      </div>
      <h2 class="h2 gradient-text mb-3">Challenge #2: Reflection</h2>
      <p class="lead mb-2">In one word, describe how today should be for the birthday celebrant</p>
      <p class="text-muted mb-4">
          <i class="bi bi-lightbulb-fill me-2"></i>
          Hint: Think positive and joyful!
      </p>
  `;

  const inputGroup = createElement('div', 'mb-4');
  const input = createElement('input', 'form-control form-control-lg');
  input.type = 'text';
  input.placeholder = 'Your answer...';
  input.autocomplete = 'off';

  input.addEventListener('input', (e) => userSelections.quizAnswer = e.target.value.trim());
  input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkQuiz();
  });

  inputGroup.appendChild(input);
  panel.appendChild(inputGroup);

  const submitBtn = createElement('button', 'btn btn-cta w-100 py-3');
  submitBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Submit Reflection';
  submitBtn.onclick = checkQuiz;

  panel.appendChild(submitBtn);
  stageArea.appendChild(panel);

  setTimeout(() => input.focus(), 500);

  function checkQuiz() {
      if (!userSelections.quizAnswer || userSelections.quizAnswer.length < 2) {
          alert('Please enter a meaningful reflection! ✍️');
          return;
      }
      setStage(4); // advance to Stage 4
  }
}

// ============================================
// STAGE 4: MEMORY SELECTION
// ============================================
function renderStage4_MemorySelection() {
  const panel = createElement('div', 'panel text-center text-white');

  panel.innerHTML = `
      <div class="mb-4">
          <i class="bi bi-heart-fill" 
             style="font-size:64px;color:#ec4899;animation:iconPulse 2s ease-in-out infinite;"></i>
      </div>
      <h2 class="h2 gradient-text mb-3">Challenge #3: Choose a Memory</h2>
      <p class="lead mb-4">Select what represents this celebration best:</p>
  `;

  const memoryItems = [
      { icon: 'bi-gift-fill', label: 'Gifts', img: IMAGES[4], color: '#c084fc', description: 'The joy of giving and receiving' },
      { icon: 'bi-cake2-fill', label: 'Celebration', img: IMAGES[5], color: '#fb923c', description: 'Moments of pure happiness' },
      { icon: 'bi-heart-fill', label: 'Love', img: IMAGES[6], color: '#fb7185', description: 'Surrounded by those who care' }
  ];

  const grid = createElement('div', 'row g-4 my-3');
  let selectedMemory = null;

  memoryItems.forEach((item, index) => {
      const col = createElement('div', 'col-12 col-md-4');
      const card = createElement('div', 'media-card');
      card.style.height = '200px';

      card.innerHTML = `
          <img src="${item.img}" alt="${item.label}">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));">
              <i class="bi ${item.icon}" style="font-size:48px;color:white;"></i>
              <p class="mb-1 mt-3 fw-bold" style="font-size:1.2rem;color:white;">${item.label}</p>
              <p class="mb-0 text-muted" style="font-size:0.85rem;">${item.description}</p>
          </div>
      `;

      card.addEventListener('click', () => {
          if (selectedMemory !== index) {
              selectedMemory = index;
              userSelections.memoryChoice = item.label; // save selection

              const allCards = grid.querySelectorAll('.media-card');
              allCards.forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');

              showSuccess('Great choice!', () => setStage(5)); // advance to Stage 5
          }
      });

      col.appendChild(card);
      grid.appendChild(col);
  });

  panel.appendChild(grid);
  stageArea.appendChild(panel);
}

// ============================================
// STAGE 5: PUZZLE (ARRANGE LETTERS)
// ============================================
function renderStage5_Puzzle() {
  const panel = createElement('div', 'panel text-center text-white');
  
  panel.innerHTML = `
      <div class="mb-4">
          <i class="bi bi-puzzle-fill" 
             style="font-size:64px;color:#a855f7;animation:iconPulse 2s ease-in-out infinite;"></i>
      </div>
      <h2 class="h2 gradient-text mb-3">Challenge #4: Word Puzzle</h2>
      <p class="lead mb-4">Arrange the letters to spell the magic word:</p>
  `;

  // Define letters with unique IDs
  let letters = [
      { letter: 'H', id: 0 },
      { letter: 'A', id: 1 },
      { letter: 'P', id: 2 },
      { letter: 'P', id: 3 },
      { letter: 'Y', id: 4 }
  ];

  // 🌀 Shuffle letters so they appear jumbled
  letters = letters
      .map(l => ({ ...l, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ sort, ...rest }) => rest);

  // Create letter buttons
  const letterRow = createElement('div', 'd-flex justify-content-center gap-3 flex-wrap mb-4');
  
  letters.forEach((item) => {
      const btn = createElement('button', 'letter-btn');
      btn.innerText = item.letter;
      btn.dataset.id = item.id;

      const isUsed = puzzleOrder.some(p => p.id === item.id);
      if (isUsed) {
          btn.classList.add('used');
          btn.disabled = true;
      }

      btn.addEventListener('click', () => {
          if (!isUsed) {
              puzzleOrder.push(item);
              setStage(5);
          }
      });

      letterRow.appendChild(btn);
  });

  panel.appendChild(letterRow);

  // Display current word
  const display = createElement('div', 'letter-display');

  for (let i = 0; i < 5; i++) {
      const slot = createElement('div', 'letter-slot');

      if (puzzleOrder[i]) {
          slot.innerText = puzzleOrder[i].letter;
          slot.classList.add('filled');
      } else {
          slot.innerText = '_';
      }

      display.appendChild(slot);
  }

  panel.appendChild(display);

  // Action buttons
  const buttonRow = createElement('div', 'd-flex gap-3 mt-4');

  const checkBtn = createElement('button', 'btn btn-cta flex-grow-1 py-3');
  checkBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Check Answer';
  checkBtn.onclick = checkPuzzle;

  const resetBtn = createElement('button', 'btn btn-outline-light px-4 py-3');
  resetBtn.innerHTML = '<i class="bi bi-arrow-counterclockwise"></i>';
  resetBtn.title = 'Reset puzzle';
  resetBtn.onclick = () => {
      puzzleOrder = [];
      setStage(5);
  };

  buttonRow.appendChild(checkBtn);
  buttonRow.appendChild(resetBtn);

  panel.appendChild(buttonRow);
  stageArea.appendChild(panel);
}


  // ============================================
// STAGE 6: GALLERY / HALFWAY POINT
// ============================================
function renderStage6_Gallery() {
  const panel = createElement('div', 'panel text-center text-white');

  panel.innerHTML = `
      <div class="mb-4">
          <i class="bi bi-star-fill" 
             style="font-size:72px;color:#fbbf24;animation:iconPulse 2s ease-in-out infinite;"></i>
      </div>
      <h2 class="h2 gradient-text mb-3">Halfway There! 🎉</h2>
      <p class="lead mb-4">Look at what we have prepared for you — pick your favorite highlight:</p>
      <div class="progress mb-4">
          <div class="progress-bar" 
               style="width:50%;background:linear-gradient(90deg,#fbbf24,#ec4899);">
          </div>
      </div>
  `;

  const galleryImages = [
      { img: IMAGES[7], label: 'Gifts', desc: 'The joy of surprises' },
      { img: IMAGES[0], label: 'Celebration', desc: 'The heart of every birthday' },
      { img: IMAGES[5], label: 'Cake', desc: 'Sweetest part of the day' }
  ];

  const grid = createElement('div', 'row g-4 my-4');
  let selectedImage = null;

  galleryImages.forEach((item, index) => {
      const col = createElement('div', 'col-12 col-md-4');
      const card = createElement('div', 'media-card');
      card.style.height = '180px';
      card.style.cursor = 'pointer';
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add('scale-in');

      card.innerHTML = `
          <img src="${item.img}" alt="${item.label}">
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;background:linear-gradient(to bottom, transparent, rgba(0,0,0,0.6));transition:all 0.3s ease;">
              <i class="bi bi-image" style="font-size:36px;color:white;opacity:0.9;"></i>
              <p class="mb-0 mt-2 fw-bold text-white">${item.label}</p>
              <p class="text-muted small">${item.desc}</p>
          </div>
      `;

      card.addEventListener('click', () => {
          if (selectedImage !== index) {
              selectedImage = index;
              userSelections.galleryChoice = item.label; // save gallery selection

              const allCards = grid.querySelectorAll('.media-card');
              allCards.forEach(c => c.classList.remove('selected'));
              card.classList.add('selected');

              showSuccess(`You selected "${item.label}" ✨`, () => setStage(7));
          }
      });

      col.appendChild(card);
      grid.appendChild(col);
  });

  panel.appendChild(grid);
  stageArea.appendChild(panel);
}
  // ============================================
  // STAGE 7: SECRET CODE (YEAR)
  // ============================================
  function renderStage7_SecretCode() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-calendar-event-fill" 
                 style="font-size:64px;color:#60a5fa;animation:iconPulse 2s ease-in-out infinite;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Challenge #5: Time Code</h2>
          <p class="lead mb-2">Enter the current year to proceed:</p>
          <p class="text-muted mb-4">
              <i class="bi bi-lightbulb-fill me-2"></i>
              Hint: What year is it now?
          </p>
      `;
      
      const inputGroup = createElement('div', 'mb-4');
      const input = createElement('input', 'form-control form-control-lg');
      input.type = 'number';
      input.placeholder = 'YYYY';
      input.value = secretCode || '';
      input.autocomplete = 'off';
      input.addEventListener('input', (e) => secretCode = e.target.value);
      input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') checkSecretCode();
      });
      
      inputGroup.appendChild(input);
      panel.appendChild(inputGroup);
      
      const submitBtn = createElement('button', 'btn btn-cta w-100 py-3');
      submitBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Verify Code';
      submitBtn.onclick = checkSecretCode;
      
      panel.appendChild(submitBtn);
      stageArea.appendChild(panel);
      
      setTimeout(() => input.focus(), 500);
  }

  // ============================================
  // STAGE 8: ALMOST THERE
  // ============================================
  function renderStage8_AlmostThere() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-trophy-fill" 
                 style="font-size:72px;color:#fbbf24;animation:iconPulse 2s ease-in-out infinite;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Almost There! ✨</h2>
          <p class="lead mb-4">You've made it this far! Just one more challenge before the grand reveal...</p>
          <div class="progress mb-4">
              <div class="progress-bar" 
                   style="width:90%;background:linear-gradient(90deg,#ff7ab6,#7c3aed);">
              </div>
          </div>
          <p class="text-muted mb-4">
              <i class="bi bi-stars me-2"></i>
              The surprise is waiting for you...
          </p>
      `;
      
      const finalBtn = createElement('button', 'btn btn-cta w-100 py-3');
      finalBtn.innerHTML = '<i class="bi bi-arrow-right me-2"></i>Final Challenge';
      finalBtn.onclick = () => setStage(9);
      
      panel.appendChild(finalBtn);
      stageArea.appendChild(panel);
  }

      // ============================================
    // STAGE 9: UNLOCK CHALLENGE
    // ============================================
    function renderStage9_Unlock() {
      const panel = createElement('div', 'panel text-center text-white');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-unlock-fill" 
                 style="font-size:72px;color:#34d399;animation:iconPulse 2s ease-in-out infinite;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Final Challenge: Unlock</h2>
          <p class="lead mb-4">Click the button to unlock your surprise! 🎊</p>
          <div class="my-4 p-4" style="background:rgba(255,255,255,0.08);border-radius:20px;border:1px solid rgba(255,255,255,0.15);backdrop-filter:blur(12px);">
              <p class="mb-0">Get ready to reveal something special...</p>
          </div>
      `;
      
      const unlockBtn = createElement('button', 'btn btn-cta w-100 py-3 mt-3');
      unlockBtn.innerHTML = '<i class="bi bi-gift-fill me-2"></i>🎁 UNLOCK SURPRISE';
      unlockBtn.onclick = () => {
          // Add shake animation + confetti
          panel.classList.add('shake');
          setTimeout(() => {
              createConfetti();
              setStage(10);
          }, 1000);
      };
      
      panel.appendChild(unlockBtn);
      stageArea.appendChild(panel);
  }

// ============================================
// STAGE 10: FINAL REVEAL (SURPRISE + FEEDBACK FORM)
// ============================================
function renderStage10_FinalReveal() {
  const panel = document.createElement('div');
  panel.className = 'panel text-center text-white glow scale-in';
  const celebrantImage = 'kassy.jpg'; 

  panel.innerHTML = `
      <div class="mb-4">
          <i class="bi bi-stars"
              style="font-size:72px;color:#fbbf24;animation:iconPulse 2s ease-in-out infinite;"></i>
      </div>
      <div style="height:260px;overflow:hidden;border-radius:18px;margin-bottom:20px;">
          <img src="${celebrantImage}" alt="Celebrant Photo"
              style="width:100%;height:100%;object-fit:cover;animation:fadeInZoom 2.5s ease;">
      </div>
      <h1 class="display-5 gradient-text mb-3">Happy Birthday, Kassy! 🎂💖</h1>
      <div class="text-start px-3 py-3"
          style="background:rgba(255,255,255,0.08);border-radius:14px;border:1px solid rgba(255,255,255,0.1);backdrop-filter:blur(6px);">
          <p class="mb-2">I hope you enjoy your special day to the fullest, filled with happiness, joy, and moments that make you smile every single day. 🌸✨</p>
          <p class="mb-2">Keep pursuing your dreams and goals; I am so proud of everything you’ve achieved and all that you will accomplish in the future.</p>
          <p class="mb-2">I also hope we get to create more wonderful memories soon and catch up whenever we can. Remember, I’m always here to support you, no matter what.</p>
          <p class="mb-0">Wishing you a year filled with love, laughter, and endless possibilities!</p>
      </div>
      <div class="mt-4 mb-4">
          <i class="bi bi-heart-fill" style="color:#fb7185;font-size:28px;animation:beat 1.5s infinite;"></i>
          <i class="bi bi-heart-fill ms-2" style="color:#a855f7;font-size:24px;animation:beat 1.7s infinite;"></i>
          <i class="bi bi-heart-fill ms-2" style="color:#60a5fa;font-size:20px;animation:beat 2s infinite;"></i>
      </div>
      <div class="mt-4 text-start">
          <label class="fw-bold mb-2" for="senderName">🏷️ Your Name:</label>
          <input id="senderName" class="form-control mb-3" type="text" placeholder="Enter your name...">
          
          <label class="fw-bold mb-2" for="feedback">💌 Leave your message:</label>
          <textarea id="feedback" class="form-control mb-3" rows="4"
              placeholder="Write your thoughts here..."></textarea>

          <button id="sendFeedback" class="btn btn-outline-light w-100 py-2">
              <i class="bi bi-send-fill me-2"></i>Send Message
          </button>

          <div id="feedbackStatus" class="mt-3 text-success fw-bold" style="display:none; white-space: pre-line;">
              <i class="bi bi-check-circle-fill"></i> Message sent successfully! 💌
          </div>
      </div>

      <div id="finishContainer" style="display:none;">
          <button id="finishBtn" class="btn btn-success w-100 py-3 mt-4 disabled" disabled>
              <i class="bi bi-emoji-smile-fill me-2"></i>Finish 💝
          </button>
      </div>
  `;

  stageArea.appendChild(panel);

  const sendBtn = panel.querySelector('#sendFeedback');
  const feedbackBox = panel.querySelector('#feedback');
  const nameBox = panel.querySelector('#senderName');
  const statusDiv = panel.querySelector('#feedbackStatus');
  const finishContainer = panel.querySelector('#finishContainer');
  const finishBtn = panel.querySelector('#finishBtn');

  sendBtn.addEventListener('click', () => {
      const message = feedbackBox.value.trim();
      const senderName = nameBox.value.trim();

      // Validation (unchanged)
      const nameRegex = /^[A-Za-z\s'-]+$/;
      if (!senderName) { showError(nameBox, 'Please enter your name 📝'); return; }
      if (!nameRegex.test(senderName)) { showError(nameBox, 'Name can only contain letters 🅰️'); return; }
      if (!message) { showError(feedbackBox, 'Please write a message first 💬'); return; }

      const words = message.split(/\s+/).filter(w => /^[A-Za-z]{2,}$/.test(w));
      if (words.length < 3) { showError(feedbackBox, 'Please write a proper message with real words ✍️'); return; }

      // ******************************************************************
      // 💥 FINAL FIX: Huwag magpakita ng output sa user, i-call lang ang save function.
      // ******************************************************************
      const feedbackObj = {
          name: senderName,
          message,
          quizAnswer: userSelections.quizAnswer || 'N/A',
          memoryChoice: userSelections.memoryChoice || 'N/A',
          galleryChoice: userSelections.galleryChoice || 'N/A',
          time: new Date().toLocaleString()
      };

      // 🔑 I-save ang lahat ng detalye sa BAGO at hiwalay na "Admin" storage.
      saveAdminFeedback(feedbackObj); 
      // ******************************************************************

      // Show only a simple confirmation to the user (ito lang ang makikita)
      statusDiv.style.display = 'block';
      statusDiv.innerHTML = '<i class="bi bi-check-circle-fill"></i> Message sent successfully! 💌'; 

      feedbackBox.disabled = true;
      nameBox.disabled = true;
      sendBtn.disabled = true;

      finishContainer.style.display = 'block';
      setTimeout(() => {
          finishBtn.classList.remove('disabled');
          finishBtn.disabled = false;
          finishBtn.style.animation = 'pulseGlow 1.2s infinite';
      }, 600);
  });

  finishBtn.addEventListener('click', () => {
      if (finishBtn.disabled) return;
      if (typeof createConfetti === 'function') createConfetti();
      isLocked = false;
      if (typeof setStage === 'function') setStage(11);
  });
}


// ============================================
// NEW STORAGE LOGIC: ONLY FOR ADMIN
// ============================================
// Ang function na ito ang magse-save ng data, na HINDI dapat magkaroon ng public output.
function saveAdminFeedback(feedbackData) {
  const key = 'birthday_feedbacks_admin'; // BAGO at hiwalay na storage key
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.push(feedbackData);
  localStorage.setItem(key, JSON.stringify(existing));
}


// ============================================
// ADMIN-ONLY FEEDBACK VIEWER (UPDATED TO USE NEW KEY)
// ============================================
document.getElementById('viewMessagesBtn').addEventListener('click', () => {
  const pass = prompt("🔒 Enter admin key to view messages:");
  const adminKey = "ivankey123"; // 🔑 Change this secret key to your own
  if (pass === adminKey) {
      showFeedbackViewerAdmin(); 
  } else if (pass !== null) {
      alert("Access denied ❌");
  }
});

function showFeedbackViewerAdmin() {
  // 🔑 Gumamit ng BAGO at hiwalay na storage key
  const messages = JSON.parse(localStorage.getItem('birthday_feedbacks_admin') || '[]'); 

  const overlay = document.createElement('div');
  overlay.className = 'feedback-overlay';
  // ... (rest of the overlay/box styling is unchanged) ...
  overlay.style = `
      position:fixed;inset:0;background:rgba(0,0,0,0.7);
      display:flex;align-items:center;justify-content:center;z-index:9999;
  `;

  const box = document.createElement('div');
  box.style = `
      width:90%;max-width:700px;background:#0b1220;
      padding:20px;border-radius:12px;color:#fff;
      max-height:80vh;overflow:auto;
      border:1px solid rgba(255,255,255,0.08);
      font-family:'Poppins',sans-serif;
  `;
  box.innerHTML = `<h3>🎁 Received Messages (${messages.length})</h3>`;

  if (!messages.length) {
      box.innerHTML += `<p class="text-muted">No messages yet.</p>`;
  } else {
      messages.slice().reverse().forEach((m) => {
          const item = document.createElement('div');
          item.style = `
              padding:10px;margin-bottom:10px;
              background:rgba(255,255,255,0.05);
              border-radius:8px;
          `;
          // ***************************************************************
          // COMPACT ADMIN VIEW: Dito lang LILITAW ang detalye.
          // ***************************************************************
          item.innerHTML = `
              <div style="color:#a5b4fc;font-size:0.9rem; margin-bottom: 5px;">
                  ${m.time} — from <strong>${m.name}</strong>
              </div>
              <div style="white-space:pre-wrap; font-weight: bold;">
                  Message:
              </div>
              <div style="white-space:pre-wrap; margin-bottom: 10px;">
                  ${m.message}
              </div>
              <div style="font-size: 0.85rem; color: #a5b4fc;">
                  Choices: Reflection: ${m.quizAnswer} | Memory: ${m.memoryChoice} | Gallery: ${m.galleryChoice}
              </div>
          `;
          // ***************************************************************
          box.appendChild(item);
      });
  }

  // ... (Buttons logic is unchanged) ...
  const btnRow = document.createElement('div');
  btnRow.style = 'display:flex;gap:10px;justify-content:flex-end;margin-top:12px;';

  const downloadBtn = document.createElement('button');
  downloadBtn.className = 'btn btn-outline-light btn-sm';
  downloadBtn.textContent = 'Download All (.txt)';
  downloadBtn.onclick = () => downloadMessagesAsText(messages);

  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn btn-outline-danger btn-sm';
  clearBtn.textContent = 'Clear All';
  clearBtn.onclick = () => {
      if (confirm('Delete all saved messages?')) {
          localStorage.removeItem('birthday_feedbacks_admin'); // 🔑 Clear the NEW key
          overlay.remove();
          showFeedbackViewerAdmin();
      }
  };

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn btn-primary btn-sm';
  closeBtn.textContent = 'Close';
  closeBtn.onclick = () => overlay.remove();

  btnRow.appendChild(downloadBtn);
  btnRow.appendChild(clearBtn);
  btnRow.appendChild(closeBtn);
  box.appendChild(btnRow);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// ============================================
// Download messages as text (Updated to use all fields)
// ============================================
function downloadMessagesAsText(messages) {
  if (!messages.length) { alert('No messages to download.'); return; }

  let text = `🎉 Birthday Feedback Messages\n\n`;
  messages.forEach((m, i) => {
      text += `Message #${i+1}\nFrom: ${m.name}\nTime: ${m.time}\n`;
      // Ensure all data is included in download
      text += `Message: ${m.message}\nReflection: ${m.quizAnswer}\nMemory: ${m.memoryChoice}\nGallery: ${m.galleryChoice}\n`;
      text += `----------------------------------------\n`;
  });

  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'BirthdayMessages.txt';
  a.click();
  URL.revokeObjectURL(url);
}


  // ============================================
  // STAGE 11: EXPERIENCE COMPLETE
  // ============================================
  function renderStage11_Complete() {
      const panel = createElement('div', 'panel text-center text-white fade-in');
      
      panel.innerHTML = `
          <div class="mb-4">
              <i class="bi bi-check-circle-fill" 
                 style="font-size:84px;color:#34d399;animation:scaleUp 1.5s ease;"></i>
          </div>
          <h2 class="h2 gradient-text mb-3">Experience Complete ✓</h2>
          <p class="lead mb-4">You’ve successfully completed this exclusive birthday journey! 🎊</p>
          <div class="my-4 p-3" 
               style="background:rgba(255,255,255,0.08);border-radius:16px;border:1px solid rgba(255,255,255,0.1);">
              <p class="mb-0">Thank you for being part of this celebration — may your days ahead be filled with happiness and wonder. ✨</p>
          </div>
      `;
      
      const restartBtn = createElement('button', 'btn btn-outline-light w-100 py-3 mt-3');
      restartBtn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Restart Experience';
      restartBtn.onclick = () => {
          puzzleOrder = [];
          selectedMemory = null;
          password = '';
          quizAnswer = '';
          secretCode = '';
          isLocked = true;
          setStage(0);
      };
      
      panel.appendChild(restartBtn);
      stageArea.appendChild(panel);
  }

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================
  function checkPassword() {
      const value = password.trim().toLowerCase();
      if (value === 'kassy' || value === 'birthday') {
          showSuccess('Correct password! Welcome 💫', () => setStage(2));
      } else {
          showError(document.querySelector('input'), 'Incorrect password! Try again 💡');
      }
  }

  function checkQuiz() {
      const a = (quizAnswer || '').toLowerCase();
      const okay = ['special', 'amazing', 'wonderful', 'great', 'beautiful', 'fantastic', 'happy'].some(w => a.includes(w));
      if (okay) {
          showSuccess('Perfect answer! 💖', () => setStage(4));
      } else {
          showError(document.querySelector('input'), 'That’s nice, but think more joyful! 😊');
      }
  }

  function checkPuzzle() {
      const correct = ['H', 'A', 'P', 'P', 'Y'];
      const attempt = puzzleOrder.map(p => p.letter);
      if (JSON.stringify(attempt) === JSON.stringify(correct)) {
          showSuccess('Correct! You spelled HAPPY! 🎉', () => setStage(6));
      } else {
          showError(null, 'Try again! Hint: Spell the word that fits the celebration 🧩');
      }
  }

  function checkSecretCode() {
      const year = new Date().getFullYear().toString();
      if (secretCode === year || secretCode === '2025') {
          showSuccess('Correct year! 🗓️', () => setStage(8));
      } else {
          showError(document.querySelector('input'), 'Hint: What year is it now? 📅');
      }
  }



  // ============================================
  // START APPLICATION
  // ============================================
  init();

})();

