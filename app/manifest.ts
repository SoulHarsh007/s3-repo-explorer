import {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#fff',
    description:
      'Explore S3 buckets used as package repositories for RebornOS and CachyOS (Linux distributions), Hosted with 💖 by SoulHarsh007',
    display: 'standalone',
    icons: [
      {
        sizes: 'any',
        src: '/favicon.ico',
        type: 'image/x-icon',
      },
      {
        sizes: 'any',
        src: '/android-icon.png',
        type: 'image/png',
      },
      {
        sizes: 'any',
        src: '/apple-icon.png',
        type: 'image/png',
      },
    ],
    name: "SoulHarsh007's S3 Repository Explorer",
    short_name: 'S3 Repository Explorer',
    start_url: '/',
    theme_color: '#fff',
  };
}
