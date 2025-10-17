import { Wallet } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-40 p-4 flex justify-end">
      <Card className="p-2 rounded-full shadow-lg">
        <div className="flex items-center gap-2 px-3">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="font-bold text-lg">$1,234</span>
        </div>
      </Card>
    </header>
  );
}
