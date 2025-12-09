import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MusicStateService } from '../services/music-state';
import { AudioPlayerService } from '../services/audio-player'; 
import { Track } from '../models/track.models';

@Component({
  selector: 'app-player-controls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-controls.html',
  styleUrls: ['./player-controls.css']
})
export class PlayerControlsComponent implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 50; 
  
  private subscriptions: Subscription[] = [];

  constructor(
    private musicState: MusicStateService,
    private audioPlayer: AudioPlayerService // INYECTAR
  ) {}

  ngOnInit(): void {
    // 1. Escuchar cambio de canción
    const trackSub = this.musicState.currentTrack$.subscribe(track => {
      // Si cambia la canción y tiene preview, reproducirla automáticamente
      if (track && track.id !== this.currentTrack?.id && track.previewUrl) {
        this.audioPlayer.playTrack(track.previewUrl);
      }
      this.currentTrack = track;
    });

    // 2. Escuchar estado de reproducción (Play/Pause)
    const playingSub = this.audioPlayer.isPlaying$.subscribe(isPlaying => {
      this.isPlaying = isPlaying;
    });

    // 3. Escuchar progreso de tiempo
    const timeSub = this.audioPlayer.currentTime$.subscribe(time => {
      this.currentTime = time;
    });

    // 4. Escuchar duración real del audio
    const durationSub = this.audioPlayer.duration$.subscribe(dur => {
      // Usamos la duración del audio real (30s) en lugar de la del track completo
      // para que la barra de progreso sea precisa con el preview.
      this.duration = dur;
    });

    this.subscriptions.push(trackSub, playingSub, timeSub, durationSub);
    
    // Configurar volumen inicial
    this.audioPlayer.setVolume(this.volume);
  }

  togglePlay(): void {
    if (this.currentTrack?.previewUrl) {
      this.audioPlayer.togglePlay();
    } else {
      console.warn('Esta canción no tiene vista previa disponible');
    }
  }

  seek(event: Event): void {
    const input = event.target as HTMLInputElement;
    const timeMs = parseInt(input.value);
    this.audioPlayer.seek(timeMs);
  }

  changeVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume = parseInt(input.value);
    this.audioPlayer.setVolume(this.volume);
  }

  // Helpers visuales
  formatTime(ms: number): string {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Funciones placeholder (para el futuro)
  previous() { console.log('Anterior'); }
  next() { console.log('Siguiente'); }
  toggleShuffle() { console.log('Aleatorio'); }
  toggleRepeat() { console.log('Repetir'); }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}