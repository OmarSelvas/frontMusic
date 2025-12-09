import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators'; 
import { MusicStateService } from '../services/music-state';
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
  realAlbumId: string = ''; 

  private subscriptions: Subscription[] = [];

  constructor(
    private musicState: MusicStateService,
    private myBackend: BackendApiService
  ) {}

  ngOnInit(): void {
    const trackSub = this.musicState.currentTrack$.subscribe(track => {
      this.currentTrack = track;
      this.saveMessage = '';
    });
    this.subscriptions.push(trackSub);
  }

  crearBaseDeDatos() {
    this.saveMessage = '⏳ Creando Artista y Álbum...';
    
    const artista: MyArtist = { name: 'Spotify General', genre: 'Pop' };

    this.myBackend.createArtist(artista).pipe(
      switchMap((artistaCreado: any) => {
        console.log('✅ Artista creado:', artistaCreado);
        
        const album: MyAlbum = {
          title: 'Favoritos de Spotify',
          releaseYear: 2024,
          artistId: artistaCreado.id 
        };
        return this.myBackend.createAlbum(album);
      })
    ).subscribe({
      next: (albumCreado: any) => {
        console.log('✅ ÁLBUM CREADO. ID:', albumCreado.id);
        this.realAlbumId = albumCreado.id; // ¡GUARDAMOS EL ID REAL!
        this.saveMessage = '✅ Base de datos lista. Ahora puedes guardar canciones.';
      },
      error: (err) => {
        console.error(err);
        this.saveMessage = '❌ Error creando base de datos (Revisa consola)';
      }
    });
  }

  saveToMyDb(): void {
    if (!this.currentTrack) return;

    if (!this.realAlbumId) {
      this.saveMessage = '⚠️ Primero dale click al botón gris "Inicializar BD"';
      return;
    }

    const myTrackPayload: MyTrack = {
      title: this.currentTrack.name,
      duration: this.currentTrack.duration,
      albumId: this.realAlbumId // <--- USAMOS EL ID VÁLIDO
    };

    this.myBackend.saveTrack(myTrackPayload).subscribe({
      next: (response) => {
        console.log('Guardado:', response);
        this.saveMessage = '✅ Canción guardada correctamente';
      },
      error: (err) => {
        console.error(err);
        this.saveMessage = '❌ Error al guardar';
      }
    });
  }
  
  getImageUrl(): string { return this.currentTrack?.albumImage || 'assets/default-music.png'; }
  hasImage(): boolean { return !!this.getImageUrl(); }
  getDuration(): string { return '0:00'; }
  hasPreview(): boolean { return false; }
  clearError(): void {}
  ngOnDestroy(): void { this.subscriptions.forEach(s => s.unsubscribe()); }
}