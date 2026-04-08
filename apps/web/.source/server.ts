// @ts-nocheck
import * as __fd_glob_4 from "../content/news/joii-nano-banana-pro.mdx?collection=docs"
import * as __fd_glob_3 from "../content/news/image-to-image-tech.mdx?collection=docs"
import * as __fd_glob_2 from "../content/news/how-to-balance-ai-ecommerce-effect-with-cost.mdx?collection=docs"
import * as __fd_glob_1 from "../content/news/hello.mdx?collection=docs"
import * as __fd_glob_0 from "../content/news/ecommerce-guide.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/news", {}, {"ecommerce-guide.mdx": __fd_glob_0, "hello.mdx": __fd_glob_1, "how-to-balance-ai-ecommerce-effect-with-cost.mdx": __fd_glob_2, "image-to-image-tech.mdx": __fd_glob_3, "joii-nano-banana-pro.mdx": __fd_glob_4, });