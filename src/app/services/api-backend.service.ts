import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse, MyArtist, MyTrack, MyPlaylist } from '../models/backend.model';
import { MyAlbum } from '../models/backend.model'; 

@Injectable({
  providedIn: 'root'
})
export class BackendApiService {
  private readonly API_URL = environment.myApi.url;

  constructor(private http: HttpClient) {}

  
  getAllArtists(): Observable<ApiResponse<MyArtist[]>> {
    return this.http.get<ApiResponse<MyArtist[]>>(`${this.API_URL}/artistas`);
  }

  createArtist(artist: MyArtist): Observable<MyArtist> {
    return this.http.post<MyArtist>(`${this.API_URL}/artistas`, artist);
  }

  
  saveTrack(track: MyTrack): Observable<MyTrack> {
    return this.http.post<MyTrack>(`${this.API_URL}/tracks`, track);
  }

  getAllTracks(): Observable<ApiResponse<MyTrack[]>> {
    return this.http.get<ApiResponse<MyTrack[]>>(`${this.API_URL}/tracks`);
  }

  createPlaylist(name: string): Observable<MyPlaylist> {
    return this.http.post<MyPlaylist>(`${this.API_URL}/playlists`, { name });
  }


  createAlbum(album: MyAlbum): Observable<MyAlbum> {
    return this.http.post<MyAlbum>(`${this.API_URL}/albumes`, album);
  }
}
