const urlMaxWidthCache = new Map<string, number>();

export function clearImageOptimizationCache(): void {
  urlMaxWidthCache.clear()
}

export function getOptimizedImageUrl(src: string, targetWidth?: number): string {
  if (!src) return src

  try {
    const url = new URL(src)

    // Check if the domain is our S4/CDN domain
    if (url.hostname === 'd-assets-cn.joii.cc' || url.hostname.includes('bitiful.com')) {
      // Don't override if format or width parameters are already explicitly provided
      if (url.searchParams.has('fmt') || url.searchParams.has('w')) {
        return src
      }

      // 1. Force modern high-compression format
      url.searchParams.set('fmt', 'webp')

      // 2. Add dynamic resizing if width is known
      if (targetWidth && targetWidth > 0) {
        // Use devicePixelRatio to ensure retina screens get sharp images
        const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2

        // Bucket the target width to nearest 200px to prevent cache-busting spam on every tiny resize
        let bucketedWidth = Math.ceil(targetWidth / 200) * 200;

        // Ensure we never request a smaller width than we already have seen (to save traffic when shrinking)
        const currentMax = urlMaxWidthCache.get(src) || 0;
        if (bucketedWidth < currentMax) {
          bucketedWidth = currentMax;
        } else {
          urlMaxWidthCache.set(src, bucketedWidth);
        }

        // Calculate the required width, cap it to a maximum reasonable S4 processing limit (e.g., 2560px)
        const optimizedWidth = Math.min(2560, bucketedWidth * dpr)

        url.searchParams.set('w', optimizedWidth.toString())
      }

      return url.toString()
    }
  } catch (e) {
    // Graceful fallback for invalid URLs or relative paths
    return src
  }

  return src
}
