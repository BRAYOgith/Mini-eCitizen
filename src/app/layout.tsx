import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-lexend',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'eCitizen.go.ke - Government of Kenya services simplified',
  description: 'Government of Kenya online portal offers services from Ministries, Counties, Departments, and Agencies. Manage all your govt records in one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lexend.variable} font-lexend h-full`}>
      <body className="min-h-full bg-white text-gray-900 antialiased font-lexend">
        {children}
      </body>
    </html>
  );
}
