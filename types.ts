
export type ViewState = 'categories' | 'years' | 'albums' | 'photos';

export interface Category {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

export interface Album {
  id: string;
  title: string;
  coverImage: string;
  photographer?: string;
  count: number;
  year?: number; // Ano específico do álbum (essencial para Artwork)
  coverTag?: string; // Tag específica para buscar a imagem de capa no Cloudinary
}

export interface Photo {
  id: string;
  url: string; // URL otimizada para Fullscreen (High Res)
  thumbnailUrl: string; // URL otimizada para Grid (Low Res)
  title: string;
  width: number;
  height: number;
}

// Interface para a resposta da lista do Cloudinary
export interface CloudinaryResource {
  public_id: string;
  version: number;
  format: string;
  width: number;
  height: number;
  type: string;
  created_at: string;
}

export interface CloudinaryListResponse {
  resources: CloudinaryResource[];
}