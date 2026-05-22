// ═══════════════════════════════════════════════════════════════════════════
// DADAC — Sistema de sonidos sintéticos (Web Audio API)
// Sin archivos externos: todos los sonidos se generan en tiempo real
// ═══════════════════════════════════════════════════════════════════════════

let audioCtx = null
let muted = false

function getCtx() {
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (e) {
      console.warn('Web Audio API no soportada')
    }
  }
  return audioCtx
}

export function setMuted(m) {
  muted = m
}

export function isMuted() {
  return muted
}

// ─── HELPER GENÉRICO ───────────────────────────────────────────────────────
function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {
    // silencio si falla
  }
}

function playSweep(startFreq, endFreq, duration, type = 'sine', volume = 0.15) {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration)
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch (e) {}
}

// ─── EFECTOS DE SONIDO ─────────────────────────────────────────────────────
export const sfx = {
  correct: () => {
    playTone(523, 0.1, 'square', 0.1)
    setTimeout(() => playTone(784, 0.15, 'square', 0.1), 80)
  },
  wrong: () => {
    playSweep(220, 80, 0.3, 'sawtooth', 0.12)
  },
  hit: () => {
    playSweep(800, 100, 0.15, 'square', 0.15)
  },
  enemyDeath: () => {
    playSweep(400, 50, 0.5, 'sawtooth', 0.18)
    setTimeout(() => playTone(150, 0.2, 'triangle', 0.1), 250)
  },
  powerUp: () => {
    playTone(440, 0.08, 'sine', 0.12)
    setTimeout(() => playTone(660, 0.08, 'sine', 0.12), 80)
    setTimeout(() => playTone(880, 0.15, 'sine', 0.12), 160)
  },
  click: () => {
    playTone(1000, 0.05, 'square', 0.06)
  },
  tick: () => {
    playTone(880, 0.04, 'square', 0.05)
  },
  combo: () => {
    playTone(659, 0.08, 'square', 0.1)
    setTimeout(() => playTone(880, 0.08, 'square', 0.1), 60)
    setTimeout(() => playTone(1175, 0.12, 'square', 0.1), 120)
  },
  trinity: () => {
    playTone(523, 0.15, 'sine', 0.1)
    setTimeout(() => playTone(659, 0.15, 'sine', 0.1), 100)
    setTimeout(() => playTone(784, 0.15, 'sine', 0.1), 200)
    setTimeout(() => playTone(1047, 0.3, 'sine', 0.12), 300)
  },
  victory: () => {
    const notes = [523, 659, 784, 1047, 1319]
    notes.forEach((n, i) => {
      setTimeout(() => playTone(n, 0.2, 'sine', 0.12), i * 150)
    })
  },
  gameover: () => {
    playSweep(440, 110, 1, 'sawtooth', 0.15)
  },
}

// Inicializa el contexto al primer click (requerido por navegadores)
export function initAudio() {
  const ctx = getCtx()
  if (ctx && ctx.state === 'suspended') {
    ctx.resume()
  }
}
