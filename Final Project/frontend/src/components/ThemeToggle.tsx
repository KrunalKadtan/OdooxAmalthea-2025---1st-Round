import { Button } from './ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({ variant = "outline", size = "sm" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="flex items-center gap-2 hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      {theme === 'light' ? (
        <>
          <Moon className="h-4 w-4 text-blue-600" />
          {size !== "icon" && <span className="font-medium">Dark</span>}
        </>
      ) : (
        <>
          <Sun className="h-4 w-4 text-amber-500" />
          {size !== "icon" && <span className="font-medium">Light</span>}
        </>
      )}
    </Button>
  );
}