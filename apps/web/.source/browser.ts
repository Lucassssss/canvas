// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"222.mdx": () => import("../content/news/222.mdx?collection=docs"), "ecommerce-guide.mdx": () => import("../content/news/ecommerce-guide.mdx?collection=docs"), "hello copy.mdx": () => import("../content/news/hello copy.mdx?collection=docs"), "hello.mdx": () => import("../content/news/hello.mdx?collection=docs"), "image-to-image-tech copy.mdx": () => import("../content/news/image-to-image-tech copy.mdx?collection=docs"), "image-to-image-tech.mdx": () => import("../content/news/image-to-image-tech.mdx?collection=docs"), "joii-nano-banana-pro.mdx": () => import("../content/news/joii-nano-banana-pro.mdx?collection=docs"), "series-a-funding.mdx": () => import("../content/news/series-a-funding.mdx?collection=docs"), }),
};
export default browserCollections;