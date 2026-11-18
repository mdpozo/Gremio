/**
 * Voice Coach (Entrenador Virtual con Text-To-Speech)
 * Módulo multimedia de accesibilidad y locución deportiva (PMDM)
 */

class VoiceCoach {
  private enabled: boolean = true;
  private synth: SpeechSynthesis | null = null;
  private spanishVoice: SpeechSynthesisVoice | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth) {
        if ('onvoiceschanged' in this.synth) {
          this.synth.onvoiceschanged = () => this.initVoices();
        }
      }

      // Cargar preferencia guardada en localStorage
      try {
        const saved = localStorage.getItem('questfit_voice_coach');
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      } catch {
        // Fallback
      }
    }
  }

  public initVoices() {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      if (!voices || voices.length === 0) return;

      // 1º Prioridad: Español de España (es-ES)
      // 2º Prioridad: Cualquier variante en español (es-MX, es-US, es-*)
      // 3º Prioridad: Voz por defecto si no hay español específico
      this.spanishVoice =
        voices.find((v) => v.lang === 'es-ES' || v.lang === 'es_ES') ||
        voices.find((v) => v.lang.toLowerCase().startsWith('es')) ||
        null;
    } catch {
      // Ignore
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    try {
      localStorage.setItem('questfit_voice_coach', String(enabled));
    } catch {
      // Ignore
    }
    if (!enabled && this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // Ignore
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public isSpeaking(): boolean {
    return this.activeUtterance !== null;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window && this.synth !== null;
  }

  public speak(text: string, rate: number = 1.05) {
    if (!this.enabled || !this.synth) return;

    try {
      // Descongelar síntesis de voz en Chrome/Chromium si está en pausa
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Cancelar mensajes anteriores para que no se acumulen
      this.synth.cancel();

      // Si aún no se habían cargado las voces del sistema, reintentar carga
      if (!this.spanishVoice) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.spanishVoice) {
        utterance.voice = this.spanishVoice;
      }
      utterance.lang = 'es-ES';
      utterance.rate = rate; // Ritmo dinámico ligeramente ágil
      utterance.pitch = 1.0;

      // Prevenir bug de Chrome donde el Garbage Collector destruye el utterance en silencio
      this.activeUtterance = utterance;
      utterance.onend = () => {
        this.activeUtterance = null;
      };
      utterance.onerror = () => {
        this.activeUtterance = null;
      };

      // Pequeño timeout para permitir que el cancel() de Chromium se resuelva limpiamente
      setTimeout(() => {
        if (this.synth && this.enabled) {
          if (this.synth.paused) {
            this.synth.resume();
          }
          this.synth.speak(utterance);
        }
      }, 30);
    } catch {
      // Fallback si la síntesis de voz está silenciada o restringida
    }
  }

  // Prueba explícita para comprobar audio
  public testVoice() {
    this.speak('¡Hola! Soy el entrenador por voz de QuestFit. El sistema de audio funciona perfectamente.');
  }

  // Frases contextuales de entrenamiento deportivo
  public announceStart(workoutTitle: string) {
    this.speak(`¡Iniciamos ${workoutTitle}! Dale con todo.`);
  }

  public announceSetComplete(setNum: number, restSecs: number) {
    this.speak(`¡Serie ${setNum} completada! Tienes ${restSecs} segundos de descanso.`);
  }

  public announceCountdown() {
    this.speak('Tres, dos, uno, ¡vamos!');
  }

  public announceDistance(kms: number) {
    this.speak(`¡${kms} kilómetros completados! Excelente ritmo.`);
  }

  public announceFinish(amount: number, unit: string) {
    this.speak(`¡Entrenamiento finalizado! Has sumado ${amount} ${unit}. ¡Gran trabajo!`);
  }

  public announceLevelUp(level: number) {
    this.speak(`¡Enhorabuena! Has ascendido al nivel ${level}.`);
  }
}

export const voiceCoach = new VoiceCoach();
