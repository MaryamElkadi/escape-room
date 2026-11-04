import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Check,
  CircleAlert,
  Delete,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  UnlockKeyhole,
} from 'lucide-react'
import { FINAL_PASSWORD, MISSIONS } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'

export function LockScreen() {
  const { state, dispatch } = useGame()
  const [entry, setEntry] = useState<string[]>([])
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const allDone = state.missions.every((mission) => mission.completed)

  const press = (digit: string) => {
    if (entry.length >= 4 || unlocking) return
    setEntry((current) => [...current, digit])
    setError('')
    playIf(state.soundOn, 'tick')
  }

  const backspace = () => {
    setEntry((current) => current.slice(0, -1))
    setError('')
    playIf(state.soundOn, 'click')
  }

  const clear = () => {
    setEntry([])
    setError('')
    playIf(state.soundOn, 'click')
  }

  const submit = () => {
    if (entry.length !== 4 || unlocking) {
      setError('Enter all four digits first.')
      playIf(state.soundOn, 'error')
      return
    }
    if (entry.join('') === FINAL_PASSWORD.join('')) {
      setUnlocking(true)
      playIf(state.soundOn, 'win')
      window.setTimeout(() => dispatch({ type: 'SOLVE_FINAL' }), 700)
      return
    }
    dispatch({ type: 'WRONG_FINAL' })
    const messages = [
      'Access denied. The digits are close — check their mission order.',
      'Still locked. Read your evidence digits from Mission 1 to Mission 4.',
      'Not this time. Ask your team to compare the four digits again.',
    ]
    setError(messages[state.finalAttempts % messages.length])
    setShake(true)
    setEntry([])
    playIf(state.soundOn, 'error')
    window.setTimeout(() => setShake(false), 500)
  }

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault()
        press(event.key)
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        backspace()
      } else if (event.key === 'Enter') {
        event.preventDefault()
        submit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  return (
    <div className="lock-screen">
      <div className="lock-grid-bg" aria-hidden="true" />
      <button
        type="button"
        className="back-btn"
        onClick={() => {
          playIf(state.soundOn, 'click')
          dispatch({ type: 'SET_VIEW', view: 'dashboard' })
        }}
      >
        <ArrowLeft size={16} /> MISSION CONTROL
      </button>

      <header className="lock-head">
        <span className="eyebrow">
          <LockKeyhole size={15} /> FINAL ESCAPE CHALLENGE
        </span>
        <h1>
          RESTORE THE <span>SCHOOL SYSTEM</span>
        </h1>
        <p>
          Enter the 4 digits in mission order.
        </p>
      </header>

      <div className="lock-layout">
        <section className={`vault ${shake ? 'shake' : ''} ${unlocking ? 'unlocking' : ''}`}>
          <div className="vault-top">
            <span className="vault-led" />
            <span>MASTER DATABASE LOCK · LEVEL 4</span>
            <span className="vault-led" />
          </div>

          <div className="vault-lock-icon">
            {unlocking ? <UnlockKeyhole size={34} /> : <LockKeyhole size={34} />}
          </div>

          <div className="code-slots" aria-label="Entered code">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`code-slot ${entry[index] ? 'filled' : ''} ${entry.length === index ? 'current' : ''}`}
              >
                {entry[index] ?? ''}
              </div>
            ))}
          </div>

          {unlocking ? (
            <div className="unlock-message">
              <ShieldCheck size={22} /> CODE ACCEPTED · RESTORING SYSTEM…
            </div>
          ) : (
            <>
              {error && (
                <div className="lock-error">
                  <CircleAlert size={17} />
                  <span>{error}</span>
                </div>
              )}
              <div className="keypad">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                  <button type="button" key={digit} className="key-btn" onClick={() => press(digit)}>
                    {digit}
                  </button>
                ))}
                <button type="button" className="key-btn key-action" onClick={clear} aria-label="Clear entry">
                  CLR
                </button>
                <button type="button" className="key-btn" onClick={() => press('0')}>
                  0
                </button>
                <button type="button" className="key-btn key-action" onClick={backspace} aria-label="Delete last digit">
                  <Delete size={20} />
                </button>
              </div>

              <button
                type="button"
                className="btn btn-danger btn-block btn-xl"
                onClick={submit}
                disabled={entry.length !== 4}
              >
                <KeyRound size={19} /> UNLOCK DATABASE
              </button>
            </>
          )}

          <div className="vault-foot">
            <span>ATTEMPTS: {state.finalAttempts}</span>
            <span>·</span>
            <span>{allDone ? '4/4 DATA FRAGMENTS' : `${state.missions.filter((m) => m.completed).length}/4 DATA FRAGMENTS`}</span>
          </div>
        </section>

        <aside className="lock-side">
          <section className="panel evidence-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">RECOVERED EVIDENCE</span>
                <h2>MISSION DIGITS</h2>
              </div>
              <Check size={18} className="neon-green" />
            </div>
            <div className="evidence-list">
              {MISSIONS.map((mission) => (
                <div className={`evidence-row ${state.digits[mission.id] ? 'found' : ''}`} key={mission.id}>
                  <span className="evidence-station">M{mission.id}</span>
                  <div>
                    <strong>{mission.name}</strong>
                    <small>Station {mission.station}</small>
                  </div>
                  <span className="evidence-digit">{state.digits[mission.id] ?? '?'}</span>
                </div>
              ))}
            </div>
            <p className="vault-hint">Order: Mission 1 → Mission 4.</p>
          </section>

          {state.passwordRevealed && (
            <section className="panel teacher-override">
              <span className="eyebrow">TEACHER OVERRIDE ACTIVE</span>
              <h2>RECOVERY CODE</h2>
              <div className="override-code">4 7 2 9</div>
              <p>The teacher has revealed the master code.</p>
            </section>
          )}

          <section className="panel lock-help">
            <span className="eyebrow">STUCK?</span>
            <h2>TEAM PROTOCOL</h2>
            <ul>
              <li>Say the digits in mission order.</li>
              <li>Check for a repeated digit.</li>
              <li>Ask the teacher for a hint.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
