import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BankPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is the bank page. Deposit and withdrawal functionality will be here.</p>
        </CardContent>
      </Card>
    </main>
  );
}
