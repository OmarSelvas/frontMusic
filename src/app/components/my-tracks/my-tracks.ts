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
    this.isLoading = true;
    this.myBackend.getAllTracks().subscribe({
      next: (respuesta) => {
        this.misCanciones = respuesta.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando canciones', err);
        this.isLoading = false;
      }
    });
  }

  eliminarCancion(id: string | undefined) {
    if (!id) return;

    if(confirm('¿Seguro que quieres borrar esta canción?')) {
      const respaldo = [...this.misCanciones];
      this.misCanciones = this.misCanciones.filter(track => track.id !== id);

      this.myBackend.deleteTrack(id).subscribe({
        next: () => console.log('Eliminado correctamente'),
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.misCanciones = respaldo;
          alert('Hubo un error al eliminar la canción');
        }
      });
    }
  }
}