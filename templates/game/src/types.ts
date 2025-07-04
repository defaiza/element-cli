export interface GameConfig {
  width: number;
  height: number;
  fps: number;
  backgroundColor: string;
  showFPS: boolean;
}

export interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  color: string;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  score: number;
  lives: number;
  level: number;
  isPaused: boolean;
  isGameOver: boolean;
}