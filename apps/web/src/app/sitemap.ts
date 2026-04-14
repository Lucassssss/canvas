import { MetadataRoute } from 'next'
import { source } from '@/lib/source'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://joii.cc'
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  const newsPages = source.getPages().map((page) => {
    // 避免因为 page.url 本身携带 / 导致拼接成 //news
    const normalizedPath = page.url.startsWith('/') ? page.url : `/${page.url}`
    return {
      url: `${baseUrl}${normalizedPath}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...newsPages]
}
