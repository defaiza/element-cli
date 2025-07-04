# DEFAI Game Element Template

A canvas-based game template for creating DEFAI game elements with TypeScript support.

## Features

- **Game Engine**: Complete game loop with update and render cycles
- **Entity System**: Player, enemies, bullets, and particles
- **Physics**: Basic collision detection and movement
- **Input Management**: Keyboard controls with customizable bindings
- **Sound System**: Sound effect management (ready for audio files)
- **Particle Effects**: Explosion and visual effects system
- **Game States**: Pause, game over, and level progression
- **Performance**: FPS counter and optimized rendering

## Game Controls

- **Arrow Keys / WASD**: Move player
- **Space**: Shoot
- **P**: Pause/Resume
- **R**: Restart (when game over)

## Project Structure

```
src/
├── entities/          # Game objects (Player, Enemy, Bullet, Particle)
├── managers/         # Game systems (Input, Collision, Sound)
├── types.ts          # TypeScript interfaces
├── Game.ts           # Main game class
└── main.ts           # Entry point
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## Customization

### Adding New Entities

1. Create a new class implementing the `GameObject` interface
2. Add update and render methods
3. Instantiate in the Game class

### Adding Sound Effects

1. Place audio files in the assets directory
2. Load them in SoundManager
3. Call `soundManager.play('soundName')`

### Modifying Game Rules

- Adjust difficulty in `Game.ts` (enemy spawn rates, speeds)
- Modify player stats in `Player.ts`
- Change visual effects in `Particle.ts`

## Building for DEFAI

The build output will be in the `dist` directory, ready to be deployed as a DEFAI element.

## Performance Tips

- Keep particle counts reasonable
- Implement object pooling for bullets/enemies if needed
- Use sprite sheets for complex graphics
- Consider WebGL renderer for intensive games