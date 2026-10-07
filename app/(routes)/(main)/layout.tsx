import Footer from '@/components/materials/footer/Footer';
import Header from '@/components/materials/header/header';
import GoTop from '@/components/templates/goTop/GoTop';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-5 md:pt-36 min-h-[calc(100dvh-170px)]">{children}</main>
      <GoTop />
      <Footer />
    </>
  );
}
