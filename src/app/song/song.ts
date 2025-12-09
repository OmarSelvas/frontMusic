import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, of, Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { MusicStateService } from '../services/music-state';
import { AudioPlayerService } from '../services/audio-player';
import { BackendApiService } from '../services/api-backend.service';
import { Track } from '../models/track.models';
import { MyTrack, MyArtist, MyAlbum } from '../models/backend.model';

@Component({
  selector: 'app-song',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song.html',
  styleUrls: ['./song.css']
})
export class Song implements OnInit, OnDestroy {
  currentTrack: Track | null = null;
  isLoading = false;
  errorMessage: string | null = null;
  saveMessage: string = '';
  isSaving = false; 

  private readonly DEFAULT_ARTIST = 'Spotify General';
  private readonly DEFAULT_ALBUM = 'Favoritos de Spotify';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private musicState: MusicStateService,
    private myBackend: BackendApiService,
    private audioPlayer: AudioPlayerService
  ) {}

  ngOnInit(): void {
    const trackSub = this.musicState.currentTrack$.subscribe(track => {
      this.currentTrack = track;
      this.saveMessage = '';
    });

    const loadingSub = this.musicState.loading$.subscribe(loading => {
      this.isLoading = loading;
    });

    const errorSub = this.musicState.error$.subscribe(error => {
      this.errorMessage = error;
    });

    this.subscriptions.push(trackSub, loadingSub, errorSub);
  }

  // --- LÓGICA INTELIGENTE DE GUARDADO AUTOMÁTICO ---
  saveToMyDb(): void {
    if (!this.currentTrack || this.isSaving) return;

    this.isSaving = true;
    this.saveMessage = '⏳ Guardando en biblioteca...';

    // 1. Buscar o Crear Artista
    this.ensureArtist(this.DEFAULT_ARTIST).pipe(
      // 2. Con el Artista listo, Buscar o Crear Álbum
      switchMap(artist => {
        if (!artist.id) throw new Error('No se pudo obtener ID del artista');
        return this.ensureAlbum(this.DEFAULT_ALBUM, artist.id);
      }),
      // 3. Con el Álbum listo, Guardar la Canción
      switchMap(album => {
        if (!album.id) throw new Error('No se pudo obtener ID del álbum');
        
        const myTrack: MyTrack = {
          title: this.currentTrack!.name,
          duration: this.currentTrack!.duration,
          albumId: album.id
        };
        return this.myBackend.saveTrack(myTrack);
      })
    ).subscribe({
      next: (response) => {
        console.log('✅ Guardado exitoso:', response);
        this.saveMessage = '✅ Guardada en Biblioteca';
        this.isSaving = false;
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: (err) => {
        console.error('❌ Error en el proceso:', err);
        this.saveMessage = '❌ Error al guardar';
        this.isSaving = false;
      }
    });
  }

  private ensureArtist(name: string): Observable<MyArtist> {
    return this.myBackend.getAllArtists().pipe(
      map(response => response.data.find(a => a.name === name)),
      switchMap(existingArtist => {
        if (existingArtist) {
          return of(existingArtist); 
        }
        return this.myBackend.createArtist({ name: name, genre: 'Mix' });
      })
    );
  }

  private ensureAlbum(title: string, artistId: string): Observable<MyAlbum> {
    return this.myBackend.getAllAlbums().pipe(
      map(response => response.data.find(a => a.title === title && a.artistId === artistId)),
      switchMap(existingAlbum => {
        if (existingAlbum) {
          return of(existingAlbum); // Ya existe
        }
        // No existe, lo creamos
        return this.myBackend.createAlbum({ 
          title: title, 
          releaseYear: new Date().getFullYear(),
          artistId: artistId 
        });
      })
    );
  }


  getImageUrl(): string {
    if (this.currentTrack?.albumImage) {
      return this.currentTrack.albumImage;
    }
    return 'assets/default-music.png';
  }

  hasImage(): boolean {
    const url = this.getImageUrl();
    return url !== 'assets/default-music.png' && url.length > 0;
  }

  getDuration(): string {
    const durationMs = this.audioPlayer.duration$.value || this.currentTrack?.duration;
    
    if (!durationMs) return '0:00';
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  hasPreview(): boolean {
    return !!this.currentTrack?.previewUrl;
  }

  clearError(): void {
    this.musicState.clearError();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}