import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  Eye,
  KeyRound,
  Lightbulb,
  Lock,
  MapPin,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react'
import { MISSIONS, TEACHER_PIN } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'
import { Mission1Task } from './missions/Mission1Task'
import { Mission2Task } from './missions/Mission2Task'
import { Mission3Task } from './missions/Mission3Task'
import { Mission4Task } from './missions/Mission4Task'
import { Confetti, Modal } from './ui'

export function MissionScreen() {
  const { state, dispatch } = useGame()
  const id = state.activeMission ?? 1
  const mission = MISSIONS[id - 1]
  const missionState = state.missions[id - 1]
  const [showClue, setShowClue] = useState(true)
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [pinStep, setPinStep] = useState<'pin' | 'confirm'>('pin')
  const [justVerified, setJustVerified] = useState(false)

  if (!mission || !missionState) return null

  const nextMission = MISSIONS[id]
  const taskSolved = missionState.taskDone || missionState.completed

  const back = () => {
    playIf(state.soundOn, 'click')
    dispatch({ type: 'SET_VIEW', view: 'dashboard' })
  }

  const onSolved = () => {
    if (!missionState.taskDone) dispatch({ type: 'COMPLETE_TASK', id })
  }

  const revealHint = () => {
    if (missionState.hint >= mission.hints.length) return
    playIf(state.soundOn, 'click')
    dispatch({ type: 'REVEAL_HINT', id })
  }

  const openVerify = () => {
    setPin('')
    setPinError('')
    setPinStep('pin')
    setVerifyOpen(true)
    playIf(state.soundOn, 'click')
  }

  const submitPin = (event: FormEvent) => {
    event.preventDefault()
    if (pin === TEACHER_PIN) {
      setPinStep('confirm')
      setPinError('')
      playIf(state.soundOn, 'unlock')
    } else {
      setPinError('Incorrect teacher PIN. Ask your teacher to type it.')
      playIf(state.soundOn, 'error')
    }
  }

  const confirmVerification = () => {
    dispatch({ type: 'VERIFY_MISSION', id })
    setVerifyOpen(false)
    setJustVerified(true)
    playIf(state.soundOn, 'digit')
    window.setTimeout(() => playIf(state.soundOn, 'success'), 120)
  }

  const goNext = () => {
    playIf(state.soundOn, 'click')
    if (nextMission) {
      dispatch({ type: 'OPEN_MISSION', id: nextMission.id })
    } else {
      dispatch({ type: 'SET_VIEW', view: 'lock' })
    }
  }

  const Task = [Mission1Task, Mission2Task, Mission3Task, Mission4Task][id - 1]

  return (
    <div className="mission-screen">
      {justVerified && <Confetti count={70} />}

      <button type="button" className="back-btn" onClick={back}>
        <ArrowLeft size={16} /> MISSION CONTROL
      </button>

      <header className="mission-hero" style={{ ['--mission-color' as string]: mission.color }}>
        <div className="mission-hero-copy">
          <span className="eyebrow">
            STATION {mission.station} · {mission.stationName.toUpperCase()}
          </span>
          <h1>
            <span>MISSION {mission.id}</span>
            {mission.name}
          </h1>
          <p>{mission.story}</p>
          <p className="mission-spot">
            <MapPin size={14} /> {mission.stationSpot}
          </p>
          <div className="mission-meta">
            <span>
              <Sparkles size={14} /> {mission.points} POINTS
            </span>
            <span>
              <MapPin size={14} /> STATION {mission.station}
            </span>
            <span>
              <KeyRound size={14} /> DIGIT {missionState.completed ? mission.digit : '?'}
            </span>
          </div>
        </div>
        <div className="mission-hero-emblem" aria-hidden="true">
          <div className="emblem-ring">
            <span className="emblem-letter">{mission.station}</span>
          </div>
          <span className="emblem-caption">{mission.topic}</span>
        </div>
      </header>

      {missionState.completed && (
        <section className="completion-banner">
          <div className="completion-digit">
            <small>DIGIT RECOVERED</small>
            <strong>{mission.digit}</strong>
          </div>
          <div className="completion-copy">
            <span className="eyebrow">
              <CheckCircle2 size={14} /> MISSION {mission.id} VERIFIED
            </span>
            <h2>DATA FRAGMENT SECURED</h2>
            <p>
              +{mission.points} points. Keep digit <strong>{mission.digit}</strong> for the final
              lock.
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={goNext}>
            {nextMission ? (
              <>
                NEXT MISSION <ArrowRight size={17} />
              </>
            ) : (
              <>
                OPEN FINAL LOCK <KeyRound size={17} />
              </>
            )}
          </button>
        </section>
      )}

      <div className="mission-layout">
        <div className="mission-left">
          <section className="panel mission-brief">
            <div className="panel-head">
              <div>
                <span className="eyebrow">DO THIS IN EXCEL</span>
                <h2>YOUR STEPS</h2>
              </div>
              <Lock size={18} className="neon-cyan" />
            </div>
            <ol className="objective-list">
              {mission.objective.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className={`panel clue-card ${showClue ? 'open' : ''}`}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">STATION CLUE</span>
                <h2>{mission.clue}</h2>
              </div>
              <button type="button" className="text-btn" onClick={() => setShowClue((value) => !value)}>
                <Eye size={15} /> {showClue ? 'HIDE' : 'OPEN CARD'}
              </button>
            </div>
            {showClue ? (
              <div className="clue-paper">
                {mission.clueLines.map((line) => (
                  <p key={line}>{line}</p>
                ))}
                <span className="clue-stamp">RECOVERED EVIDENCE</span>
              </div>
            ) : (
              <div className="clue-closed">
                <KeyRound size={26} />
                <p>Click OPEN CARD to see the data from your station.</p>
              </div>
            )}
          </section>

          <section className="panel hint-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">HINT SYSTEM · FREE</span>
                <h2>
                  <Lightbulb size={18} /> NEED A CLUE?
                </h2>
              </div>
              <span className="hint-count">
                {missionState.hint}/{mission.hints.length}
              </span>
            </div>
            <div className="hint-list">
              {mission.hints.slice(0, missionState.hint).map((hint, index) => (
                <div className="hint-item" key={hint}>
                  <span>HINT {index + 1}</span>
                  <p>{hint}</p>
                </div>
              ))}
              {missionState.hint === 0 && <p className="hint-empty">Stuck? Hints are free.</p>}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={revealHint}
              disabled={missionState.hint >= mission.hints.length}
            >
              <Lightbulb size={16} />
              {missionState.hint >= mission.hints.length ? 'ALL HINTS REVEALED' : 'REVEAL NEXT HINT'}
            </button>
          </section>
        </div>

        <div className="mission-right">
          <section className="panel task-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">DO IT IN EXCEL</span>
                <h2>{mission.taskLabel}</h2>
              </div>
              <span className={`task-status ${taskSolved ? 'done' : ''}`}>
                {taskSolved ? (
                  <>
                    <Check size={14} /> TASK COMPLETE
                  </>
                ) : (
                  'IN PROGRESS'
                )}
              </span>
            </div>
            <Task solved={taskSolved} soundOn={state.soundOn} onSolved={onSolved} />
          </section>

          <section className={`panel verify-panel ${missionState.completed ? 'verified' : ''}`}>
            <div className="panel-head">
              <div>
                <span className="eyebrow">TEACHER VERIFICATION</span>
                <h2>
                  <ShieldCheck size={18} /> {missionState.completed ? 'MISSION VERIFIED' : 'SIGN-OFF REQUIRED'}
                </h2>
              </div>
              {missionState.completed ? <CheckCircle2 className="neon-green" /> : <UserCheck className="neon-cyan" />}
            </div>
            {missionState.completed ? (
              <div className="verify-done">
                <div className="verify-digit">{mission.digit}</div>
                <p>
                  Digit <strong>{mission.digit}</strong> is now in your evidence locker.
                </p>
              </div>
            ) : (
              <>
                <p className="verify-copy">
                  Finished? Call your teacher. The PIN reveals the digit.
                </p>
                <div className="verify-steps">
                  <span className={taskSolved ? 'done' : ''}>
                    {taskSolved ? <Check size={13} /> : '1'} Excel task
                  </span>
                  <span>2 Teacher checks</span>
                  <span>3 Digit revealed</span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={openVerify}
                  disabled={!taskSolved}
                >
                  <ShieldCheck size={17} />
                  {taskSolved ? 'CALL TEACHER TO VERIFY' : 'COMPLETE THE TASK FIRST'}
                </button>
              </>
            )}
          </section>
        </div>
      </div>

      {verifyOpen && (
        <Modal
          title={pinStep === 'pin' ? 'Teacher Verification' : 'Approve this mission?'}
          subtitle={
            pinStep === 'pin'
              ? `Mission ${mission.id} · ${mission.name}`
              : 'Check the team’s Excel work before revealing the digit.'
          }
          onClose={() => setVerifyOpen(false)}
        >
          {pinStep === 'pin' ? (
            <form className="pin-form" onSubmit={submitPin}>
              <div className="pin-lock-icon">
                <Lock size={30} />
              </div>
              <p>Enter the 4-digit teacher PIN to open the verification panel.</p>
              <input
                className="pin-input"
                value={pin}
                onChange={(event) => {
                  setPin(event.target.value.replace(/[^0-9]/g, '').slice(0, 4))
                  setPinError('')
                }}
                inputMode="numeric"
                maxLength={4}
                placeholder="••••"
                autoFocus
                aria-label="Teacher PIN"
              />
              {pinError && (
                <p className="pin-error">
                  <CircleAlert size={15} /> {pinError}
                </p>
              )}
              <button type="submit" className="btn btn-primary btn-block" disabled={pin.length !== 4}>
                UNLOCK TEACHER CHECK
              </button>
              <p className="pin-help">Teachers: see the README for the default PIN.</p>
            </form>
          ) : (
            <div className="verify-confirm">
              <div className="teacher-note">
                <span>TEACHER CHECK</span>
                <p>{mission.teacherNote}</p>
              </div>
              <ul className="verify-objectives">
                {mission.objective.map((item) => (
                  <li key={item}>
                    <Check size={14} /> {item}
                  </li>
                ))}
              </ul>
              <div className="verify-confirm-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setPinStep('pin')}>
                  BACK
                </button>
                <button type="button" className="btn btn-primary" onClick={confirmVerification}>
                  VERIFY &amp; REVEAL DIGIT {mission.digit}
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
