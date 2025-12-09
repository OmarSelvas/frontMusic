import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioPlayerService {
  private audio = new Audio();
  
  public isPlaying$ = new BehaviorSubject<boolean>(false);
  public currentTime$ = new BehaviorSubject<number>(0);
  public duration$ = new BehaviorSubject<number>(0);

  constructor() {
    this.setupAudioEvents();
  }

  private setupAudioEvents() {
    this.audio.addEventListener('canplay', () => {
      this.duration$.next(this.audio.duration * 1000); 
    });

    this.audio.addEventListener('timeupdate', () => {
      this.currentTime$.next(this.audio.currentTime * 1000);
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying$.next(false);
      this.currentTime$.next(0);
    });
  }

  playTrack(url: string) {
    if (!url) {
      console.error('No hay URL de previsualización');
      return;
    }
    this.audio.src = url;
    this.audio.load();
    this.play();
  }

  togglePlay() {
    if (this.audio.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  play() {
    this.audio.play();
    this.isPlaying$.next(true);
  }

  pause() {
    this.audio.pause();
    this.isPlaying$.next(false);
  }

  seek(ms: number) {
    this.audio.currentTime = ms / 1000;
  }

  setVolume(volume: number) {
    // El volumen va de 0.0 a 1.0
    this.audio.volume = Math.max(0, Math.min(1, volume / 100));
  }
}