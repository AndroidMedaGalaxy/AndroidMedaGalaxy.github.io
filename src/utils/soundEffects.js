// Cyberpunk 2077-inspired sound effects using Web Audio API

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.initialized = false;
    }

    // Initialize audio context (needs user interaction first)
    init() {
        if (!this.initialized) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        }
    }

    // Play a short cyberpunk-style notification beep
    // Inspired by Cyberpunk 2077's UI sounds - synthetic, techy, futuristic
    playCyberpunkNotification() {
        if (!this.initialized) this.init();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create oscillators for a layered synth sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();

        // Create gain nodes for volume control
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        const gain3 = ctx.createGain();
        const masterGain = ctx.createGain();

        // Configure oscillators for a cyberpunk tech sound
        // Layer 1: High frequency beep
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1200, now);
        osc1.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

        // Layer 2: Mid frequency for body
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(800, now);
        osc2.frequency.exponentialRampToValueAtTime(900, now + 0.05);

        // Layer 3: Low frequency for depth
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(400, now);
        osc3.frequency.exponentialRampToValueAtTime(450, now + 0.05);

        // Set up gain envelopes (ADSR-like)
        // High layer - short and crisp
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        // Mid layer - slightly longer
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.12, now + 0.015);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        // Low layer - subtle depth
        gain3.gain.setValueAtTime(0, now);
        gain3.gain.linearRampToValueAtTime(0.08, now + 0.02);
        gain3.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        // Master volume
        masterGain.gain.setValueAtTime(0.3, now); // Keep it subtle

        // Connect the audio graph
        osc1.connect(gain1);
        osc2.connect(gain2);
        osc3.connect(gain3);

        gain1.connect(masterGain);
        gain2.connect(masterGain);
        gain3.connect(masterGain);

        masterGain.connect(ctx.destination);

        // Start and stop
        const duration = 0.15;
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        osc3.stop(now + duration);
    }

    // Play AI response sound (slightly different tone)
    playAIResponse() {
        if (!this.initialized) this.init();

        const ctx = this.audioContext;
        const now = ctx.currentTime;

        // Create a two-tone notification
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        const masterGain = ctx.createGain();

        // First tone - higher pitch
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(1000, now);

        // Second tone - lower pitch (plays slightly after)
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(750, now + 0.06);

        // Envelope for first tone
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.2, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        // Envelope for second tone
        gain2.gain.setValueAtTime(0, now + 0.06);
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.07);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        // Master volume
        masterGain.gain.setValueAtTime(0.25, now);

        // Connect
        osc1.connect(gain1);
        osc2.connect(gain2);
        gain1.connect(masterGain);
        gain2.connect(masterGain);
        masterGain.connect(ctx.destination);

        // Play
        osc1.start(now);
        osc2.start(now + 0.06);
        osc1.stop(now + 0.1);
        osc2.stop(now + 0.16);
    }
}

// Export singleton instance
export const soundEffects = new SoundEffects();

