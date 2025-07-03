import './styles.css';

class Element {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      theme: 'dark',
      size: { width: 400, height: 300 },
      ...options
    };
    
    this.count = 0;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="element element-${this.options.theme}" style="width: ${this.options.size.width}px; height: ${this.options.size.height}px;">
        <div class="element-header">
          <h2>Element Name</h2>
          <p>Element description</p>
        </div>
        
        <div class="element-content">
          <div class="counter">
            <p>Count: <span id="count">${this.count}</span></p>
            <button id="increment">Increment</button>
            <button id="reset">Reset</button>
          </div>
          
          <div class="info">
            <p><strong>Author:</strong> Your Name</p>
            <p><strong>Category:</strong> Utilities</p>
            <p><strong>Tier:</strong> free</p>
          </div>
        </div>
      </div>
    `;
  }

  attachEventListeners() {
    const incrementBtn = this.container.querySelector('#increment');
    const resetBtn = this.container.querySelector('#reset');
    const countSpan = this.container.querySelector('#count');

    incrementBtn.addEventListener('click', () => {
      this.count++;
      countSpan.textContent = this.count;
    });

    resetBtn.addEventListener('click', () => {
      this.count = 0;
      countSpan.textContent = this.count;
    });

    // Listen for theme changes from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'theme') {
        this.options.theme = event.data.theme;
        this.render();
        this.attachEventListeners();
      }
    });
  }

  updateSize(width, height) {
    this.options.size = { width, height };
    this.render();
    this.attachEventListeners();
  }

  destroy() {
    this.container.innerHTML = '';
  }
}

// Initialize element when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  if (container) {
    window.element = new Element(container);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Element;
} 