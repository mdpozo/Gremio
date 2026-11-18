import { useState } from 'react';
import { Toaster } from 'sonner';
import { QuestProvider, useQuestContext } from './context/QuestContext';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './views/HomeView';
import { QuestsView } from './views/QuestsView';
import { ShopView } from './views/ShopView';
import { ProfileView } from './views/ProfileView';
import { SplashScreen } from './components/SplashScreen';
import { DesignPlayground } from './components/DesignPlayground';

const SHOW_PLAYGROUND = false;

function MainContent() {
  const { activeTab } = useQuestContext();
  const [showSplash, setShowSplash] = useState(true);

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'quests':
        return <QuestsView />;
      case 'inventory':
        return <ShopView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <QuestsView />;
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#09090c] flex justify-center items-center sm:p-4 selection:bg-amber-400 selection:text-slate-950" style={{ backgroundImage: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #09090c 75%)' }}>
      <div className="chassis-container w-full h-[100dvh] sm:max-w-md sm:h-[92vh] sm:rounded-[2.5rem] sm:border sm:border-white/10 bg-[#0f0f0f] text-gray-200 font-sans transition-colors duration-500 relative overflow-hidden flex flex-col shadow-[0_10px_60px_rgba(0,0,0,0.9)]">
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

        {SHOW_PLAYGROUND ? (
          <DesignPlayground />
        ) : (
          <>
            <div className="flex-1 flex flex-col overflow-hidden">{renderView()}</div>
            <BottomNav />
          </>
        )}
      </div>
      <Toaster position="top-center" theme="system" richColors />
    </div>
  );
}

export default function App() {
  return (
    <QuestProvider>
      <MainContent />
    </QuestProvider>
  );
}