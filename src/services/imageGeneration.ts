import { Directory, File, Paths } from 'expo-file-system';
import { AspectRatio, ArtStyle, GenerationError, GenerationOptions, GenerationResult, RateLimitError } from '../types';

const STYLE_KEYWORDS: Record<ArtStyle, string> = {
  Photo: 'photorealistic, realistic photography',
  Cinématique: 'cinematic lighting, movie still, dramatic atmosphere',
  Anime: 'anime style, vibrant japanese animation art',
  '3D': '3d render, octane render, unreal engine',
  Peinture: 'oil painting, fine art, painterly brush strokes',
};

const QUALITY_KEYWORDS = 'high detail, sharp focus, professional lighting, 4k, ultra quality';

const ASPECT_DIMENSIONS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1024, height: 1024 },
  '3:4': { width: 864, height: 1152 },
  '16:9': { width: 1280, height: 720 },
};

const MAX_ATTEMPTS = 2;
const TIMEOUT_MS = 90_000;
export const POLLINATIONS_COOLDOWN_MS = 46_000;

export function isUsingPollinations(): boolean {
  return !process.env.EXPO_PUBLIC_REPLICATE_KEY;
}

function extractHttpStatus(message: string): number | null {
  const match = message.match(/\b(4\d{2}|5\d{2})\b/);
  return match ? parseInt(match[1], 10) : null;
}

export function enhancePrompt(prompt: string, style: ArtStyle): string {
  const trimmed = prompt.trim();
  return `${trimmed}, ${STYLE_KEYWORDS[style]}, ${QUALITY_KEYWORDS}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeReadText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

async function downloadImage(remoteUrl: string): Promise<string> {
  const imagesDir = new Directory(Paths.document, 'images');
  if (!imagesDir.exists) {
    imagesDir.create({ intermediates: true, idempotent: true });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let file: File;
  try {
    file = await File.downloadFileAsync(remoteUrl, imagesDir, { signal: controller.signal, idempotent: true });
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new GenerationError("Le téléchargement de l'image a pris trop de temps. Vérifiez votre connexion.");
    }
    const message = err instanceof Error ? err.message : String(err);
    const status = extractHttpStatus(message);
    if (status === 402) {
      throw new RateLimitError(
        'Limite gratuite atteinte : le service de génération gratuit autorise 1 image toutes les 45 secondes. Veuillez patienter.',
        46
      );
    }
    if (status === 429) {
      throw new RateLimitError('Trop de requêtes envoyées. Veuillez patienter quelques secondes avant de réessayer.', 20);
    }
    throw new GenerationError("Le serveur de génération n'a pas pu être contacté. Réessayez.");
  } finally {
    clearTimeout(timer);
  }

  const sizeOk = file.exists && file.size > 2000;
  const typeOk = file.type.toLowerCase().startsWith('image/');

  if (!sizeOk || !typeOk) {
    file.delete();
    throw new GenerationError("L'image générée est invalide ou incomplète. Réessayez.");
  }

  return file.uri;
}

async function generateWithReplicate(
  prompt: string,
  aspectRatio: AspectRatio,
  apiKey: string
): Promise<GenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const createRes = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Prefer: 'wait=55',
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: aspectRatio,
          output_format: 'png',
          safety_tolerance: 2,
        },
      }),
      signal: controller.signal,
    });

    if (!createRes.ok) {
      const text = await safeReadText(createRes);
      throw new GenerationError(`Le service Replicate a répondu avec une erreur (${createRes.status}). ${text}`);
    }

    let prediction = await createRes.json();
    const deadline = Date.now() + TIMEOUT_MS;

    while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
      if (Date.now() > deadline) {
        throw new GenerationError('La génération a dépassé le délai autorisé (90s). Réessayez.');
      }
      await delay(2000);
      const pollRes = await fetch(prediction.urls.get, {
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: controller.signal,
      });
      prediction = await pollRes.json();
    }

    if (prediction.status !== 'succeeded') {
      const errMessage = typeof prediction.error === 'string' ? prediction.error : null;
      throw new GenerationError(errMessage ?? "La génération d'image a échoué sur Replicate.");
    }

    const outputUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
    if (!outputUrl || typeof outputUrl !== 'string') {
      throw new GenerationError('Réponse invalide du service de génération.');
    }

    const localUri = await downloadImage(outputUrl);
    return { localUri, enhancedPrompt: prompt, provider: 'replicate' };
  } finally {
    clearTimeout(timeoutId);
  }
}

async function generateWithPollinations(prompt: string, aspectRatio: AspectRatio): Promise<GenerationResult> {
  const { width, height } = ASPECT_DIMENSIONS[aspectRatio];
  const seed = Math.floor(Math.random() * 1_000_000_000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
    prompt
  )}?width=${width}&height=${height}&model=flux&nologo=true&enhance=true&seed=${seed}`;

  const localUri = await downloadImage(url);
  return { localUri, enhancedPrompt: prompt, provider: 'pollinations' };
}

export async function generateImage(options: GenerationOptions): Promise<GenerationResult> {
  if (!options.prompt.trim()) {
    throw new GenerationError('Veuillez décrire l’image que vous souhaitez créer.');
  }

  const enhanced = enhancePrompt(options.prompt, options.style);
  const replicateKey = process.env.EXPO_PUBLIC_REPLICATE_KEY;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      if (replicateKey) {
        return await generateWithReplicate(enhanced, options.aspectRatio, replicateKey);
      }
      return await generateWithPollinations(enhanced, options.aspectRatio);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError instanceof RateLimitError) {
        break;
      }
      if (attempt < MAX_ATTEMPTS) {
        await delay(1500);
      }
    }
  }

  if (lastError instanceof GenerationError) {
    throw lastError;
  }
  throw new GenerationError(
    lastError?.message ?? "Impossible de générer l'image. Vérifiez votre connexion internet et réessayez."
  );
}
