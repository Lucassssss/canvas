/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
    //   reactStrictMode: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    // trailingSlash: true,
    // turbopack: {
    //     root: path.resolve(process.cwd(), '../../'),
    // },
}

export default nextConfig
