import React from "react";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/constants";
import { Link } from "react-router-dom";
import useTheme from "../../context/ThemeContext";
import { Sun,Moon } from "lucide-react";


function Navigation() {
  const {theme,toggleTheme}=useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight flex items-center gap-1">
          <span className="text-primary">Chit</span>
          <span className="text-muted-foreground">Chat</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-md font-bold">
          {navigationItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="transition-colors hover:text-primary text-muted-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="lg" className="hidden md:inline-flex">
            Sign in
          </Button>
          {/* Theme Changer Button */}
          <Button variant="outline" className="rounded-full p-2" onClick={toggleTheme}>
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Navigation;
