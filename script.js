const book = document.querySelector('.book');
const spreads = Array.from(document.querySelectorAll('.spread'));
const indicator = document.querySelector('.page-indicator');

let currentIndex = spreads.findIndex((spread) => spread.classList.contains('active'));
if (currentIndex < 0) currentIndex = 0;
let isClosed = true;

const playOpenAnimation = () => {
  book.classList.add('opening');
  book.addEventListener(
    'animationend',
    () => book.classList.remove('opening'),
    { once: true },
  );
};

function showBirthdayCake() {
  const cake = document.getElementById('birthday-cake');
  if (!cake) return;
  
  // Reset cake state
  cake.classList.remove('show');
  
  // Show cake with surprise animation
  setTimeout(() => {
    cake.classList.add('show');
  }, 300);
}

function hideCake() {
  const cake = document.getElementById('birthday-cake');
  if (cake) {
    cake.classList.remove('show');
  }
}

const updateView = () => {
  if (isClosed) {
    book.classList.add('closed');
    spreads.forEach((spread) => {
      spread.classList.remove('active', 'flipped');
      spread.setAttribute('aria-hidden', 'true');
    });
    indicator.textContent = 'Tutup · Sampul';
    hideCake();
    return;
  }

  book.classList.remove('closed');
  
  // Check if we're on the 'Ucapan' page (page 3)
  const currentPage = spreads[currentIndex]?.getAttribute('data-page');
  if (currentPage === 'Ucapan') {
    // Show surprise after a short delay
    setTimeout(showSurprise, 500);
  } else {
    // Hide cake when not on the surprise page
    hideCake();
  }
  spreads.forEach((spread, index) => {
    const isActive = index === currentIndex;
    const isBefore = index < currentIndex;

    spread.classList.toggle('active', isActive);
    spread.classList.toggle('flipped', isBefore);
    spread.style.zIndex = spreads.length - index;
    spread.setAttribute('aria-hidden', isActive ? 'false' : 'true');

    // Show cake only on the third page (index 2)
    if (isActive && index === 2) {
      showBirthdayCake();
    } else if (isActive) {
      hideCake();
    }
  });

  indicator.textContent = `Spread ${currentIndex + 1} / ${spreads.length} · ${
    spreads[currentIndex].dataset.page
  }`;

};

const goToPage = (direction) => {
  if (isClosed && direction > 0) {
    isClosed = false;
    currentIndex = 0;
    playOpenAnimation();
    updateView();
    return;
  }

  if (!isClosed && direction < 0 && currentIndex === 0) {
    isClosed = true;
    updateView();
    return;
  }

  currentIndex = Math.min(
    spreads.length - 1,
    Math.max(0, currentIndex + direction),
  );
  updateView();
};

const handleBookClick = (event) => {
  const rect = book.getBoundingClientRect();
  const isLeftSide = event.clientX - rect.left < rect.width / 2;

  if (isClosed) {
    goToPage(1);
    return;
  }

  if (isLeftSide) {
    goToPage(-1);
  } else {
    if (currentIndex === spreads.length - 1) {
      isClosed = true;
      updateView();
    } else {
      goToPage(1);
    }
  }
};

book.addEventListener('click', handleBookClick);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') goToPage(1);
  if (event.key === 'ArrowLeft') goToPage(-1);
});

updateView();

// Auto-detect photos and add has-photo class
function checkAndAddPhotoClass() {
  document.querySelectorAll('.photo-slot').forEach((slot) => {
    const img = slot.querySelector('img');
    if (img && img.hasAttribute('src')) {
      const src = img.getAttribute('src');
      // Cek apakah src tidak kosong
      if (src && src.trim() !== '') {
        slot.classList.add('has-photo');
        console.log('Foto ditemukan:', src, 'di slot:', slot);
        
        // Handle error jika foto tidak ditemukan
        img.onerror = function() {
          console.error('❌ Foto tidak ditemukan:', src);
          slot.classList.remove('has-photo');
        };
        
        // Pastikan class tetap ada saat foto dimuat
        img.onload = function() {
          slot.classList.add('has-photo');
          console.log('✅ Foto berhasil dimuat:', src);
        };
        
        // Force check jika foto sudah dimuat
        if (img.complete && img.naturalHeight !== 0) {
          slot.classList.add('has-photo');
          console.log('✅ Foto sudah dimuat sebelumnya:', src);
        }
      } else {
        slot.classList.remove('has-photo');
      }
    } else {
      slot.classList.remove('has-photo');
    }
  });
}

// Jalankan saat DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', checkAndAddPhotoClass);
} else {
  checkAndAddPhotoClass();
}

// Jalankan lagi setelah semua gambar dimuat
window.addEventListener('load', checkAndAddPhotoClass);

