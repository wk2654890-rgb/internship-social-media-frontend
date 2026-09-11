import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Home, Compass, LogOut, User, Settings } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>EXPS <span className="text-primary">Nexus</span></span>
        </Link>

        <nav className="flex items-center gap-1">
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/" className="flex items-center gap-1.5">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/users" className="flex items-center gap-1.5">
                  <Compass className="h-4 w-4" />
                  <span className="hidden sm:inline">Discover</span>
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none">
                    <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20 hover:ring-primary/50 transition-all">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                    Signed in as <span className="font-semibold text-foreground">@{user.username}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user.id}`} className="flex items-center gap-2 w-full">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
