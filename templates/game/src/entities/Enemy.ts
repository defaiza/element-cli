import { GameObject } from '../types';
import { Bullet } from './Bullet';

export class Enemy implements GameObject {
  x: number;
  y: number;
  width: number = 30;
  height: number = 30;
  velocityX: number;
  velocityY: number = 0;
  color: string = '#ff0000';
  
  private health: number = 2;
  private shootCooldown: number = 0;
  private moveDirection: number = 1;
  private moveSpeed: number = 100;
  
  public bullets: Bullet[] = [];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.velocityX = this.moveSpeed * (Math.random() > 0.5 ? 1 : -1);
    this.shootCooldown = Math.random() * 2;
  }

  update(deltaTime: number, screenWidth: number, screenHeight: number): void {
    // Update position
    this.x += this.velocityX * deltaTime;
    
    // Bounce off walls
    if (this.x <= 0 || this.x >= screenWidth - this.width) {
      this.velocityX = -this.velocityX;
      this.y += 20; // Move down when hitting wall
    }

    // Random shooting
    this.shootCooldown -= deltaTime;
    if (this.shootCooldown <= 0) {
      this.shoot();
      this.shootCooldown = Math.random() * 2 + 1; // 1-3 seconds
    }

    // Update bullets
    this.bullets = this.bullets.filter(bullet => {
      bullet.update(deltaTime);
      return bullet.y < screenHeight + bullet.height && !bullet.isDead();
    });
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Draw enemy (square)
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Draw health indicator
    if (this.health < 2) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(this.x + this.width / 2 - 2, this.y - 5, 4, 4);
    }

    // Render bullets
    this.bullets.forEach(bullet => bullet.render(ctx));
  }

  private shoot(): void {
    const bullet = new Bullet(
      this.x + this.width / 2 - 2,
      this.y + this.height,
      0,
      300,
      '#ff0000'
    );
    this.bullets.push(bullet);
  }

  takeDamage(amount: number): void {
    this.health -= amount;
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}