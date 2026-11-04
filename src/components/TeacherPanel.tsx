import { useEffect, useState, type FormEvent } from 'react'
import {
  Award,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  KeyRound,
  Lightbulb,
  Lock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Plus,
  Printer,
  RotateCcw,
  Settings,
  ShieldCheck,
  Timer,
  Trash2,
  Trophy,
  Unlock,
  Users,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import { AVATARS, MISSIONS, TEACHER_CLUES, TEACHER_PIN } from '../game/content'
import { playIf } from '../game/audio'
import { formatTime, useGame } from '../game/store'
import type { AvatarId } from '../game/types'

interface TeacherPanelProps {
  open: boolean
  onClose: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

type Tab = 'control' | 'missions' | 'teams' | 'clues'

export function TeacherPanel({ open, onClose, isFullscreen, onToggleFullscreen }: TeacherPanelProps) {
  const { state, dispatch } = useGame()
  const [unlocked, setUnlocked] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [tab, setTab] = useState<Tab>('control')
  const [confirmReset, setConfirmReset] = useState(false)
  const [newTeam, setNewTeam] = useState('')
  const [newAvatar, setNewAvatar] = useState<AvatarId>('falcon')
  const [teamError, setTeamError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (!open) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.classList.remove('modal-open')
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setUnlocked(false)
      setPin('')
      setPinError('')
      setConfirmReset(false)
      setTeamError('')
    }
  }, [open])

  if (!open) return null

  const click = () => playIf(state.soundOn, 'click')

  const submitPin = (event: FormEvent) => {
    event.preventDefault()
    if (pin === TEACHER_PIN) {
      setUnlocked(true)
      setPinError('')
      playIf(state.soundOn, 'unlock')
    } else {
      setPinError('Incorrect PIN. Check the README for the default teacher PIN.')
      playIf(state.soundOn, 'error')
    }
  }

  const addTeam = (event: FormEvent) => {
    event.preventDefault()
    if (!newTeam.trim()) {
      setTeamError('Enter a team name.')
      return
    }
    dispatch({ type: 'ADD_TEAM', name: newTeam, avatar: newAvatar })
    setNewTeam('')
    setTeamError('')
    playIf(state.soundOn, 'success')
  }

  const adjustTime = (delta: number) => {
    dispatch({ type: 'SET_TIME', seconds: state.timerRemaining + delta })
    click()
  }

  const sortedTeams = [...state.teams].sort((a, b) => b.points - a.points)
  const winnerTeam = state.teams.find((team) => team.finalSolved) ?? sortedTeams[0]
  const winnerAvatar = AVATARS.find((avatar) => avatar.id === winnerTeam?.avatar)?.emoji ?? '🏆'

  return (
    <div className="teacher-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="teacher-panel" role="dialog" aria-modal="true" aria-label="Teacher control panel">
        <header className="teacher-head">
          <div>
            <span className="eyebrow">
              <Settings size={14} /> CLASSROOM CONTROL
            </span>
            <h2>TEACHER PANEL</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close teacher panel">
            <X size={20} />
          </button>
        </header>

        {!unlocked ? (
          <div className="teacher-gate">
            <div className="gate-icon">
              <Lock size={34} />
            </div>
            <h3>TEACHER ACCESS ONLY</h3>
            <p>Enter the 4-digit teacher PIN. The default is listed in the README.</p>
            <form onSubmit={submitPin}>
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
              {pinError && <p className="pin-error">{pinError}</p>}
              <button type="submit" className="btn btn-primary btn-block" disabled={pin.length !== 4}>
                <Unlock size={16} /> UNLOCK PANEL
              </button>
            </form>
            <p className="gate-note">Students: this area is for your teacher. Return to your mission.</p>
          </div>
        ) : (
          <>
            <nav className="teacher-tabs">
              {(
                [
                  ['control', 'CONTROL'],
                  ['missions', 'MISSIONS'],
                  ['teams', 'TEAMS'],
                  ['clues', 'CLUES'],
                ] as [Tab, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`teacher-tab ${tab === key ? 'active' : ''}`}
                  onClick={() => {
                    setTab(key)
                    click()
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            <div className="teacher-body">
              {state.finalSolved && (
                <section className="teacher-card winner-card">
                  <div className="teacher-card-head">
                    <h3>
                      <Trophy size={16} /> WINNER
                    </h3>
                  </div>
                  <div className="teacher-winner">
                    <span className="teacher-winner-avatar">{winnerAvatar}</span>
                    <div>
                      <strong>{winnerTeam?.name ?? '—'}</strong>
                      <small>
                        {winnerTeam?.points ?? 0} pts · final code cracked
                      </small>
                    </div>
                  </div>
                </section>
              )}
              {tab === 'control' && (
                <>
                  <section className="teacher-card">
                    <div className="teacher-card-head">
                      <h3>
                        <Clock3 size={16} /> GAME TIMER
                      </h3>
                      <span className={`timer-readout ${state.timerRunning ? 'live' : ''}`}>
                        {formatTime(state.timerRemaining)}
                      </span>
                    </div>
                    <div className="teacher-btn-row">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          dispatch({ type: 'TOGGLE_TIMER' })
                          click()
                        }}
                        disabled={state.timerRemaining <= 0}
                      >
                        {state.timerRunning ? <Pause size={16} /> : <Play size={16} />}
                        {state.timerRunning ? 'PAUSE' : 'RESUME'}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => adjustTime(60)}>
                        <Plus size={15} /> 1 MIN
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => adjustTime(-60)}>
                        − 1 MIN
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={() => adjustTime(300)}>
                        + 5 MIN
                      </button>
                    </div>
                    <div className="teacher-btn-row">
                      <span className="teacher-mini-label">SET:</span>
                      {[300, 600, 1200].map((seconds) => (
                        <button
                          key={seconds}
                          type="button"
                          className="chip-btn"
                          onClick={() => {
                            dispatch({ type: 'SET_TIME', seconds })
                            click()
                          }}
                        >
                          {seconds / 60}:00
                        </button>
                      ))}
                      <button
                        type="button"
                        className="chip-btn"
                        onClick={() => {
                          dispatch({ type: 'SET_TIME', seconds: 0 })
                          click()
                        }}
                      >
                        ZERO
                      </button>
                    </div>
                    {state.timeUp && <p className="teacher-warning">Time is up. Add minutes to continue the escape room.</p>}
                  </section>

                  <section className="teacher-card">
                    <div className="teacher-card-head">
                      <h3>
                        <Trophy size={16} /> GAME CONTROLS
                      </h3>
                    </div>
                    <div className="teacher-stats">
                      <div>
                        <small>MISSIONS</small>
                        <strong>{state.missions.filter((m) => m.completed).length}/4</strong>
                      </div>
                      <div>
                        <small>DIGITS</small>
                        <strong>{Object.keys(state.digits).length}/4</strong>
                      </div>
                      <div>
                        <small>FINAL CODE</small>
                        <strong>{state.finalSolved ? 'CRACKED' : 'LOCKED'}</strong>
                      </div>
                    </div>
                    <div className="teacher-btn-row">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          dispatch({ type: 'SET_VIEW', view: 'scoreboard' })
                          onClose()
                        }}
                      >
                        <Trophy size={16} /> DISPLAY SCOREBOARD
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          dispatch({ type: 'TOGGLE_SOUND' })
                          click()
                        }}
                      >
                        {state.soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
                        SOUND {state.soundOn ? 'ON' : 'OFF'}
                      </button>
                      <button type="button" className="btn btn-ghost" onClick={onToggleFullscreen}>
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        {isFullscreen ? 'EXIT FULL SCREEN' : 'PROJECTOR MODE'}
                      </button>
                    </div>
                    <div className="teacher-btn-row">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          dispatch({ type: 'AWARD_TEAMWORK' })
                          playIf(state.soundOn, 'success')
                        }}
                        disabled={state.teamworkAwarded}
                      >
                        <Award size={16} /> {state.teamworkAwarded ? 'TEAMWORK BONUS AWARDED' : 'AWARD TEAMWORK +10'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => {
                          if (!confirmReset) {
                            setConfirmReset(true)
                            return
                          }
                          dispatch({ type: 'RESET' })
                          setConfirmReset(false)
                          onClose()
                        }}
                      >
                        <RotateCcw size={16} /> {confirmReset ? 'CONFIRM RESET GAME' : 'RESET GAME'}
                      </button>
                    </div>
                    {confirmReset && <p className="teacher-warning">Press again to erase the team, timer and scoreboard.</p>}
                  </section>

                  <section className="teacher-card">
                    <div className="teacher-card-head">
                      <h3>
                        <KeyRound size={16} /> FINAL PASSWORD
                      </h3>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => setShowPassword((value) => !value)}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />} {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>
                    <div className="password-reveal">{showPassword ? '4 7 2 9' : '• • • •'}</div>
                    <div className="teacher-btn-row">
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          dispatch({ type: 'REVEAL_PASSWORD' })
                          playIf(state.soundOn, 'success')
                        }}
                        disabled={state.passwordRevealed}
                      >
                        <Eye size={16} /> {state.passwordRevealed ? 'OVERRIDE SHOWN ON LOCK' : 'REVEAL ON LOCK SCREEN'}
                      </button>
                    </div>
                    <p className="teacher-note-small">Only if stuck. Code is fixed: 4729.</p>
                  </section>
                </>
              )}

              {tab === 'missions' && (
                <>
                  <div className="teacher-section-title">
                    <span>MANUAL MISSION CONTROL</span>
                    <button
                      type="button"
                      className="text-btn"
                      onClick={() => {
                        MISSIONS.forEach((mission) => dispatch({ type: 'UNLOCK_MISSION', id: mission.id }))
                        playIf(state.soundOn, 'unlock')
                      }}
                    >
                      <Unlock size={14} /> UNLOCK ALL
                    </button>
                  </div>
                  {MISSIONS.map((mission, index) => {
                    const ms = state.missions[index]
                    return (
                      <section className={`teacher-mission ${ms.completed ? 'done' : ''}`} key={mission.id}>
                        <div className="teacher-mission-head">
                          <span className="tm-station" style={{ background: mission.color }}>
                            {mission.station}
                          </span>
                          <div>
                            <strong>
                              M{mission.id} · {mission.name}
                            </strong>
                            <small>
                              {ms.completed
                                ? `Verified · digit ${mission.digit} · +${mission.points} pts`
                                : ms.unlocked
                                  ? 'Unlocked · waiting for team'
                                  : 'Locked'}
                              {` · hints ${ms.hint}/${mission.hints.length}`}
                            </small>
                          </div>
                          <span className={`tm-status ${ms.completed ? 'done' : ms.unlocked ? 'ready' : ''}`}>
                            {ms.completed ? 'DONE' : ms.unlocked ? 'READY' : 'LOCKED'}
                          </span>
                        </div>
                        <p className="tm-note">{mission.teacherNote}</p>
                        <div className="tm-actions">
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                              dispatch({ type: 'UNLOCK_MISSION', id: mission.id })
                              playIf(state.soundOn, 'unlock')
                            }}
                            disabled={ms.unlocked}
                          >
                            <Unlock size={14} /> {ms.unlocked ? 'UNLOCKED' : 'UNLOCK'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              dispatch({ type: 'VERIFY_MISSION', id: mission.id })
                              playIf(state.soundOn, 'success')
                            }}
                            disabled={ms.completed}
                          >
                            <ShieldCheck size={14} /> {ms.completed ? 'VERIFIED' : `VERIFY +${mission.points}`}
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => {
                              dispatch({ type: 'REVEAL_HINT', id: mission.id })
                              playIf(state.soundOn, 'click')
                            }}
                            disabled={ms.hint >= mission.hints.length}
                          >
                            <Lightbulb size={14} />
                            {ms.hint >= mission.hints.length ? 'HINTS SHOWN' : 'REVEAL HINT'}
                          </button>
                          <span className="tm-digit">DIGIT {ms.completed ? mission.digit : '?'}</span>
                        </div>
                      </section>
                    )
                  })}
                </>
              )}

              {tab === 'teams' && (
                <>
                  <section className="teacher-card">
                    <div className="teacher-card-head">
                      <h3>
                        <Users size={16} /> ADD A TEAM
                      </h3>
                    </div>
                    <form className="add-team-form" onSubmit={addTeam}>
                      <input
                        value={newTeam}
                        onChange={(event) => {
                          setNewTeam(event.target.value)
                          setTeamError('')
                        }}
                        placeholder="Team name"
                        maxLength={28}
                        aria-label="New team name"
                      />
                      <select
                        value={newAvatar}
                        onChange={(event) => setNewAvatar(event.target.value as AvatarId)}
                        aria-label="New team avatar"
                      >
                        {AVATARS.map((avatar) => (
                          <option key={avatar.id} value={avatar.id}>
                            {avatar.emoji} {avatar.name}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="btn btn-primary">
                        <Plus size={16} /> ADD
                      </button>
                    </form>
                    {teamError && <p className="pin-error">{teamError}</p>}
                  </section>

                  <div className="teacher-section-title">
                    <span>
                      LIVE SCOREBOARD · {state.teams.length} {state.teams.length === 1 ? 'TEAM' : 'TEAMS'}
                    </span>
                  </div>
                  <div className="teacher-team-list">
                    {sortedTeams.map((team, index) => {
                      const avatar = AVATARS.find((item) => item.id === team.avatar) ?? AVATARS[0]
                      return (
                        <div className={`teacher-team ${team.isPlayer ? 'player' : ''}`} key={team.id}>
                          <span className="tt-rank">{index + 1}</span>
                          <span className="tt-avatar">{avatar.emoji}</span>
                          <div className="tt-copy">
                            <strong>
                              {team.name} {team.isPlayer && <em>YOUR TEAM</em>}
                            </strong>
                            <small>
                              {team.points} pts · {team.missions} missions
                              {team.finalSolved ? ' · code cracked' : ''}
                            </small>
                          </div>
                          <div className="tt-actions">
                            <button type="button" className="chip-btn" onClick={() => dispatch({ type: 'AWARD_BONUS', teamId: team.id, points: 10 })}>
                              +10
                            </button>
                            <button type="button" className="chip-btn" onClick={() => dispatch({ type: 'AWARD_BONUS', teamId: team.id, points: -5 })}>
                              −5
                            </button>
                            {!team.isPlayer && (
                              <button
                                type="button"
                                className="icon-btn danger"
                                onClick={() => dispatch({ type: 'REMOVE_TEAM', teamId: team.id })}
                                aria-label={`Remove ${team.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <p className="teacher-note-small">
                    Award bonus points. Max normal score 80.
                  </p>
                </>
              )}

              {tab === 'clues' && (
                <>
                  <div className="teacher-section-title">
                    <span>PRINTABLE STATION CLUES</span>
                    <button type="button" className="text-btn" onClick={() => window.print()}>
                      <Printer size={14} /> PRINT CARDS
                    </button>
                  </div>
                  <div className="clue-print-list">
                    {TEACHER_CLUES.map((clue) => (
                      <section className="teacher-clue" key={clue.mission}>
                        <div className="teacher-clue-head">
                          <strong>{clue.title}</strong>
                          <span>{clue.answer}</span>
                        </div>
                        <p className="placement">
                          <b>PLACE AT:</b> {clue.placement}
                        </p>
                        {clue.lines.map((line) => (
                          <p key={line}>{line}</p>
                        ))}
                      </section>
                    ))}
                  </div>
                  <section className="teacher-card setup-guide">
                    <h3>
                      <Timer size={16} /> SET-UP CHECKLIST
                    </h3>
                    <ul>
                      <li>Print the four clue cards and seal them in envelopes A–D.</li>
                      <li>Place Station A front-left, B on the window sill, C on the back bookshelf, D on your desk.</li>
                      <li>Open this game on the projector and one computer per team.</li>
                      <li>Give each team 5 roles and remind them to rotate after each mission.</li>
                      <li>Use the teacher PIN to verify work and reveal digits.</li>
                    </ul>
                  </section>
                  <section className="teacher-card">
                    <div className="teacher-card-head">
                      <h3>
                        <CheckCircle2 size={16} /> TEACHER ANSWER KEY
                      </h3>
                    </div>
                    <div className="answer-key">
                      <p><span>Mission 1</span> Data table correct · Sara’s Science cell is D4 · digit <b>4</b></p>
                      <p><span>Mission 2</span> Bold + fill + borders + width · digit <b>7</b></p>
                      <p><span>Mission 3</span> =SUM(B2:D2), =AVERAGE(B2:D2) · digit <b>2</b></p>
                      <p><span>Mission 4</span> A1:D5 column chart, Sara highest · SARA (4) + 5 · digit <b>9</b></p>
                      <p><span>Final code</span> <b>4 7 2 9</b></p>
                    </div>
                  </section>
                </>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
