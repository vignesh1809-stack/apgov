/**
 * High-Performance Client-Side Image Compressor for Government-Scale Uploads
 * Downscales camera evidence to max 1280x1280 and converts to lightweight WebP format.
 * Reduces S3/GCS bandwidth & storage costs by up to 85%.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  mimeType?: 'image/webp' | 'image/jpeg';
}

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<{ blob: Blob; dataUrl: string; sizeReductionPercent: number }> => {
  const {
    maxWidth = 1280,
    maxHeight = 1280,
    quality = 0.8,
    mimeType = 'image/webp',
  } = options;

  return new Promise((resolve, reject) => {
    // If not an image, reject
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio bounding box
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas 2D context'));
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP / JPEG
        const targetMime = canvas.toDataURL(mimeType).startsWith(`data:${mimeType}`)
          ? mimeType
          : 'image/jpeg';

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }

            const dataUrl = canvas.toDataURL(targetMime, quality);
            const originalSize = file.size;
            const compressedSize = blob.size;
            const sizeReductionPercent = Math.max(
              0,
              Math.round(((originalSize - compressedSize) / originalSize) * 100)
            );

            resolve({
              blob,
              dataUrl,
              sizeReductionPercent,
            });
          },
          targetMime,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Failed to load image into canvas'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
};
