/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (
      config,
      { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
      ) => {
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      });

      config.externals.push({
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil"
      });
  
      return config;
    },
    images: {
      domains: [
        "uploadthing.com",
        "utfs.io"
      ]
    }
  }
  
  module.exports = nextConfig