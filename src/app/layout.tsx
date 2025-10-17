import type {Metadata} from 'next';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';
import { Header } from '@/components/header';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Mystery Box Challenge',
  description: 'Find the ball in the right box and win!',
};

export default function RootLayout({
  children,
  bodyClassName,
}: Readonly<{
  children: React.ReactNode;
  bodyClassName?: string;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", bodyClassName)}>
        <Header />
        <div id="main-content" className="h-screen overflow-y-auto pb-20">
          {children}
        </div>
        <BottomNav />
        <Toaster />
      </body>
    </html>
  );
}
