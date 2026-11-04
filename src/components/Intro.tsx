import { useEffect, useState } from 'react'
import { AlertTriangle, ArrowRight, Database, Radio, ShieldAlert, Terminal } from 'lucide-react'
import { useGame } from '../game/store'
import { playIf } from '../game/audio'
import schoolLogo from '../assets/school-logo.png'

const ALERTS = ['SYSTEM BREACH DETECTED', 'SCHOOL DATABASE LOCKED', 'DATA RECOVERY REQUIRED']

export function Intro() {
  const { state, dispatch } = useGame()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setStep(1), 500),
      window.setTimeout(() => setStep(2), 1300),
      window.setTimeout(() => setStep(3), 2100),
      window.setTimeout(() => setStep(4), 3000),
      window.setTimeout(() => setStep(5), 3900),
    ]
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    if (step === 2) playIf(state.soundOn, 'alarm')
    if (step === 5) playIf(state.soundOn, 'whoosh')
  }, [step, state.soundOn])

  const enter = () => {
    playIf(state.soundOn, 'unlock')
    dispatch({ type: 'START_INVESTIGATION' })
  }

  const skip = () => {
    playIf(state.soundOn, 'click')
    dispatch({ type: 'START_INVESTIGATION' })
  }

  return (
    <div className="intro">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-glow" aria-hidden="true" />
      <div className="emergency-strip">
        <span className="strip-light" />
        <span>EMERGENCY BROADCAST</span>
        <span className="strip-code">CHANNEL 06 · SCHOOL NETWORK</span>
        <span className="strip-light" />
      </div>

      <button type="button" className="skip-btn" onClick={skip}>
        Skip intro <ArrowRight size={14} />
      </button>

      <main className="intro-main">
        <img src={schoolLogo} alt="School logo" className="intro-logo" />
        <div className={`intro-kicker ${step >= 1 ? 'show' : ''}`}>
          <ShieldAlert size={18} />
          <span>SECURITY ALERT · PRIORITY RED</span>
          <span className="live-dot" />
        </div>

        <h1 className="intro-title">
          <span className="intro-title-small">EXCEL ESCAPE ROOM</span>
          THE <em>MISSING</em> DATA
        </h1>

        <div className="alert-lines">
          {ALERTS.map((alert, index) => (
            <div key={alert} className={`alert-line ${step > index ? 'show' : ''}`}>
              <AlertTriangle size={18} />
              <span>{alert}</span>
              <span className="alert-bar" />
            </div>
          ))}
        </div>

        <div className={`intro-clock ${step >= 2 ? 'show' : ''}`}>
          <div className="clock-readout">
            <span className="clock-label">RECOVERY WINDOW</span>
            <strong>20:00</strong>
            <span className="clock-sub">MINUTES REMAINING</span>
          </div>
          <div className="clock-ring" aria-hidden="true">
            <span />
          </div>
        </div>

        <section className={`ai-panel ${step >= 4 ? 'show' : ''}`} aria-label="Emergency transmission">
          <div className="ai-avatar">
            <Terminal size={26} />
            <span className="ai-pulse" />
          </div>
          <div className="ai-copy">
            <div className="ai-head">
              <Radio size={14} /> EMERGENCY TRANSMISSION · SCHOOL AI
            </div>
            <p>
              Someone wiped the school&apos;s Excel database. You have <strong>20 minutes</strong>:
              fix 4 tasks, collect 4 digits, unlock the code.
            </p>
          </div>
        </section>

        <div className={`intro-cta ${step >= 5 ? 'show' : ''}`}>
          <div className="cta-call">
            <Database size={20} />
            INVESTIGATION TEAMS, REPORT TO YOUR STATIONS!
          </div>
          <button type="button" className="btn btn-primary btn-xl" onClick={enter}>
            ENTER THE LAB <ArrowRight size={20} />
          </button>
        </div>
      </main>

      <footer className="intro-foot">
        <span>PRIMARY 6 · MICROSOFT EXCEL</span>
        <span className="foot-dot" />
        <span>4 MISSIONS · 1 FINAL CODE</span>
        <span className="foot-dot" />
        <span>WALK, DON&apos;T RUN</span>
      </footer>
    </div>
  )
}
