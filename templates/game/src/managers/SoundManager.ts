interface Sound {
  audio: HTMLAudioElement;
  volume: number;
}

export class SoundManager {
  private sounds: Map<string, Sound> = new Map();
  private enabled: boolean = true;
  private globalVolume: number = 0.5;

  constructor() {
    // Initialize with placeholder sounds
    // In a real implementation, you would load actual audio files
    this.initializeSounds();
  }

  private initializeSounds(): void {
    // Create placeholder audio elements
    // In production, these would load actual sound files
    const soundConfigs = [
      { name: 'shoot', volume: 0.3 },
      { name: 'explosion', volume: 0.5 },
      { name: 'levelUp', volume: 0.7 },
      { name: 'gameOver', volume: 0.6 },
      { name: 'powerUp', volume: 0.4 }
    ];

    soundConfigs.forEach(config => {
      // Create a silent audio element as placeholder
      const audio = new Audio();
      audio.volume = config.volume * this.globalVolume;
      
      this.sounds.set(config.name, {
        audio,
        volume: config.volume
      });
    });
  }

  public play(soundName: string): void {
    if (!this.enabled) return;
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        // Clone the audio to allow multiple simultaneous plays
        const audioClone = sound.audio.cloneNode() as HTMLAudioElement;
        audioClone.volume = sound.volume * this.globalVolume;
        audioClone.play().catch(() => {
          // Ignore errors for demo
        });
      } catch (error) {
        // Ignore errors for demo
      }
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public setGlobalVolume(volume: number): void {
    this.globalVolume = Math.max(0, Math.min(1, volume));
    
    // Update all sound volumes
    this.sounds.forEach(sound => {
      sound.audio.volume = sound.volume * this.globalVolume;
    });
  }

  public destroy(): void {
    this.sounds.clear();
  }
}