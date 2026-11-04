import { useEffect, useState } from 'react'
import { ArrowRight, Clock3 } from 'lucide-react'
import { Dashboard } from './components/Dashboard'
import { Hud } from './components/Hud'
import { Intro } from './components/Intro'
import { LockScreen } from './components/LockScreen'
import { MissionScreen } from './components/MissionScreen'
import { PrintClues } from './components/PrintClues'
import { RulesModal } from './components/RulesModal'
import { Scoreboard } from './components/Scoreboard'
import { TeacherPanel } from './components/TeacherPanel'
import { TeamSetup } from './components/TeamSetup'
import { Victory } from './components/Victory'
import { Modal } from './components/ui'
import { playIf } from './game/audio'
import { GameProvider, useGame } from './game/store'

function Ticker() {
  return (
    <div className="rule-ticker" aria-hidden="true">
      <span className="ticker-label">LAB PROTOCOL</span>
      <div className="ticker-track">
        <span>🚶 WALK, NEVER RUN</span>
        <span>•</span>
        <span>1 VISITOR PER STATION</span>
        <span>•</span>
        <span>WHISPER-LEVEL TEAMWORK</span>
        <span>•</span>
        <span>ROTATE THE COMPUTER CAPTAIN</span>
        <span>•</span>
        <span>HINTS ARE FREE</span>
        <span>•</span>
        <span>ASK THE TEACHER TO VERIFY</span>
        <span>•</span>
      </div>
    </div>
  )
}

function GameApp() {
  const { state, dispatch } = useGame()
  const [teacherOpen, setTeacherOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [timeUpDismissed, setTimeUpDismissed] = useState(false)
  const hasTime = state.timerRemaining > 0

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFullscreen)
    return () => document.removeEventListener('fullscreenchange', onFullscreen)
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 't') {
        event.preventDefault()
        setTeacherOpen((value) => !value)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (hasTime) setTimeUpDismissed(false)
  }, [hasTime])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [state.view, state.phase, state.activeMission])

  const toggleFullscreen = async () => {
    playIf(state.soundOn, 'click')
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch {
      // Full screen may be blocked by the browser; the game still works.
    }
  }

  const openTeacher = () => {
    playIf(state.soundOn, 'click')
    setTeacherOpen(true)
  }

  const showScoreboard = () => {
    playIf(state.soundOn, 'click')
    dispatch({ type: 'SET_VIEW', view: 'scoreboard' })
  }

  return (
    <div className={`app phase-${state.phase}`}>
      <div className="app-fx" aria-hidden="true">
        <div className="fx-grid" />
        <div className="fx-glow glow-one" />
        <div className="fx-glow glow-two" />
        <div className="fx-scanline" />
        <div className="fx-noise" />
      </div>

      {state.phase === 'intro' && <Intro />}

      {state.phase === 'setup' && <TeamSetup />}

      {state.phase !== 'intro' && state.phase !== 'setup' && (
        <>
          {state.view === 'scoreboard' ? (
            <Scoreboard />
          ) : state.phase === 'victory' ? (
            <Victory onTeacher={openTeacher} onScoreboard={showScoreboard} />
          ) : (
            <>
              <Hud
                onTeacher={openTeacher}
                onScoreboard={showScoreboard}
                onRules={() => {
                  playIf(state.soundOn, 'click')
                  setRulesOpen(true)
                }}
                onToggleFullscreen={toggleFullscreen}
                isFullscreen={isFullscreen}
              />
              <main className="game-main">
                {state.view === 'mission' ? (
                  <MissionScreen />
                ) : state.view === 'lock' ? (
                  <LockScreen />
                ) : (
                  <Dashboard />
                )}
                <Ticker />
              </main>
            </>
          )}
        </>
      )}

      <TeacherPanel
        open={teacherOpen}
        onClose={() => setTeacherOpen(false)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />

      {rulesOpen && <RulesModal onClose={() => setRulesOpen(false)} />}

      {state.phase === 'game' && state.timeUp && !timeUpDismissed && (
        <Modal
          title="Recovery Window Closed"
          subtitle="The 20-minute countdown has reached zero."
          onClose={() => setTimeUpDismissed(true)}
        >
          <div className="timeup-body">
            <div className="timeup-icon">
              <Clock3 size={38} />
            </div>
            <h3>TIME&apos;S UP, INVESTIGATORS</h3>
            <p>
              The system is still locked. Your teacher can add recovery time or let the team finish
              the mission for the learning, not the clock.
            </p>
            <div className="timeup-actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  dispatch({ type: 'SET_TIME', seconds: 300 })
                  dispatch({ type: 'TOGGLE_TIMER' })
                  setTimeUpDismissed(true)
                  playIf(state.soundOn, 'unlock')
                }}
              >
                <Clock3 size={17} /> TEACHER: ADD 5 MINUTES
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setTimeUpDismissed(true)
                  playIf(state.soundOn, 'click')
                }}
              >
                <ArrowRight size={16} /> CONTINUE WITHOUT TIMER
              </button>
            </div>
            <p className="timeup-note">
              Discussion tip: ask teams to explain one Excel skill they used before the clock ran out.
            </p>
          </div>
        </Modal>
      )}

      <PrintClues />
    </div>
  )
}

export default function App() {
  return (
    <GameProvider>
      <GameApp />
    </GameProvider>
  )
}
