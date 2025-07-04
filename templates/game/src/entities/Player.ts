import { GameObject } from '../types';
import { Bullet } from './Bullet';
import { InputManager } from '../managers/InputManager';

export class Player implements GameObject {
  x: number;
  y: number;
  width: number = 40;
  height: number = 40;
  velocityX: number = 0;
  velocityY: number = 0;
  color: string = '#00ff00';
  
  private speed: number = 300;
  private health: number = 3;
  private maxHealth: number = 3;
  private invulnerable: boolean = false;
  private invulnerableTime: number = 0;
  private shootCooldown: number = 0;
  
  public bullets: Bullet[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  handleInput(inputManager: InputManager): void {
    // Movement
    this.velocityX = 0;
    this.velocityY = 0;

    if (inputManager.isKeyPressed('ArrowLeft') || inputManager.isKeyPressed('a')) {
      this.velocityX = -this.speed;
    }
    if (inputManager.isKeyPressed('ArrowRight') || inputManager.isKeyPressed('d')) {
      this.velocityX = this.speed;
    }
    if (inputManager.isKeyPressed('ArrowUp') || inputManager.isKeyPressed('w')) {
      this.velocityY = -this.speed;
    }
    if (inputManager.isKeyPressed('ArrowDown') || inputManager.isKeyPressed('s')) {
      this.velocityY = this.speed;
    }

    // Shooting
    if (inputManager.isKeyPressed(' ') && this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = 0.2; // 200ms cooldown
    }
  }

  update(deltaTime: number, screenWidth: number, screenHeight: number): void {
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;

    // Keep player on screen
    this.x = Math.max(0, Math.min(screenWidth - this.width, this.x));
    this.y = Math.max(0, Math.min(screenHeight - this.height, this.y));

    // Update invulnerability
    if (this.invulnerable) {
      this.invulnerableTime -= deltaTime;
      if (this.invulnerableTime <= 0) {
        this.invulnerable = false;
      }
    }

    // Update cooldowns
    if (this.shootCooldown > 0) {
      this.shootCooldown -= deltaTime;
    }

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.y > -bullet.height && !bullet.isDead();
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Flashing effect when invulnerable
    if (this.invulnerable && Math.floor(this.invulnerableTime * 10) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    // Draw player ship (triangle)
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    // Draw health bar
    const barWidth = this.width;
    const barHeight = 4;
    const barY = this.y - 10;
    
    ctx.fillStyle = '#333333';
    ctx.fillRect(this.x, barY, barWidth, barHeight);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, barY, (this.health / this.maxHealth) * barWidth, barHeight);

    ctx.globalAlpha = 1;

    // Render bullets
    this.bullets.forEach(bullet => bullet.render(ctx));
  }

  private shoot(): void {
    const bullet = new Bullet(
      this.x + this.width / 2 - 2,
      this.y,
      0,
      -500,
      '#00ff00'
    );
    this.bullets.push(bullet);
  }

  takeDamage(amount: number): void {
    if (!this.invulnerable) {
      this.health -= amount;
      this.invulnerable = true;
      this.invulnerableTime = 2; // 2 seconds of invulnerability
    }
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  respawn(x: number, y: number): void {
    this.x = x;
    this.y = y;
    this.health = this.maxHealth;
    this.invulnerable = true;
    this.invulnerableTime = 3;
    this.bullets = [];
  }
}