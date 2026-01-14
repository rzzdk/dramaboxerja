import { Outlet } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Search, FlameKindling } from "lucide-react";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-2 group" activeClassName="text-primary">
            <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/40 group-hover:border-primary transition-colors">
              <FlameKindling className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide uppercase">DramaBox</span>
              <span className="text-[11px] text-muted-foreground">Streaming Drama Sub Indo</span>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Beranda
            </NavLink>
            <NavLink
              to="/sub-indo"
              className="text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground"
            >
              Sub Indo
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Button asChild variant="secondary" size="sm" className="hidden sm:inline-flex">
              <NavLink to="/search">
                <Search className="mr-2 h-4 w-4" />
                Cari Drama
              </NavLink>
            </Button>
            <Button asChild variant="ghost" size="icon" className="sm:hidden" aria-label="Cari drama">
              <NavLink to="/search">
                <Search className="h-4 w-4" />
              </NavLink>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-background via-background/95 to-background/90">
        <Outlet />
      </main>

      <footer className="border-t border-border/70 bg-background/80">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 py-4 text-xs text-muted-foreground">
          <span>
            9 {new Date().getFullYear()} DramaBox. Dibangun dengan React & TanStack Query.
          </span>
          <span className="inline-flex items-center gap-1">
            Data oleh <span className="font-medium">dramabox.sansekai.my.id</span>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
