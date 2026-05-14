import { Moon, Sun, Leaf, Shield, Palette } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes: { id: Theme; label: string; icon: React.ReactNode }[] = [
    { id: "obsidian", label: "Obsidiana", icon: <Moon className="w-4 h-4" /> },
    { id: "parchment", label: "Pergamino", icon: <Sun className="w-4 h-4" /> },
    { id: "forest", label: "Bosque Profundo", icon: <Leaf className="w-4 h-4" /> },
    { id: "valyrian", label: "Acero Valyrio", icon: <Shield className="w-4 h-4" /> },
  ];

  const currentThemeLabel = themes.find((t) => t.id === theme)?.label || "Tema";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-quest-border bg-quest-bg/50 text-quest-text-main hover:bg-quest-border/80 hover:text-quest-accent transition-all duration-200 focus:outline-none shadow-sm">
          <Palette className="w-4 h-4 text-quest-accent" />
          <span className="text-xs font-bold text-quest-text-muted uppercase tracking-wider truncate max-w-[80px]">
            {currentThemeLabel}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px] bg-quest-bg border-quest-border">
        {themes.map((t) => (
          <DropdownMenuItem
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-3 cursor-pointer ${
              theme === t.id ? "bg-quest-border/50 text-quest-accent" : "text-quest-text-main hover:bg-quest-border/30 hover:text-quest-text-title"
            }`}
          >
            <div className={`p-1 rounded-md ${theme === t.id ? "bg-quest-accent text-quest-bg" : "bg-transparent text-current"}`}>
              {t.icon}
            </div>
            <span className="font-medium">{t.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
