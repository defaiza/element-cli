import { GameConfig, GameState } from './types';
import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import { Particle } from './entities/Particle';
import { InputManager } from './managers/InputManager';
import { CollisionManager } from './managers/CollisionManager';
import { SoundManager } from './managers/SoundManager';

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private state: GameState;
  private lastTime: number = 0;
  private animationId: number | null = null;
  
  private player: Player;
  private enemies: Enemy[] = [];
  private particles: Particle[] = [];
  
  private inputManager: InputManager;
  private collisionManager: CollisionManager;
  private soundManager: SoundManager;
  
  private fpsCounter: number = 0;
  private fpsTime: number = 0;
  private currentFPS: number = 0;

  constructor(container: HTMLElement, config?: Partial<GameConfig>) {
    this.config = {
      width: 800,
      height: 600,
      fps: 60,
      backgroundColor: '#000000',
      showFPS: true,
      ...config
    };

    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      isPaused: false,
      isGameOver: false
    };

    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    container.appendChild(this.canvas);

    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = context;

    // Initialize managers
    this.inputManager = new InputManager(this.canvas);
    this.collisionManager = new CollisionManager();
    this.soundManager = new SoundManager();

    // Initialize game objects
    this.player = new Player(this.config.width / 2, this.config.height - 100);
    this.spawnEnemies();

    // Set up input handlers
    this.setupInputHandlers();
  }

  private setupInputHandlers(): void {
    this.inputManager.on('pause', () => {
      this.togglePause();
    });

    this.inputManager.on('restart', () => {
      if (this.state.isGameOver) {
        this.restart();
      }
    });
  }

  private spawnEnemies(): void {
    const enemyCount = 3 + this.state.level * 2;
    this.enemies = [];
    
    for (let i = 0; i < enemyCount; i++) {
      const x = Math.random() * (this.config.width - 40) + 20;
      const y = Math.random() * 200 + 50;
      this.enemies.push(new Enemy(x, y));
    }
  }

  public start(): void {
    this.lastTime = performance.now();
    this.gameLoop();
  }

  private gameLoop = (currentTime: number = 0): void => {
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(deltaTime);
    this.render();

    // Calculate FPS
    if (this.config.showFPS) {
      this.fpsCounter++;
      this.fpsTime += deltaTime;
      if (this.fpsTime >= 1) {
        this.currentFPS = this.fpsCounter;
        this.fpsCounter = 0;
        this.fpsTime = 0;
      }
    }

    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    if (this.state.isPaused || this.state.isGameOver) {
      return;
    }

    // Update player
    this.player.handleInput(this.inputManager);
    this.player.update(deltaTime, this.config.width, this.config.height);

    // Update enemies
    this.enemies.forEach(enemy => {
      enemy.update(deltaTime, this.config.width, this.config.height);
    });

    // Update particles
    this.particles = this.particles.filter(particle => {
      particle.update(deltaTime);
      return !particle.isDead();
    });

    // Check collisions
    this.checkCollisions();

    // Check win condition
    if (this.enemies.length === 0) {
      this.nextLevel();
    }
  }

  private checkCollisions(): void {
    // Player bullets vs enemies
    this.player.bullets.forEach((bullet, bulletIndex) => {
      this.enemies.forEach((enemy, enemyIndex) => {
        if (this.collisionManager.checkCollision(bullet, enemy)) {
          // Remove bullet
          this.player.bullets.splice(bulletIndex, 1);
          
          // Damage enemy
          enemy.takeDamage(1);
          
          if (enemy.isDead()) {
            // Create explosion particles
            this.createExplosion(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);
            
            // Remove enemy
            this.enemies.splice(enemyIndex, 1);
            
            // Update score
            this.state.score += 100;
            
            // Play sound
            this.soundManager.play('explosion');
          }
        }
      });
    });

    // Enemy bullets vs player
    this.enemies.forEach(enemy => {
      enemy.bullets.forEach((bullet, bulletIndex) => {
        if (this.collisionManager.checkCollision(bullet, this.player)) {
          // Remove bullet
          enemy.bullets.splice(bulletIndex, 1);
          
          // Damage player
          this.player.takeDamage(1);
          
          if (this.player.isDead()) {
            this.state.lives--;
            if (this.state.lives <= 0) {
              this.gameOver();
            } else {
              this.player.respawn(this.config.width / 2, this.config.height - 100);
            }
          }
        }
      });
    });
  }

  private createExplosion(x: number, y: number): void {
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = Math.random() * 200 + 100;
      const particle = new Particle(x, y, {
        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed,
        color: `hsl(${Math.random() * 60}, 100%, 50%)`,
        size: Math.random() * 4 + 2,
        lifetime: Math.random() * 0.5 + 0.5
      });
      this.particles.push(particle);
    }
  }

  private render(): void {
    // Clear canvas
    this.ctx.fillStyle = this.config.backgroundColor;
    this.ctx.fillRect(0, 0, this.config.width, this.config.height);

    // Render particles (behind everything else)
    this.particles.forEach(particle => {
      particle.render(this.ctx);
    });

    // Render game objects
    this.player.render(this.ctx);
    this.enemies.forEach(enemy => {
      enemy.render(this.ctx);
    });

    // Render UI
    this.renderUI();
  }

  private renderUI(): void {
    // Score
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.state.score}`, 10, 30);

    // Lives
    this.ctx.fillText(`Lives: ${this.state.lives}`, 10, 60);

    // Level
    this.ctx.fillText(`Level: ${this.state.level}`, 10, 90);

    // FPS
    if (this.config.showFPS) {
      this.ctx.fillText(`FPS: ${this.currentFPS}`, this.config.width - 80, 30);
    }

    // Pause screen
    if (this.state.isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.config.width / 2, this.config.height / 2);
      
      this.ctx.font = '24px Arial';
      this.ctx.fillText('Press P to continue', this.config.width / 2, this.config.height / 2 + 50);
      this.ctx.textAlign = 'left';
    }

    // Game over screen
    if (this.state.isGameOver) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.config.width, this.config.height);
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.config.width / 2, this.config.height / 2);
      
      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.state.score}`, this.config.width / 2, this.config.height / 2 + 50);
      this.ctx.fillText('Press R to restart', this.config.width / 2, this.config.height / 2 + 90);
      this.ctx.textAlign = 'left';
    }
  }

  private togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  private nextLevel(): void {
    this.state.level++;
    this.state.score += 500;
    this.spawnEnemies();
    this.soundManager.play('levelUp');
  }

  private gameOver(): void {
    this.state.isGameOver = true;
    this.soundManager.play('gameOver');
  }

  private restart(): void {
    this.state = {
      score: 0,
      lives: 3,
      level: 1,
      isPaused: false,
      isGameOver: false
    };
    
    this.player = new Player(this.config.width / 2, this.config.height - 100);
    this.enemies = [];
    this.particles = [];
    this.spawnEnemies();
  }

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.inputManager.destroy();
    this.soundManager.destroy();
    this.canvas.remove();
  }
}