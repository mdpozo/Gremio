import { Home, Target, Sword, User } from 'lucide-react';

export function BottomNav() {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio', active: false },
    { id: 'quests', icon: Target, label: 'Misiones', active: true },
    { id: 'inventory', icon: Sword, label: 'Inventario', active: false },
    { id: 'profile', icon: User, label: 'Perfil', active: false },
  ];

  return (
    <nav className="flex-shrink-0 w-full bg-quest-card-from border-t border-quest-border-card shadow-[0_-4px_20px_rgba(0,0,0,0.3)] z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 ${
                item.active 
                  ? 'text-quest-accent scale-110' 
                  : 'text-quest-text-muted hover:text-quest-text-main'
              }`}
            >
              <div className={`relative p-1.5 rounded-full ${item.active ? 'bg-quest-accent/10' : ''}`}>
                <Icon className="w-6 h-6" />
                {item.active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-quest-accent shadow-[0_0_5px_var(--color-quest-accent)]" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${item.active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
