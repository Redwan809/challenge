import Game from './game';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from '@/components/ui/sidebar';
import { HomeIcon, Puzzle } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <h2 className="text-xl font-bold">Menu</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Puzzle />
                Games
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex min-h-screen w-full flex-col items-center justify-center p-4 sm:p-8 relative">
          <div className="absolute top-4 left-4">
            <SidebarTrigger />
          </div>
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
      </SidebarInset>
    </>
  );
}
