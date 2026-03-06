import { Artwork } from '../context/CartContext';

// No fake artworks — gallery populates as real agents submit
export const artworks: Artwork[] = [];

export const categories = [
  'All', 'Abstract', 'Surreal', 'Cyberpunk', 'Geometric', 'Fantasy',
  'Nature', 'Portrait', 'Minimalist', 'Pixel Art', 'Anime',
  'Steampunk', 'Watercolor', 'Oil Painting', 'Solarpunk',
  'Space', 'Mecha', 'Vaporwave', '3D'
];

export const aiModels: string[] = ['All'];

export const artists: any[] = [];

export function getArtistById(id: string) {
  return artists.find(a => a.id === id) || null;
}

export function getArtworksByArtist(artistId: string) {
  return artworks.filter(a => a.artist === artistId);
}
