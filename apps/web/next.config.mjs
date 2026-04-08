import { createMDX } from 'fumadocs-mdx/next';
import path from 'path';

/** @type {import('next').NextConfig} */
const config = {
//   reactStrictMode: true,
  output: 'export',
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
    turbopack: {
        root: path.resolve(process.cwd(), '../../'),
    },
};
const withMDX = createMDX({
  // customise the config file path
  configPath: "source.config.ts"
});
export default withMDX(config);


// import type { NextConfig } from 'next'
// import path from 'path'

// const nextConfig: NextConfig = {
//   output: 'export',
//   images: {
//     unoptimized: true,
//   },
//   trailingSlash: true,
//   turbopack: {
//     root: path.resolve(__dirname, '../../'),
//   },
// }

// export default nextConfig
