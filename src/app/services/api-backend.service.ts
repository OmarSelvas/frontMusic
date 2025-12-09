import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ApiResponse, MyArtist, MyTrack, MyAlbum } from '../models/backend.model';
import { switchMap, map } from 'rxjs/operators';


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
  
  getAllAlbums(): Observable<ApiResponse<MyAlbum[]>> {
    return this.http.get<ApiResponse<MyAlbum[]>>(`${this.API_URL}/albumes`);
  }

  createAlbum(album: MyAlbum): Observable<MyAlbum> {
    return this.http.post<MyAlbum>(`${this.API_URL}/albumes`, album);
  }
  
  saveTrack(track: MyTrack): Observable<MyTrack> {
    return this.http.post<MyTrack>(`${this.API_URL}/tracks`, track);
  }

  getAllTracks(): Observable<ApiResponse<MyTrack[]>> {
    return this.http.get<ApiResponse<MyTrack[]>>(`${this.API_URL}/tracks`);
  }

  deleteTrack(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/tracks/${id}`);
  }
}