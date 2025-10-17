import { cn } from "@/lib/utils";

export const BallIcon = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
    className={cn("w-full h-full", className)}
    {...props}
  >
    <defs>
      <radialGradient id="ballGradient" cx="0.3" cy="0.3" r="0.7">
        <stop offset="0%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 1 }} />
        <stop offset="20%" style={{ stopColor: "hsl(var(--accent))", stopOpacity: 0.9 }} />
        <stop offset="100%" style={{ stopColor: "hsl(var(--accent-foreground))", stopOpacity: 0.8 }} />
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="45" fill="url(#ballGradient)" />
  </svg>
);
