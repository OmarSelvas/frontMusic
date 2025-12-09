export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface MyArtist {
  id?: string;
  name: string;
  genre?: string;
}

export interface MyAlbum {
  id?: string;
  title: string;
  releaseYear: number;
  artistId: string;
}

export interface MyTrack {
  id?: string;
  title: string;
  duration: number;
  albumId: string;
}

export interface MyPlaylist {
  id?: string;
  name: string;
}