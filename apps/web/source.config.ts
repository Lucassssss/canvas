import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export interface NewsFrontmatter {
  title: string;
  description?: string;
  date?: string;
  category?: string;
}

export const docs = defineDocs({
  dir: 'content/news',
});
export default defineConfig();