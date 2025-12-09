import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendApiService } from '../../services/api-backend.service';
import { MyTrack } from '../../models/backend.model';

@Component({
  selector: 'app-my-tracks',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-tracks.html',
  styleUrls: ['./my-tracks.css']
})
export class MyTracksComponent implements OnInit {
  misCanciones: MyTrack[] = [];
  isLoading = true;

  constructor(private myBackend: BackendApiService) {}

  ngOnInit() {
    this.cargarCanciones();
  }

  cargarCanciones() {
    this.myBackend.getAllTracks().subscribe({
      next: (respuesta) => {
        this.misCanciones = respuesta.data || []; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando mis canciones', err);
        this.isLoading = false;
      }
    });
  }
}