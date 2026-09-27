/**
 * LIFE OS — Real Operating System Notification Service
 * Integrates with Web Notifications API & Service Worker to push real device notifications
 * (with audible iOS chime synthesized via Web Audio API).
 */

class RealNotificationService {
  private audioCtx: AudioContext | null = null;

  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      return perm;
    } catch (e) {
      console.warn('Failed to request notification permission', e);
      return 'denied';
    }
  }

  playChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // Two-tone Apple-like harmonic chime (F#5 to C#6)
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      const gain2 = this.audioCtx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(739.99, now); // F#5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1108.73, now + 0.08); // C#6
      gain2.gain.setValueAtTime(0.18, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + 0.5);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.65);
    } catch (e) {
      // Audio context might be restricted before interaction
    }
  }

  async sendRealNotification(
    title: string,
    options: {
      body: string;
      targetModule?: string;
      icon?: string;
      tag?: string;
      silentSound?: boolean;
    }
  ): Promise<boolean> {
    if (!this.isSupported()) return false;

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await this.requestPermission();
    }

    if (permission !== 'granted') {
      return false;
    }

    if (!options.silentSound) {
      this.playChime();
    }

    const notifOptions: NotificationOptions = {
      body: options.body,
      icon: options.icon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=128&q=80',
      badge: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=96&q=80',
      tag: options.tag || 'lifeos_' + Date.now(),
      data: {
        module: options.targetModule || 'dashboard',
        url: window.location.origin,
      },
    };

    // Try service worker registration first for background mobile lockscreen reliability
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg && reg.showNotification) {
          await reg.showNotification(title, notifOptions);
          return true;
        }
      } catch (e) {
        console.warn('SW notification fallback', e);
      }
    }

    // Standard Window Notification API
    try {
      const notif = new Notification(title, notifOptions);
      notif.onclick = () => {
        window.focus();
        if (options.targetModule) {
          window.dispatchEvent(
            new CustomEvent('lifeos_navigate', { detail: { module: options.targetModule } })
          );
        }
        notif.close();
      };
      return true;
    } catch (e) {
      console.warn('Native notification failed', e);
      return false;
    }
  }

  // Schedule a reminder after N seconds
  scheduleNotification(
    secondsFromNow: number,
    title: string,
    body: string,
    targetModule: string = 'dashboard'
  ) {
    setTimeout(() => {
      this.sendRealNotification(title, {
        body,
        targetModule,
      });
    }, secondsFromNow * 1000);
  }
}

export const NotificationService = new RealNotificationService();
