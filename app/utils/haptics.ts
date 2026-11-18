import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Haptic feedback utility supporting both Capacitor Native Android vibration
 * and web browser navigator.vibrate fallback.
 */
export async function triggerHaptic(
  pattern: 'light' | 'medium' | 'heavy' | 'success' | 'levelUp' = 'light'
) {
  try {
    switch (pattern) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'levelUp':
        await Haptics.vibrate({ duration: 350 });
        break;
    }
  } catch {
    // Fallback nativo web estándar
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (pattern) {
          case 'light':
            navigator.vibrate(25);
            break;
          case 'medium':
            navigator.vibrate(50);
            break;
          case 'heavy':
            navigator.vibrate(90);
            break;
          case 'success':
            navigator.vibrate([40, 50, 40]);
            break;
          case 'levelUp':
            navigator.vibrate([60, 80, 60, 80, 150]);
            break;
        }
      } catch {
        // Ignorar si el navegador bloquea la vibración
      }
    }
  }
}

