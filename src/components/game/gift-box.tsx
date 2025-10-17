import { cn } from "@/lib/utils";
import { BallIcon } from "./ball-icon";

interface GiftBoxProps {
  hasBall: boolean;
  isRevealed: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export const GiftBox = ({ hasBall, isRevealed, isSelected, isDisabled, onClick }: GiftBoxProps) => {
  return (
    <div
      onClick={isDisabled ? undefined : onClick}
      className={cn(
        "relative w-28 h-28 sm:w-32 md:w-40 sm:h-32 md:h-40 cursor-pointer group transition-transform duration-300",
        !isDisabled && "hover:-translate-y-2",
        isSelected && !isRevealed && "scale-110",
        isRevealed && !isSelected && "opacity-60 saturate-50"
      )}
      aria-disabled={isDisabled}
    >
      <div className="absolute inset-0 w-full h-full">
        {isRevealed && hasBall && (
          <div className="absolute bottom-[12%] left-[25%] w-1/2 h-1/2 animate-bounce-in z-10">
            <BallIcon />
          </div>
        )}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <g className={cn("transition-transform duration-500 ease-in-out", isRevealed && "-translate-y-12 sm:-translate-y-16 rotate-[-15deg] scale-110")}>
            {/* Lid */}
            <path d="M10 25 L50 10 L90 25 L50 40 Z" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            <path d="M10 25 L10 45 L50 60 L50 40 Z" fill="hsl(var(--primary) / 0.8)" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            <path d="M90 25 L90 45 L50 60 L50 40 Z" fill="hsl(var(--primary) / 0.7)" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            {/* Ribbon */}
            <path d="M48 11 L48 60 M52 11 L52 60" stroke="hsl(var(--accent))" strokeWidth="3" />
            <path d="M8 35 Q50 45, 92 35" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" />
          </g>
          {/* Box Base */}
          <g>
            <path d="M15 48 L15 88 L50 100 L50 60 Z" fill="hsl(var(--primary) / 0.7)" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            <path d="M85 48 L85 88 L50 100 L50 60 Z" fill="hsl(var(--primary) / 0.6)" stroke="hsl(var(--primary-foreground))" strokeWidth="1"/>
            <path d="M15 48 L50 60 L85 48 L50 36 Z" fill="hsl(var(--primary))" className={cn(isRevealed ? "opacity-30" : "opacity-100", "transition-opacity duration-300")}/>
          </g>
        </svg>
      </div>
    </div>
  );
};

    