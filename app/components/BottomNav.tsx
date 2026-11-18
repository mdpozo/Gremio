import { Home, Dumbbell, Gift, User } from 'lucide-react';
import { useQuestContext } from '../context/QuestContext';

export function BottomNav() {
  const { activeTab, setActiveTab } = useQuestContext();

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'quests', icon: Dumbbell, label: 'Entrenos' },
    { id: 'inventory', icon: Gift, label: 'Premios' },
    { id: 'profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="flex-shrink-0 w-full bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] z-40">
      <div className="flex items-center justify-around px-2 py-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 active:scale-95 ${
                isActive ? 'text-amber-400 scale-105' : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <div
                className={`relative p-1.5 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-amber-400/15 shadow-[0_0_12px_rgba(245,158,11,0.25)]' : 'hover:bg-white/5'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
                )}
              </div>
              <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold text-amber-400' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
