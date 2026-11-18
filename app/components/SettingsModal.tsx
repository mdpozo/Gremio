import { useState } from 'react';
import { Settings, Palette, Volume2, VolumeX, Smartphone, RotateCcw, Sparkles, Check, Moon, Sun, Leaf, Shield, Info, Mic, MicOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { useTheme, Theme } from './ThemeProvider';
import { useQuestContext } from '../context/QuestContext';
import { sounds } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { voiceCoach } from '../utils/voiceCoach';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme } = useTheme();
  const { resetAllData, loadSampleData } = useQuestContext();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(voiceCoach.isEnabled());

  const themes: { id: Theme; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { id: 'obsidian', label: 'Obsidiana', desc: 'Oscuro con acentos dorados', icon: <Moon className="w-4 h-4" />, color: 'bg-zinc-900 border-amber-400/40' },
    { id: 'parchment', label: 'Pergamino', desc: 'Tonos cálidos y limpios', icon: <Sun className="w-4 h-4" />, color: 'bg-[#faf6ee] text-slate-900 border-amber-600/40' },
    { id: 'forest', label: 'Bosque', desc: 'Esmeralda y naturaleza', icon: <Leaf className="w-4 h-4" />, color: 'bg-emerald-950 border-emerald-500/40' },
    { id: 'valyrian', label: 'Acero Valyrio', desc: 'Gris metálico y cobalto', icon: <Shield className="w-4 h-4" />, color: 'bg-slate-900 border-sky-500/40' },
  ];

  const handleSelectTheme = (tId: Theme) => {
    setTheme(tId);
    if (soundEnabled) sounds.playClick();
    if (hapticsEnabled) triggerHaptic('light');
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) sounds.playClick();
  };

  const handleToggleHaptics = () => {
    const next = !hapticsEnabled;
    setHapticsEnabled(next);
    if (next) triggerHaptic('medium');
  };

  const handleToggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    voiceCoach.setEnabled(next);
    if (next) {
      voiceCoach.speak('Voz del entrenador activada. ¡Listo para entrenar!');
      if (hapticsEnabled) triggerHaptic('light');
    }
  };

  const handleLoadDemo = () => {
    if (window.confirm('¿Cargar datos de entrenamiento de demostración para pruebas?')) {
      loadSampleData();
      onClose();
    }
  };

  const handleResetZero = () => {
    if (window.confirm('¿Estás seguro de restablecer todos los datos a cero? Se borrarán las rutinas y el progreso acumulado.')) {
      resetAllData();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-[#0f0f13] border-white/10 text-white rounded-3xl p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabecera */}
        <DialogHeader className="pb-3 border-b border-white/10 flex-shrink-0 pr-8">
          <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Ajustes de QuestFit</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Personaliza la apariencia, sonidos y datos de la aplicación.
          </DialogDescription>
        </DialogHeader>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-5 pr-1">
          {/* ── SECCIÓN 1: TEMAS VISUALES ── */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Tema Visual de la Interfaz
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {themes.map((t) => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTheme(t.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      isActive
                        ? 'border-amber-400 bg-amber-400/10 shadow-sm shadow-amber-400/10 scale-[1.02]'
                        : 'border-white/10 bg-[#16161c]/80 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg border border-white/10 ${t.color}`}>
                        {t.icon}
                      </div>
                      {isActive && (
                        <div className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-black">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">{t.label}</span>
                      <span className="text-[10px] text-gray-400 line-clamp-1">{t.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── SECCIÓN 2: MULTIMEDIA Y SENSORIAL ── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2.5">
              Feedback Sensorial (PMDM)
            </h3>

            <div className="bg-[#16161c] rounded-2xl border border-white/10 divide-y divide-white/5">
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Efectos de Audio</span>
                    <span className="text-[10px] text-gray-400">Sonidos de cronómetro, series y subida de nivel</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    soundEnabled ? 'bg-amber-400' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-sky-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Vibración Háptica</span>
                    <span className="text-[10px] text-gray-400">Respuesta táctil al pulsar botones y completar series</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleHaptics}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    hapticsEnabled ? 'bg-amber-400' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                      hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="p-3.5 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                      {voiceEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Voz del Entrenador (TTS)</span>
                      <span className="text-[10px] text-gray-400">Locución por voz de series, descansos y distancias</span>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleVoice}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      voiceEnabled ? 'bg-amber-400' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                        voiceEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {voiceEnabled && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-[10px] text-gray-400">Prueba rápida del sintetizador de voz:</span>
                    <button
                      onClick={() => {
                        voiceCoach.testVoice();
                        if (hapticsEnabled) triggerHaptic('light');
                      }}
                      className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Escuchar Prueba</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SECCIÓN 3: GESTIÓN DE DATOS ── */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-2.5">
              Gestión de Datos
            </h3>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleLoadDemo}
                className="w-full py-2.5 px-3.5 bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 border border-amber-400/30 font-bold rounded-xl text-xs flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Cargar Datos de Demostración (Opcional)</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">Demo</span>
              </button>

              <button
                onClick={handleResetZero}
                className="w-full py-2.5 px-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold rounded-xl text-xs flex items-center justify-between active:scale-95 transition-all"
              >
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  <span>Restablecer Datos a Cero (Vaciar Todo)</span>
                </div>
                <span className="text-[10px] font-mono opacity-80">Reset</span>
              </button>
            </div>
          </div>

          {/* ── SECCIÓN 4: ACERCA DE LA APP ── */}
          <div className="bg-[#16161c]/50 p-3.5 rounded-2xl border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">QuestFit Mobile</span>
                <span className="text-[9px] font-mono bg-white/10 px-1.5 py-0.2 rounded text-gray-300">v1.0.0</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Proyecto Fin de Grado DAM — Desarrollado con React 19, TypeScript & Capacitor.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
