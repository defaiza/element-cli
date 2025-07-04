import { GameObject } from '../types';

interface ParticleOptions {
  velocityX?: number;
  velocityY?: number;
  color?: string;
  size?: number;
  lifetime?: number;
  gravity?: number;
  friction?: number;
}

export class Particle implements GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  color: string;
  
  private lifetime: number;
  private age: number = 0;
  private gravity: number;
  private friction: number;
  private initialSize: number;

  constructor(x: number, y: number, options: ParticleOptions = {}) {
    this.x = x;
    this.y = y;
    this.velocityX = options.velocityX || 0;
    this.velocityY = options.velocityY || 0;
    this.color = options.color || '#ffffff';
    this.initialSize = options.size || 3;
    this.width = this.initialSize;
    this.height = this.initialSize;
    this.lifetime = options.lifetime || 1;
    this.gravity = options.gravity || 200;
    this.friction = options.friction || 0.98;
  }

  update(deltaTime: number): void {
    this.age += deltaTime;
    
    // Apply physics
    this.velocityY += this.gravity * deltaTime;
    this.velocityX *= this.friction;
    this.velocityY *= this.friction;
    
    // Update position
    this.x += this.velocityX * deltaTime;
    this.y += this.velocityY * deltaTime;
    
    // Update size based on age
    const lifePercent = 1 - (this.age / this.lifetime);
    this.width = this.initialSize * lifePercent;
    this.height = this.initialSize * lifePercent;
  }

  render(ctx: CanvasRenderingContext2D): void {
    const lifePercent = 1 - (this.age / this.lifetime);
    ctx.globalAlpha = lifePercent;
    ctx.fillStyle = this.color;
    ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    ctx.globalAlpha = 1;
  }

  isDead(): boolean {
    return this.age >= this.lifetime;
  }
}