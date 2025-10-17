"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, Landmark, Puzzle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Game', icon: <Puzzle className="w-5 h-5" /> },
    { href: '/bank', label: 'Bank', icon: <Landmark className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-card border-t border-border">
      <div className="grid h-full max-w-lg grid-cols-2 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                if (item.href === pathname && item.href === '/') {
                  e.preventDefault();
                  // Instead of navigating, we might want to trigger a state change in the page component.
                  // For now, we'll just prevent the navigation to allow the internal page state to handle it.
                  // A better solution would involve a shared state (e.g., via Context or Zustand).
                  // Or, force a reload, which is simple but less elegant:
                  window.location.href = '/';
                }
              }}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted/50 group",
                isActive ? "text-primary" : "text-foreground/60"
              )}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
