// @ts-nocheck
import * as __fd_glob_7 from "../content/news/series-a-funding.mdx?collection=docs"
import * as __fd_glob_6 from "../content/news/image-to-image-tech.mdx?collection=docs"
import * as __fd_glob_5 from "../content/news/image-to-image-tech copy.mdx?collection=docs"
import * as __fd_glob_4 from "../content/news/hello.mdx?collection=docs"
import * as __fd_glob_3 from "../content/news/hello copy.mdx?collection=docs"
import * as __fd_glob_2 from "../content/news/ecommerce-guide.mdx?collection=docs"
import * as __fd_glob_1 from "../content/news/222.mdx?collection=docs"
import * as __fd_glob_0 from "../content/news/222 copy.mdx?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/news", {}, {"222 copy.mdx": __fd_glob_0, "222.mdx": __fd_glob_1, "ecommerce-guide.mdx": __fd_glob_2, "hello copy.mdx": __fd_glob_3, "hello.mdx": __fd_glob_4, "image-to-image-tech copy.mdx": __fd_glob_5, "image-to-image-tech.mdx": __fd_glob_6, "series-a-funding.mdx": __fd_glob_7, });