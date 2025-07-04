import { Rectangle } from '../types';

export class CollisionManager {
  public checkCollision(rect1: Rectangle, rect2: Rectangle): boolean {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }

  public checkPointInRectangle(x: number, y: number, rect: Rectangle): boolean {
    return x >= rect.x &&
           x <= rect.x + rect.width &&
           y >= rect.y &&
           y <= rect.y + rect.height;
  }

  public getOverlapArea(rect1: Rectangle, rect2: Rectangle): number {
    const xOverlap = Math.max(0, Math.min(rect1.x + rect1.width, rect2.x + rect2.width) - Math.max(rect1.x, rect2.x));
    const yOverlap = Math.max(0, Math.min(rect1.y + rect1.height, rect2.y + rect2.height) - Math.max(rect1.y, rect2.y));
    return xOverlap * yOverlap;
  }

  public getDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public checkCircleCollision(
    x1: number, y1: number, radius1: number,
    x2: number, y2: number, radius2: number
  ): boolean {
    const distance = this.getDistance(x1, y1, x2, y2);
    return distance < radius1 + radius2;
  }
}