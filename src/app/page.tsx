import Game from './game';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold text-primary">
          Mystery Box Challenge
        </h1>
        <p className="mt-2 text-lg text-foreground/80">
          Find the ball and test your luck!
        </p>
      </div>
      <Game />
    </main>
  );
}
