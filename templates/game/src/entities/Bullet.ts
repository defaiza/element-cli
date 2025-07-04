import { GameObject } from '../types';

export class Bullet implements GameObject {
  x: number;
  y: number;
  width: number = 4;
  height: number = 10;
  velocityX: number;
  velocityY: number;
  color: string;
  
  private dead: boolean = false;

  constructor(x: number, y: number, velocityX: number, velocityY: number, color: string) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
  }

  update(deltaTime: number): void {
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  isDead(): boolean {
    return this.dead;
  }

  destroy(): void {
    this.dead = true;
  }
}