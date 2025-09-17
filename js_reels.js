 class ReelStack {
    constructor() {
      this.reels = document.querySelectorAll('.reel');
      this.iframes = document.querySelectorAll('.reel iframe');
      this.currentIndex = 0;
      this.totalReels = this.reels.length;
      this.isTransitioning = false;
      
      this.init();
    }
    
    init() {
      this.setupTouchEvents();
      this.setupKeyboardEvents();
      this.updateStack();
      
      // Preload iframes
      this.iframes.forEach(iframe => {
        iframe.addEventListener('load', () => {
          iframe.parentElement.querySelector('::before')?.remove();
        });
      });
    }
    
    setupTouchEvents() {
      const container = document.querySelector('.reels-container');
      let startX = 0;
      let startY = 0;
      let threshold = 50;
      
      container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      }, { passive: true });
      
      container.addEventListener('touchend', (e) => {
        if (this.isTransitioning) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        
        // Only handle horizontal swipes (ignore vertical scrolling)
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
          e.preventDefault();
          
          if (deltaX > 0) {
            this.prevReel();
          } else {
            this.nextReel();
          }
        }
      }, { passive: false });
    }
    
    setupKeyboardEvents() {
      document.addEventListener('keydown', (e) => {
        if (this.isTransitioning) return;
        
        switch(e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            this.prevReel();
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.nextReel();
            break;
        }
      });
    }
    
    postToIframe(iframe, command) {
      try {
        iframe.contentWindow?.postMessage(JSON.stringify({
          event: "command",
          func: command,
          args: []
        }), "*");
      } catch (error) {
        // Silently handle cross-origin iframe errors
      }
    }
    
    updateStack() {
      this.isTransitioning = true;
      
      this.reels.forEach((reel, index) => {
        reel.classList.remove('active', 'left-1', 'left-2', 'right-1', 'right-2', 'hidden');
        
        // Pause all videos first
        this.postToIframe(this.iframes[index], 'pauseVideo');
        
        const relativeIndex = (index - this.currentIndex + this.totalReels) % this.totalReels;
        
        if (relativeIndex === 0) {
          reel.classList.add('active');
          // Play active video with a small delay
          setTimeout(() => {
            this.postToIframe(this.iframes[index], 'playVideo');
          }, 400);
        } else if (relativeIndex === 1) {
          reel.classList.add('right-1');
        } else if (relativeIndex === 2) {
          reel.classList.add('right-2');
        } else if (relativeIndex === this.totalReels - 1) {
          reel.classList.add('left-1');
        } else if (relativeIndex === this.totalReels - 2) {
          reel.classList.add('left-2');
        } else {
          reel.classList.add('hidden');
        }
      });
      
      // Reset transition lock after animation completes
      setTimeout(() => {
        this.isTransitioning = false;
      }, 700);
    }
    
    nextReel() {
      if (this.isTransitioning) return;
      this.currentIndex = (this.currentIndex + 1) % this.totalReels;
      this.updateStack();
    }
    
    prevReel() {
      if (this.isTransitioning) return;
      this.currentIndex = (this.currentIndex - 1 + this.totalReels) % this.totalReels;
      this.updateStack();
    }
  }
  
  // Global functions for button clicks
  let reelStackInstance;
  
  function nextReel() {
    reelStackInstance?.nextReel();
  }
  
  function prevReel() {
    reelStackInstance?.prevReel();
  }
  
  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    reelStackInstance = new ReelStack();
  });
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause all videos when page is hidden
      document.querySelectorAll('.reel iframe').forEach(iframe => {
        reelStackInstance?.postToIframe(iframe, 'pauseVideo');
      });
    }
  });