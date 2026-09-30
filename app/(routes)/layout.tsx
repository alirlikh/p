import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const ralewaySans = Raleway({
  variable: '--font-raleway-sans',
  subsets: ['latin'],
});

export async function generateMetadata(): Promise<Metadata> {
  const metaTitle = `${SITE_NAME} | Frontend Developer`;
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: metaTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    openGraph: {
      title: metaTitle,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      siteName: SITE_NAME,
      type: 'website',
      locale: 'en_US',
      images: [{ url: '/images/avatar.jpg', alt: SITE_NAME }],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: SITE_DESCRIPTION,
      images: ['/images/avatar.jpg'],
    },

    other: {
      'app-version': 'v0.1.2',
    },
  };

  const appEnvironment = process.env.APP_ENV ?? process.env.NODE_ENV;
  if (appEnvironment !== 'production') {
    metadata.robots = {
      follow: false,
      index: false,
    };
  }

  return metadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${ralewaySans.variable}  antialiased`}>{children}</body>
    </html>
  );
}