// Jalankan lagi setelah sedikit delay untuk memastikan
setTimeout(checkAndAddPhotoClass, 100);

// Cake Animation
function showBirthdayCake() {
  const cake = document.getElementById('birthday-cake');
  if (!cake) return;
  
  // Reset cake state
  cake.classList.remove('show');
  cake.style.transform = 'translateX(-50%) translateY(100%)';
  
  // Show cake after a delay
  setTimeout(() => {
    cake.classList.add('show');
    
    // Add sparkles to cake
    const sparkles = cake.querySelectorAll('.cake-sparkles span');
    sparkles.forEach((span, i) => {
      span.style.setProperty('--i', i);
      span.style.position = 'absolute';
      span.style.left = Math.random() * 100 + '%';
      span.style.animationDelay = Math.random() * 2 + 's';
    });
    
    // Make cake interactive
    cake.style.pointerEvents = 'auto';
    cake.style.cursor = 'pointer';
    
    // Blow out candle on click
    cake.addEventListener('click', function blowOutCandle() {
      const flame = this.querySelector('.flame');
      if (flame && !this.classList.contains('blown-out')) {
        this.classList.add('blown-out');
        flame.style.animation = 'none';
        flame.style.opacity = '0';
        flame.style.transform = 'scale(0.5)';
        
        // Add smoke effect
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        smoke.style.cssText = `
          position: absolute;
          width: 5px;
          height: 20px;
          background: rgba(200, 200, 200, 0.8);
          border-radius: 50%;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          filter: blur(3px);
          animation: smokeRise 2s ease-out forwards;
        `;
        
        this.querySelector('.cake-candle').appendChild(smoke);
        
        // Hide cake after a delay
        setTimeout(() => {
          this.style.transform = 'translateX(-50%) translateY(100%)';
          this.style.transition = 'transform 1s ease-in-out';
          
          // Schedule next appearance
          setTimeout(() => {
            this.classList.remove('blown-out');
            showBirthdayCake();
          }, 10000 + Math.random() * 10000); // Reappear after 10-20 seconds
          
        }, 2000);
      }
    }, { once: true });
  }, 2000); // Initial delay before showing cake
}

// Add smoke and sparkle animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes smokeRise {
    0% { 
      transform: translateX(-50%) translateY(0) scale(1); 
      opacity: 0.8; 
    }
    100% { 
      transform: translateX(-50%) translateY(-150px) scale(3); 
      opacity: 0; 
    }
  }
  
  @keyframes sparkle {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.3); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }
  
  .cake-sparkles {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    font-size: 30px;
    pointer-events: none;
  }
  
  .cake-sparkles span {
    display: inline-block;
    animation: sparkle 1.5s ease-in-out infinite;
    text-shadow: 0 0 10px #fff;
    opacity: 0;
  }
  
  #birthday-cake.show .cake-sparkles span {
    opacity: 0.8;
  }
  
  .cake-hidden {
    display: none;
  }
  
  /* Add pulse effect to the cake when hovered */
  #birthday-cake:hover .cake-base {
    transform: perspective(500px) rotateX(5deg) scale(1.05);
  }
