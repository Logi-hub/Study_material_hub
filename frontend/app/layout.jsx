import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import {Roboto} from 'next/font/google';

const roboto = Roboto({
  subsets:['latin'],
  weight:['400','500','700'],
});

export const metadata = {
  title: 'Study Material Hub',
  description: 'Upload and access educational materials.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-violet-100 to-indigo-100">
        <Header />
        <main className="flex-grow p-4">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
