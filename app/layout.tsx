import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Header from "@/components/materials/header/header";
import GoTop from "@/components/templates/goTop/GoTop";
import Footer from "@/components/materials/footer/Footer";

const ralewaySans = Raleway({
  variable: "--font-raleway-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${ralewaySans.variable}  antialiased`}>
        <Header />
        <main>
        {children}
        </main>
        <GoTop />
        <Footer />
      </body>
    </html>
  );
}
