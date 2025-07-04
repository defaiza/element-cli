import { Game } from './Game';
import { GameConfig } from './types';

export function createGame(container: HTMLElement, config?: Partial<GameConfig>) {
  const game = new Game(container, config);
  game.start();
  
  return {
    game,
    destroy: () => game.destroy()
  };
}

// Auto-mount if container exists
const container = document.getElementById('game-container');
if (container) {
  createGame(container);
}