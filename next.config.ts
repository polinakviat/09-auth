import type { NextConfig } from 'next';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global', // 👈 Додайте або виправте цей рядок
      },
    ],
  },
};

export default nextConfig;