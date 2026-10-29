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
    icon: '/dps_shield.png',
    apple: '/dps_shield.png',
  },
};

import AmbientBackground from '@/components/ui/AmbientBackground';
import CustomCursor from '@/components/ui/CustomCursor';
import ThemeInitializer from '@/components/ui/ThemeInitializer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('dpsi-expo-theme');
                if (t === 'light') {
                  document.documentElement.classList.add('light');
                  document.documentElement.classList.remove('dark');
                  document.documentElement.setAttribute('data-theme', 'light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen w-full bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#2ea043] selection:text-black relative transition-colors duration-300">
        <ThemeInitializer />
        {/* [ ELEMENT 04 ] :: REFRACTIVE GLASS AERO-SHARDS SIMULATION in the background of all pages */}
        <AmbientBackground />

        {/* Dynamic BlobCursor liquid chrome pointer element that renders behind text */}
        <CustomCursor />

        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
