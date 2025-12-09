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

  eliminarCancion(id: string | undefined) {
    console.log('CLICK EN ELIMINAR. ID recibido:', id); 

    if (!id) {
      console.error('ERROR: El ID de la canción es nulo o inválido.');
      return; 
    }

    if(confirm('¿Seguro que quieres borrar esta canción de tu biblioteca?')) {
      
      const respaldo = [...this.misCanciones];
      this.misCanciones = this.misCanciones.filter(track => track.id !== id);
      this.myBackend.deleteTrack(id).subscribe({
        next: () => {
          console.log(`✅ Canción con ID ${id} eliminada de Ktor/PostgreSQL.`);
        },
        error: (err) => {
          console.error('❌ Error al eliminar en el servidor:', err);
          this.misCanciones = respaldo;
          alert('Error al eliminar la canción del servidor. Revisa la consola (red).');
        }
      });
    }
  }
}