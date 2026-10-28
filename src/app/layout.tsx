import type { Metadata, Viewport } from 'next';
import { Outfit, Space_Grotesk } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#070b14',
};

export const metadata: Metadata = {
  title: 'DPSI Tech & Innovation Exhibition | 3D Floor Plan & Live Voting',
  description:
    'Interactive 3D Virtual Floor Plan matching the physical blueprint: Physical (P01-12), Digital (D01-12), Business (B01-07), and Robotics Arenas for DPS Indirapuram.',
  icons: {
    icon: '/dpsi_crest.png',
    apple: '/dpsi_crest.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} h-full dark antialiased`}
    >
      <body className="h-full w-full overflow-hidden bg-[#070b14] text-[#f1f5f9] font-sans select-none touch-manipulation">
        {children}
      </body>
    </html>
  );
}
