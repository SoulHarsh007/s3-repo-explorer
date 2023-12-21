import type {Metadata} from 'next';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import {Analytics} from '@vercel/analytics/react';
import {Inter} from 'next/font/google';

import './globals.css';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  applicationName: "SoulHarsh007' S3 Repository Explorer",
  authors: [
    {
      name: 'SoulHarsh007',
      url: 'https://github.com/SoulHarsh007',
    },
  ],
  creator: 'SoulHarsh007',
  description:
    'Explore S3 buckets used as package repositories for RebornOS and CachyOS (Linux distributions), Hosted with 💖 by SoulHarsh007',
  keywords: [
    "SoulHarsh007' S3 Repository Explorer",
    'S3 Repository Explorer',
    'RebornOS Repository Explorer',
    'CachyOS Repository Explorer',
  ],
  metadataBase: new URL('https://repo.soulharsh007.dev'),
  openGraph: {
    description:
      'Explore S3 buckets used as package repositories for RebornOS and CachyOS (Linux distributions), Hosted with 💖 by SoulHarsh007',
    emails: 'admin@soulharsh007.dev',
    locale: 'en_US',
    siteName: "SoulHarsh007' S3 Repository Explorer",
    title: "SoulHarsh007' S3 Repository Explorer",
    type: 'website',
    url: 'https://repo.soulharsh007.dev',
  },
  robots: 'index, follow',
  title: "SoulHarsh007' S3 Repository Explorer",
  twitter: {
    card: 'summary_large_image',
    description:
      'Explore S3 buckets used as package repositories for RebornOS and CachyOS (Linux distributions), Hosted with 💖 by SoulHarsh007',
    title: "SoulHarsh007' S3 Repository Explorer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full" lang="en">
      <body className={inter.className + ' h-full'}>
        <div className="flex w-full justify-center min-h-full h-full p-4">
          <div className="flex flex-col w-full h-full justify-between gap-y-2">
            <Header />
            <div className="flex-auto">{children}</div>
            <Footer />
          </div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
