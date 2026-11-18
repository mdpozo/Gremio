import { useState } from 'react';
import { Award, Plus, Sparkles, Gift, Check, Trash2 } from 'lucide-react';
import { Drawer } from 'vaul';
import { useQuestContext } from '../context/QuestContext';
import { RewardItem } from '../types/quest';

export function ShopView() {
  const { player, shopItems, customRewards, buyShopItem, addCustomReward, deleteCustomReward, redeemCustomReward } = useQuestContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [rewardName, setRewardName] = useState('');
  const [rewardDesc, setRewardDesc] = useState('');
  const [rewardCost, setRewardCost] = useState(500);

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rewardName.trim()) return;

    addCustomReward({
      name: rewardName.trim(),
      description: rewardDesc.trim() || 'Recompensa personal.',
      cost: Number(rewardCost),
    });

    setRewardName('');
    setRewardDesc('');
    setRewardCost(500);
    setModalOpen(false);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-gradient-to-b from-[#0f0f0f] via-[#121218] to-[#0f0f0f]">
      {/* ── BALANCE DE PUNTOS DE RENDIMIENTO ── */}
      <div className="bg-[#16161c]/90 p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-lg backdrop-blur-md">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">Puntos de Actividad Acumulados</span>
          <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2 mt-0.5">
            <Award className="w-6 h-6 text-amber-400" />
            <span>{player.gold} <span className="text-xs font-semibold text-gray-400">pts</span></span>
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Canjea tus puntos ganados entrenando en recompensas personales.
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-xl text-amber-400">
          🎯
        </div>
      </div>

      {/* ── SECCIÓN 1: HITOS Y PREMIOS FÍSICOS (Si existen) ── */}
      {shopItems.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-2.5 flex items-center gap-2">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Hitos y Premios Físicos</span>
          </h3>

          <div className="flex flex-col gap-2.5">
            {shopItems.map((item: RewardItem) => {
              const canAfford = player.gold >= item.cost;
              return (
                <div
                  key={item.id}
                  className="bg-[#16161c]/75 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 shadow-sm hover:border-white/20 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0f0f0f] border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.description}</p>
                    </div>
                  </div>

                  {item.purchased ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/25 flex-shrink-0">
                      <Check className="w-3 h-3" />
                      Canjeado
                    </span>
                  ) : (
                    <button
                      onClick={() => buyShopItem(item)}
                      disabled={!canAfford}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex-shrink-0 ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                          : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.cost} pts</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── SECCIÓN 2: TUS AUTORECOMPENSAS PERSONALES ── */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tus Autorecompensas</span>
          </h3>

          <Drawer.Root open={modalOpen} onOpenChange={setModalOpen}>
            <Drawer.Trigger asChild>
              <button className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold transition-colors">
                <Plus className="w-3 h-3" />
                <span>Crear Autorecompensa</span>
              </button>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/75 backdrop-blur-md z-50" />
              <Drawer.Content className="bg-[#0f0f0f] border-t border-white/10 text-gray-200 flex flex-col rounded-t-[2rem] max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 shadow-2xl">
                <div className="p-6 overflow-y-auto pb-8">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/15 mb-6" />

                  <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <span>Nueva Autorecompensa</span>
                  </h3>
                  <p className="text-xs text-gray-400 mb-4">
                    Premia tu constancia física con descansos o gustos que disfrutes.
                  </p>

                  <form onSubmit={handleCreateCustom} className="flex flex-col gap-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Nombre</label>
                      <input
                        type="text"
                        placeholder="ej: Tarde de cine / Comida libre"
                        value={rewardName}
                        onChange={(e) => setRewardName(e.target.value)}
                        required
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Descripción</label>
                      <input
                        type="text"
                        placeholder="ej: Canjear el fin de semana tras cumplir los entrenos"
                        value={rewardDesc}
                        onChange={(e) => setRewardDesc(e.target.value)}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Coste en Puntos</label>
                      <input
                        type="number"
                        min={50}
                        step={50}
                        value={rewardCost}
                        onChange={(e) => setRewardCost(Number(e.target.value))}
                        className="w-full bg-[#18181b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-3 rounded-xl shadow-sm active:scale-95 transition-all text-sm"
                    >
                      Guardar Recompensa
                    </button>
                  </form>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {customRewards.length === 0 ? (
          <div className="p-6 bg-[#16161c]/80 border border-white/10 rounded-2xl text-center flex flex-col items-center gap-2.5 shadow-md">
            <span className="text-3xl">🎯</span>
            <h4 className="text-sm font-bold text-white">Sin autorecompensas todavía</h4>
            <p className="text-xs text-gray-400 max-w-[260px] mx-auto leading-relaxed">
              Define tus propios premios personales (una comida libre, un descanso o un capricho) canjeables con tus puntos de actividad física.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-1 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Mi Primera Recompensa</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {customRewards.map((reward) => {
              const canAfford = player.gold >= reward.cost;
              return (
                <div
                  key={reward.id}
                  className="bg-[#16161c]/75 backdrop-blur-sm p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{reward.name}</h4>
                      <p className="text-[11px] text-gray-400">{reward.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => redeemCustomReward(reward.id)}
                      disabled={!canAfford}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                        canAfford
                          ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-sm'
                          : 'bg-white/5 text-gray-500 border border-white/5 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{reward.cost} pts</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`¿Eliminar "${reward.name}" de tus autorecompensas?`)) {
                          deleteCustomReward(reward.id);
                        }
                      }}
                      title="Eliminar autorecompensa"
                      className="p-1.5 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 border border-white/5 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
