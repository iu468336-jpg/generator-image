export type AspectRatio = '1:1' | '3:4' | '16:9';

export type ArtStyle = 'Photo' | 'Cinématique' | 'Anime' | '3D' | 'Peinture';

export interface Creation {
  id: string;
  prompt: string;
  uri: string;
  createdAt: number;
  aspectRatio: AspectRatio;
  style: ArtStyle;
}

export interface GenerationOptions {
  prompt: string;
  aspectRatio: AspectRatio;
  style: ArtStyle;
}

export interface GenerationResult {
  localUri: string;
  enhancedPrompt: string;
  provider: 'replicate' | 'pollinations';
}

export class GenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GenerationError';
  }
}
