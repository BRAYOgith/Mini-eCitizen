import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'eCitizen Kenya | Public Service Request System',
  description: 'Official digital gateway to Government of Kenya public services. Apply for DCI Good Conduct, NTSA Driving License, BRS Business Registration, and track requests online.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
