type EventHandler = () => void;

export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Keyboard events
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    
    // Focus canvas on click
    this.canvas.addEventListener('click', () => {
      this.canvas.focus();
    });
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.keys.set(event.key, true);
    
    // Special key handlers
    if (event.key === 'p' || event.key === 'P') {
      this.emit('pause');
    }
    if (event.key === 'r' || event.key === 'R') {
      this.emit('restart');
    }
    
    // Prevent default for game keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
      event.preventDefault();
    }
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.keys.set(event.key, false);
  };

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key) || false;
  }

  public on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  private emit(event: string): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler());
    }
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keys.clear();
    this.eventHandlers.clear();
  }
}