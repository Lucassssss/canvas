// source.config.ts
import { defineDocs, defineConfig } from "fumadocs-mdx/config";
var docs = defineDocs({
  dir: "content/news"
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  docs
};
