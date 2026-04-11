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

      // 2. Add dynamic resizing if width is known or default to fallback
      let bucketedWidth = targetWidth && targetWidth > 0 ? Math.ceil(targetWidth / 200) * 200 : 0;
      const currentMax = urlMaxWidthCache.get(src) || 0;

      // If we go off-screen (width 0), ALWAYS fallback to the max width we've already cached.
      // This guarantees the URL string does not change, preventing React from reloading the <img>
      // and preventing the CDN from returning the original massive image without a 'w' parameter.
      if (bucketedWidth === 0) {
        bucketedWidth = currentMax > 0 ? currentMax : 200;
      } else if (bucketedWidth < currentMax) {
        bucketedWidth = currentMax;
      } else {
        urlMaxWidthCache.set(src, bucketedWidth);
      }

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2
      const optimizedWidth = Math.min(2560, bucketedWidth * dpr)
      
      url.searchParams.set('w', optimizedWidth.toString())

      return url.toString()
    }
  } catch (e) {
    // Graceful fallback for invalid URLs or relative paths
    return src
  }

  return src
}
