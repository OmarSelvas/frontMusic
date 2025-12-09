import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { SearchBar } from './search-bar/search-bar';
import { PlayerControlsComponent } from './player-controls/player-controls';
import { MusicStateService } from './services/music-state';
import { Track } from './models/track.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SearchBar,
    PlayerControlsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Spotify Player';
  
  tracks: Track[] = [];
  currentTrack: Track | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private musicState: MusicStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tracksSub = this.musicState.trackList$.subscribe(tracks => {
      this.tracks = tracks;
    });

    const currentSub = this.musicState.currentTrack$.subscribe(track => {
      this.currentTrack = track;
    });

    this.subscriptions.push(tracksSub, currentSub);
  }

  navigateToSearch(): void {
    this.router.navigate(['/search']);
  }

  isSearchActive(): boolean {
    return this.router.url === '/search';
  }

  hasTracks(): boolean {
    return this.tracks.length > 0;
  }

  getTracks(): Track[] {
    return this.tracks;
  }

  getTrackCount(): number {
    return this.tracks.length;
  }

  isCurrentTrack(track: Track): boolean {
    return this.currentTrack?.id === track.id;
  }

  selectTrack(track: Track): void {
    if (!track || !track.id) {
      console.error('Canción inválida');
      return;
    }
    this.musicState.selectTrackAndReorder(track);
    this.router.navigate(['/player']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}