import Footer from '@/components/materials/footer/Footer';
import Header from '@/components/materials/header/header';
import GoTop from '@/components/templates/goTop/GoTop';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-5 sm:pt-36 ">{children}</main>
      <GoTop />
      <Footer />
    </>
  );
}
