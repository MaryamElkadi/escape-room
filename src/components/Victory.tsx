import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Database,
  KeyRound,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react'
import { AVATARS, FINAL_PASSWORD, MISSIONS } from '../game/content'
import { playIf } from '../game/audio'
import { formatTime, useGame } from '../game/store'
import { Confetti, Modal } from './ui'

export function Victory({
  onTeacher,
  onScoreboard,
}: {
  onTeacher: () => void
  onScoreboard: () => void
}) {
  const { state, dispatch } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)
  const winner = [...state.teams].sort((a, b) => b.points - a.points)[0]
  const player = state.teams.find((team) => team.isPlayer)
  const avatar = AVATARS.find((item) => item.id === (winner?.avatar ?? state.avatar)) ?? AVATARS[0]

  useEffect(() => {
    const timer = window.setTimeout(() => playIf(state.soundOn, 'win'), 350)
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="victory-screen">
      <Confetti count={140} />
      <div className="victory-grid" aria-hidden="true" />
      <div className="victory-glow" aria-hidden="true" />

      <div className="victory-shell">
        <div className="victory-kicker">
          <CheckCircle2 size={18} /> RECOVERY COMPLETE · 4/4 DATA FRAGMENTS
        </div>

        <h1 className="victory-title">
          SYSTEM <span>RESTORED!</span>
        </h1>
        <p className="victory-sub">The school database is back online.</p>

        <div className="victory-code">
          {FINAL_PASSWORD.map((digit) => (
            <span key={digit}>{digit}</span>
          ))}
        </div>

        <div className="victory-grid-cards">
          <section className="victory-card winning">
            <span className="eyebrow">
              <Trophy size={14} /> WINNING TEAM
            </span>
            <div className="winner-avatar">{avatar.emoji}</div>
            <h2>{winner?.name ?? state.teamName}</h2>
            <p>{winner?.points ?? 0} points · {winner?.finalSolved ? 'Final code cracked' : 'Recovery complete'}</p>
            <span className="winner-badge">
              <ShieldCheck size={15} /> ELITE INVESTIGATION TEAM
            </span>
          </section>

          <section className="victory-card">
            <span className="eyebrow">MISSION REPORT</span>
            <div className="report-grid">
              <div>
                <small>TEAM SCORE</small>
                <strong>{player?.points ?? 0}</strong>
              </div>
              <div>
                <small>TIME LEFT</small>
                <strong>{formatTime(state.timerRemaining)}</strong>
              </div>
              <div>
                <small>MISSIONS</small>
                <strong>4/4</strong>
              </div>
              <div>
                <small>CODE ATTEMPTS</small>
                <strong>{state.finalAttempts + 1}</strong>
              </div>
            </div>
            <div className="victory-digits">
              {MISSIONS.map((mission) => (
                <span key={mission.id}>
                  <small>M{mission.id}</small>
                  <strong>{state.digits[mission.id] ?? mission.digit}</strong>
                </span>
              ))}
            </div>
            <div className="database-unlocked">
              <Database size={18} />
              <div>
                <strong>SCHOOL DATABASE UNLOCKED</strong>
                <small>All records restored · encryption cleared</small>
              </div>
              <CheckCircle2 size={20} />
            </div>
          </section>
        </div>

        <div className="victory-actions">
          <button
            type="button"
            className="btn btn-primary btn-xl"
            onClick={() => {
              playIf(state.soundOn, 'click')
              setConfirmReset(true)
            }}
          >
            <RotateCcw size={18} /> PLAY AGAIN
          </button>
          <button type="button" className="btn btn-ghost" onClick={onScoreboard}>
            <Trophy size={17} /> SCOREBOARD
          </button>
          <button type="button" className="btn btn-ghost" onClick={onTeacher}>
            <Settings size={17} /> TEACHER PANEL
          </button>
        </div>

        <div className="victory-foot">
          <Sparkles size={15} /> Excel Escape Room · The Missing Data · Primary 6
        </div>
      </div>

      {confirmReset && (
        <Modal
          title="Start a new investigation?"
          subtitle="This clears the current team, timer and scoreboard."
          onClose={() => setConfirmReset(false)}
        >
          <div className="confirm-body">
            <p>Only continue if the lesson is over or you want to restart from the beginning.</p>
            <div className="confirm-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
                CANCEL
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  playIf(state.soundOn, 'click')
                  dispatch({ type: 'RESET' })
                }}
              >
                <KeyRound size={16} /> YES, RESET GAME
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