`;
document.head.appendChild(style);

// Create fireworks
function createFireworks() {
  const container = document.getElementById('fireworks-container');
  const book = document.querySelector('.book');
  if (!container || !book) return;
  
  const colors = ['#ff6b8b', '#ffb3c1', '#ffd700', '#98fb98', '#87cefa', '#ffa07a'];
  
  // Get book position and dimensions
  const bookRect = book.getBoundingClientRect();
  const bookCenterX = bookRect.left + bookRect.width / 2;
  const bookTop = bookRect.top;
  
  // Create multiple fireworks
  const fireworkCount = 3 + Math.floor(Math.random() * 3); // 3-5 fireworks
  
  for (let i = 0; i < fireworkCount; i++) {
    // Random delay between fireworks (0-200ms)
    setTimeout(() => {
      // Random position around the book
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const targetX = bookCenterX + Math.cos(angle) * distance;
      const targetY = bookTop - 50 + Math.random() * 50;
      
      // Create firework launcher
      const firework = document.createElement('div');
      firework.className = 'firework';
      firework.style.background = colors[Math.floor(Math.random() * colors.length)];
      firework.style.left = window.innerWidth / 2 + 'px';
      firework.style.bottom = '0';
      firework.style.transform = 'translateX(-50%)';
      container.appendChild(firework);
      
      // Animate firework to target position
      const duration = 800 + Math.random() * 700; // 0.8-1.5s
      firework.style.transition = `all ${duration}ms cubic-bezier(0.1, 0.8, 0.2, 1)`;
      
      // Trigger animation
      setTimeout(() => {
        firework.style.left = targetX + 'px';
        firework.style.bottom = (window.innerHeight - targetY) + 'px';
      }, 10);
      
      // Create explosion when firework reaches target
      setTimeout(() => {
        // Remove the launcher
        firework.remove();
        
        // Create explosion
        const explosion = document.createElement('div');
        explosion.className = 'firework-explosion';
        explosion.style.left = targetX + 'px';
        explosion.style.top = targetY + 'px';
        container.appendChild(explosion);
        
        // Create explosion particles
        const particleCount = 12 + Math.floor(Math.random() * 8);
        for (let j = 0; j < particleCount; j++) {
          const particle = document.createElement('div');
          particle.className = 'firework-particle';
          particle.style.background = colors[Math.floor(Math.random() * colors.length)];
          explosion.appendChild(particle);
          
          // Animate particles
          const angle = (j / particleCount) * Math.PI * 2;
          const distance = 30 + Math.random() * 50;
          const duration = 0.8 + Math.random() * 0.7;
          
          setTimeout(() => {
            particle.style.transition = `all ${duration}s ease-out`;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
          }, 10);
          
          // Clean up
          setTimeout(() => {
            particle.remove();
          }, duration * 1000);
        }
        
        // Remove explosion container after animation
        setTimeout(() => {
          if (explosion.parentNode === container) {
            container.removeChild(explosion);
          }
        }, 1000);
        
      }, duration + 10);
      
    }, i * 200); // Stagger the fireworks
  }
}

// Show surprise with cake and fireworks
function showSurprise() {
  const cake = document.getElementById('birthday-cake');
  if (!cake) {
    console.error('Cake element not found!');
    return;
  }
  
  console.log('Showing surprise!');
  
  // Reset and show cake
  cake.style.display = 'block';
  cake.style.visibility = 'visible';
  cake.style.opacity = '1';
  cake.style.bottom = '-300px';
  cake.style.transform = 'translateX(-50%) scale(1.5)';
  
  // Force reflow to ensure styles are applied
  cake.offsetHeight;
  
  // Show cake with delay
  setTimeout(() => {
    cake.classList.add('show');
    
    // Make cake interactive
    cake.style.cursor = 'pointer';
    let isBlown = false;
    
    cake.onclick = function() {
      if (!isBlown) {
        // Blow out the candle
        const flame = this.querySelector('.flame');
        if (flame) {
          flame.style.animation = 'none';
          flame.style.opacity = '0';
          flame.style.transform = 'scale(0.3)';
          
          // Add smoke effect
          const smoke = document.createElement('div');
          smoke.style.cssText = `
            position: absolute;
            width: 10px;
            height: 40px;
            background: rgba(200, 200, 200, 0.8);
            border-radius: 50%;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            filter: blur(5px);
            opacity: 0;
            animation: smokeRise 2s ease-out forwards;
          `;
          this.querySelector('.cake-candle').appendChild(smoke);
          
          // Remove smoke after animation
          setTimeout(() => smoke.remove(), 2000);
          
          isBlown = true;
          
          // Relight candle after 5 seconds
          setTimeout(() => {
            flame.style.animation = 'flicker 0.4s ease-in-out infinite alternate';
            flame.style.opacity = '1';
            flame.style.transform = 'scale(1)';
            isBlown = false;
          }, 5000);
        }
      }
    };
    
    // Start fireworks after cake appears
    setTimeout(() => {
      // Initial burst of fireworks
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createFireworks(), i * 300);
      }
      
      // Keep creating fireworks every 1.5 seconds
      const fireworksInterval = setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance for fireworks
          createFireworks();
        }
      }, 1500);
      
      // Stop fireworks after 20 seconds
      setTimeout(() => {
        clearInterval(fireworksInterval);
      }, 20000);
    }, 800);
  }, 300);
}

// Initialize the surprise when the page loads
function initSurprise() {
  console.log('Initializing surprise...');
  
  // Make sure the cake is visible
  const cake = document.getElementById('birthday-cake');
  if (cake) {
    console.log('Cake element found, showing...');
    cake.style.display = 'block';
    cake.style.visibility = 'visible';
    cake.style.opacity = '1';
    
    // Start the surprise after a short delay
    setTimeout(() => {
      showSurprise();
    }, 1000);
  } else {
    console.error('Cake element not found during initialization!');
  }
  
  // Also trigger on third page navigation
  const updateViewOriginal = updateView;
  window.updateView = function() {
    updateViewOriginal.apply(this, arguments);
    if (currentIndex === 2) { // Third page (0-indexed)
      console.log('Third page detected, showing surprise...');
      showSurprise();
    }
  };
}

// Run initialization when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSurprise);
} else {
  initSurprise();
}
