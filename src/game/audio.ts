type SoundName =
  | 'click'
  | 'type'
  | 'alarm'
  | 'success'
  | 'error'
  | 'unlock'
  | 'digit'
  | 'tick'
  | 'win'
  | 'whoosh'

let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioCtor) return null
  if (!context) context = new AudioCtor()
  if (context.state === 'suspended') void context.resume()
  return context
}

function tone(
  frequency: number,
  duration: number,
  options: { type?: OscillatorType; volume?: number; delay?: number; slideTo?: number } = {},
) {
  const ctx = getContext()
  if (!ctx) return
  const { type = 'sine', volume = 0.06, delay = 0, slideTo } = options
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  const start = ctx.currentTime + delay
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), start + duration)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.03)
}

export function playSound(name: SoundName) {
  switch (name) {
    case 'click':
      tone(520, 0.06, { type: 'square', volume: 0.025 })
      break
    case 'type':
      tone(880, 0.03, { type: 'square', volume: 0.012 })
      break
    case 'tick':
      tone(1040, 0.035, { type: 'sine', volume: 0.02 })
      break
    case 'alarm':
      tone(480, 0.32, { type: 'sawtooth', volume: 0.045, slideTo: 760 })
      tone(480, 0.32, { type: 'sawtooth', volume: 0.045, delay: 0.4, slideTo: 760 })
      break
    case 'success':
      ;[523, 659, 784, 1046].forEach((freq, i) =>
        tone(freq, 0.22, { type: 'triangle', volume: 0.055, delay: i * 0.09 }),
      )
      break
    case 'error':
      tone(220, 0.18, { type: 'sawtooth', volume: 0.04, slideTo: 130 })
      tone(180, 0.22, { type: 'sawtooth', volume: 0.035, delay: 0.12, slideTo: 100 })
      break
    case 'unlock':
      tone(420, 0.18, { type: 'square', volume: 0.03, slideTo: 840 })
      tone(840, 0.25, { type: 'triangle', volume: 0.04, delay: 0.16 })
      break
    case 'digit':
      tone(660, 0.08, { type: 'triangle', volume: 0.035 })
      break
    case 'whoosh':
      tone(900, 0.28, { type: 'sine', volume: 0.03, slideTo: 220 })
      break
    case 'win':
      ;[392, 523, 659, 784, 1046, 1318].forEach((freq, i) =>
        tone(freq, 0.4, { type: 'triangle', volume: 0.055, delay: i * 0.12 }),
      )
      tone(1568, 0.8, { type: 'sine', volume: 0.04, delay: 0.8 })
      break
  }
}

export function playIf(enabled: boolean, name: SoundName) {
  if (enabled) playSound(name)
}
