import { Routes } from '@angular/router';
import { SearchResultsComponent } from './search-results/search-results';
import { PlayerView } from './player-view/player-view';
import { MyTracksComponent } from './components/my-tracks/my-tracks';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchResultsComponent },
  { path: 'player', component: PlayerView },
  { path: 'mis-canciones', component: MyTracksComponent }, 
  { path: 'biblioteca', component: MyTracksComponent },
  { path: '**', redirectTo: '/search' }
];