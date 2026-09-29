import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import './globals.css';

const ralewaySans = Raleway({
  variable: '--font-raleway-sans',
  subsets: ['latin'],
});

export async function generateMetadata() {
  const metaTitle = 'Alireza Jalili Portfolio';
  const metadata: Metadata = {
    title: metaTitle,
    description: 'Alireza is Frontend developer',
    authors: [{ name: 'Alirza Jalili' }],
    keywords: ['nextjs', 'react', 'portfolio', 'frontend'],
    openGraph: {
      title: metaTitle,
      description: 'Alireza is Frontend developer',
      url: 'alireza-jalili.ir',
      type: 'website',
    },
    twitter: {
      title: metaTitle,
      description: 'Alireza is Frontend developer',
      site: 'alireza-jalili.ir',
    },

    other: {
      'app-version': 'v0.1.2',
    },
  };

  return metadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ralewaySans.variable}  antialiased`}>{children}</body>
    </html>
  );
}
