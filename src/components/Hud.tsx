import {
  Clock3,
  Footprints,
  Maximize2,
  Minimize2,
  Settings,
  ShieldQuestion,
  Trophy,
  Volume2,
  VolumeX,
} from 'lucide-react'
import { AVATARS, MISSIONS } from '../game/content'
import { formatTime, useGame } from '../game/store'
import { playIf } from '../game/audio'
import schoolLogo from '../assets/school-logo.png'

interface HudProps {
  onTeacher: () => void
  onScoreboard: () => void
  onRules: () => void
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

export function Hud({ onTeacher, onScoreboard, onRules, onToggleFullscreen, isFullscreen }: HudProps) {
  const { state, dispatch } = useGame()
  const avatar = AVATARS.find((item) => item.id === state.avatar) ?? AVATARS[0]
  const player = state.teams.find((team) => team.isPlayer)
  const collected = MISSIONS.filter((mission) => state.digits[mission.id]).length
  const urgent = state.timerRemaining <= 180
  const warning = state.timerRemaining <= 300 && !urgent

  const goHome = () => {
    playIf(state.soundOn, 'click')
    dispatch({ type: 'SET_VIEW', view: 'dashboard' })
  }

  return (
    <header className="hud">
      <button type="button" className="hud-brand" onClick={goHome} title="Return to mission control">
        <img src={schoolLogo} alt="School logo" className="school-logo" />
        <span className="brand-badge">
          <span className="brand-pulse" />
          XL
        </span>
        <span className="brand-text">
          <strong>THE MISSING DATA</strong>
          <small>EXCEL ESCAPE ROOM</small>
        </span>
      </button>

      <div className="hud-team">
        <span className="hud-avatar">{avatar.emoji}</span>
        <span className="hud-team-copy">
          <small>INVESTIGATION TEAM</small>
          <strong>{state.teamName}</strong>
        </span>
      </div>

      <div className={`hud-timer ${urgent ? 'urgent' : ''} ${warning ? 'warning' : ''} ${!state.timerRunning ? 'paused' : ''}`}>
        <Clock3 size={18} />
        <div>
          <span>{state.timerRunning ? 'TIME REMAINING' : 'TIMER PAUSED'}</span>
          <strong>{formatTime(state.timerRemaining)}</strong>
        </div>
      </div>

      <div className="hud-score" title="Team points">
        <Trophy size={17} />
        <span>SCORE</span>
        <strong>{player?.points ?? 0}</strong>
      </div>

      <div className="hud-digits" aria-label={`${collected} of 4 digits recovered`}>
        {MISSIONS.map((mission) => (
          <span
            key={mission.id}
            className={`hud-digit ${state.digits[mission.id] ? 'found' : ''}`}
            title={state.digits[mission.id] ? `Digit ${mission.digit} recovered` : `Mission ${mission.id} digit missing`}
          >
            {state.digits[mission.id] ?? '·'}
          </span>
        ))}
      </div>

      <div className="hud-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            playIf(state.soundOn, 'click')
            dispatch({ type: 'TOGGLE_SOUND' })
          }}
          aria-label={state.soundOn ? 'Mute sound' : 'Enable sound'}
          title={state.soundOn ? 'Sound on' : 'Sound off'}
        >
          {state.soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            playIf(state.soundOn, 'click')
            onScoreboard()
          }}
          aria-label="Open scoreboard"
          title="Scoreboard"
        >
          <Trophy size={18} />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            playIf(state.soundOn, 'click')
            onRules()
          }}
          aria-label="Open classroom rules"
          title="Classroom rules"
        >
          <Footprints size={18} />
        </button>
        <button
          type="button"
          className="icon-btn hide-small"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          title="Full screen / projector mode"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
        <button
          type="button"
          className="icon-btn teacher-trigger"
          onClick={() => {
            playIf(state.soundOn, 'click')
            onTeacher()
          }}
          aria-label="Open teacher panel"
          title="Teacher panel"
        >
          <Settings size={18} />
        </button>
      </div>

      <button type="button" className="hud-help" onClick={onRules} aria-label="How to play">
        <ShieldQuestion size={16} />
      </button>
    </header>
  )
}
