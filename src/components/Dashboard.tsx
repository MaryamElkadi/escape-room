import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Footprints,
  KeyRound,
  Lock,
  Paintbrush,
  Sigma,
  Sparkles,
  Table2,
  Trophy,
  Users,
} from 'lucide-react'
import { AVATARS, MISSIONS, ROLES } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'
import { StationMap } from './StationMap'
import { DigitSlot } from './ui'

const MISSION_ICONS = {
  table: Table2,
  paint: Paintbrush,
  formula: Sigma,
  chart: BarChart3,
}

export function Dashboard() {
  const { state, dispatch } = useGame()
  const player = state.teams.find((team) => team.isPlayer)
  const completed = state.missions.filter((mission) => mission.completed).length
  const allDone = completed === 4
  const progress = (completed / 4) * 100
  const sortedTeams = [...state.teams].sort((a, b) => b.points - a.points)
  const rotation = Math.min(completed, 3) + 1
  const nextMission = MISSIONS.find((mission, index) => {
    const missionState = state.missions[index]
    return missionState.unlocked && !missionState.completed
  })

  const openMission = (id: number) => {
    playIf(state.soundOn, 'click')
    dispatch({ type: 'OPEN_MISSION', id })
  }

  return (
    <div className="dashboard">
      <section className="dash-hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={14} /> MISSION CONTROL · {state.teamName}
          </span>
          <h1>
            RECOVER THE <em>MISSING DATA</em>
          </h1>
          <p>Fix 4 Excel tasks. Collect 4 digits. Open the final lock.</p>
          <div className="hero-progress">
            <div className="hero-progress-top">
              <span>DATA RECOVERY PROGRESS</span>
              <strong>{completed}/4 MISSIONS</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="hero-stats">
            <div>
              <small>MISSIONS</small>
              <strong>{completed}/4</strong>
            </div>
            <div>
              <small>DIGITS</small>
              <strong>{completed}/4</strong>
            </div>
            <div>
              <small>TEAM SCORE</small>
              <strong>{player?.points ?? 0}</strong>
            </div>
          </div>
        </div>
        <div className="hero-radar" aria-hidden="true">
          <div className="radar-ring ring-1" />
          <div className="radar-ring ring-2" />
          <div className="radar-ring ring-3" />
          <div className="radar-sweep" />
          <div className="radar-center">
            <Lock size={30} />
            <span>{allDone ? 'CODE READY' : 'LOCKED'}</span>
          </div>
          <span className="radar-blip blip-1" />
          <span className="radar-blip blip-2" />
          <span className="radar-blip blip-3" />
        </div>
      </section>

      <section className={`next-step ${allDone ? 'ready' : ''}`} style={nextMission ? { ['--mission-color' as string]: nextMission.color } : undefined}>
        <div className="next-step-copy">
          <span className="eyebrow">{allDone ? 'FINAL STEP' : 'YOUR NEXT STEP'}</span>
          <h2>
            {allDone
              ? 'All 4 digits found'
              : `Station ${nextMission?.station} · ${nextMission?.name}`}
          </h2>
          <p>{allDone ? 'Open the master lock and enter the code.' : nextMission?.brief}</p>
        </div>
        <button
          type="button"
          className={`btn ${allDone ? 'btn-danger' : 'btn-primary'} btn-xl`}
          onClick={() => {
            playIf(state.soundOn, 'click')
            if (allDone) dispatch({ type: 'SET_VIEW', view: 'lock' })
            else if (nextMission) dispatch({ type: 'OPEN_MISSION', id: nextMission.id })
          }}
        >
          {allDone ? (
            <>
              <KeyRound size={18} /> OPEN FINAL LOCK
            </>
          ) : (
            <>
              START MISSION <ArrowRight size={18} />
            </>
          )}
        </button>
      </section>

      <div className="dash-grid">
        <div className="dash-main">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ACTIVE INVESTIGATION</span>
              <h2>YOUR FOUR MISSIONS</h2>
            </div>
            <span className="walk-chip">
              <Footprints size={15} /> WALK, DON&apos;T RUN
            </span>
          </div>

          <div className="mission-grid">
            {MISSIONS.map((mission, index) => {
              const missionState = state.missions[index]
              const Icon = MISSION_ICONS[mission.icon]
              const locked = !missionState.unlocked
              const isNext = !missionState.completed && missionState.unlocked
              return (
                <article
                  key={mission.id}
                  className={`mission-card ${missionState.completed ? 'completed' : ''} ${locked ? 'locked' : ''} ${isNext ? 'next' : ''}`}
                  style={{ ['--mission-color' as string]: mission.color }}
                >
                  <div className="mission-card-top">
                    <span className="station-chip">STATION {mission.station}</span>
                    <span className={`status-chip ${missionState.completed ? 'done' : locked ? 'locked' : 'ready'}`}>
                      {missionState.completed ? (
                        <>
                          <CheckCircle2 size={13} /> COMPLETE
                        </>
                      ) : locked ? (
                        <>
                          <Lock size={13} /> LOCKED
                        </>
                      ) : (
                        <>
                          <span className="live-dot" /> READY
                        </>
                      )}
                    </span>
                  </div>
                  <div className="mission-icon">
                    <Icon size={26} />
                  </div>
                  <h3>
                    <span>MISSION {mission.id}</span>
                    {mission.name}
                  </h3>
                  <p className="mission-topic">{mission.topic}</p>
                  <p className="mission-desc">{mission.brief}</p>
                  <div className="mission-card-foot">
                    <span className="points-chip">+{mission.points} PTS</span>
                    {missionState.completed ? (
                      <span className="digit-chip">DIGIT {mission.digit}</span>
                    ) : locked ? (
                      <span className="unlock-note">Finish Mission {mission.id - 1}</span>
                    ) : (
                      <span className="digit-chip pending">DIGIT ?</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`btn mission-open ${missionState.completed ? 'btn-ghost' : 'btn-primary'}`}
                    onClick={() => openMission(mission.id)}
                    disabled={locked}
                  >
                    {missionState.completed ? 'REVIEW MISSION' : locked ? 'LOCKED' : 'OPEN MISSION'}
                    {!locked && <ArrowRight size={17} />}
                  </button>
                </article>
              )
            })}
          </div>

          <section className="panel roles-panel">
            <div className="panel-head">
              <div>
                <span className="eyebrow">TEAMWORK SYSTEM</span>
                <h2>
                  <Users size={18} /> ROTATION {String(rotation).padStart(2, '0')} · CREW ROLES
                </h2>
              </div>
              <span className="rotation-note">Swap one role after each mission</span>
            </div>
            <div className="roles-list">
              {ROLES.map((role) => (
                <div className="role-pill" key={role.name}>
                  <span>{role.icon}</span>
                  <div>
                    <strong>{role.name}</strong>
                    <small>{role.job}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="dash-side">
          <StationMap onOpenMission={openMission} />

          <section className="panel digit-vault">
            <div className="panel-head">
              <div>
                <span className="eyebrow">EVIDENCE LOCKER</span>
                <h2>SECRET DIGITS</h2>
              </div>
              <KeyRound size={19} className="neon-green" />
            </div>
            <div className="digit-vault-row">
              {MISSIONS.map((mission) => (
                <DigitSlot
                  key={mission.id}
                  value={state.digits[mission.id]}
                  label={`M${mission.id}`}
                  active={!state.digits[mission.id] && mission.id === completed + 1}
                />
              ))}
            </div>
            <p className="vault-hint">
              {allDone ? 'All 4 digits found. Open the lock.' : 'One digit per mission. Keep the order.'}
            </p>
          </section>

          <section className={`final-lock-card ${allDone ? 'ready' : ''}`}>
            <div className="final-lock-head">
              <span className="eyebrow">FINAL ESCAPE CHALLENGE</span>
              <h2>MASTER LOCK</h2>
              <p>
                {allDone
                  ? 'Enter the 4 digits in mission order.'
                  : 'Find all 4 digits first.'}
              </p>
            </div>
            <div className="lock-mini" aria-hidden="true">
              {MISSIONS.map((mission) => (
                <span key={mission.id} className={state.digits[mission.id] ? 'filled' : ''}>
                  {state.digits[mission.id] ?? '·'}
                </span>
              ))}
            </div>
            <button
              type="button"
              className={`btn ${allDone ? 'btn-danger' : 'btn-ghost'} btn-block`}
              disabled={!allDone}
              onClick={() => {
                playIf(state.soundOn, 'click')
                dispatch({ type: 'SET_VIEW', view: 'lock' })
              }}
            >
              {allDone ? (
                <>
                  <KeyRound size={18} /> OPEN FINAL LOCK
                </>
              ) : (
                <>
                  <Lock size={18} /> LOCKED · {completed}/4 DIGITS
                </>
              )}
            </button>
          </section>

          <section className="panel mini-scoreboard">
            <div className="panel-head">
              <div>
                <span className="eyebrow">LIVE CLASS RANKING</span>
                <h2>
                  <Trophy size={18} /> SCOREBOARD
                </h2>
              </div>
              <button
                type="button"
                className="text-btn"
                onClick={() => {
                  playIf(state.soundOn, 'click')
                  dispatch({ type: 'SET_VIEW', view: 'scoreboard' })
                }}
              >
                VIEW ALL <ArrowRight size={14} />
              </button>
            </div>
            <div className="mini-rank">
              {sortedTeams.slice(0, 4).map((team, index) => {
                const avatar = AVATARS.find((item) => item.id === team.avatar)?.emoji ?? '🦊'
                return (
                  <div className={`mini-rank-row ${team.isPlayer ? 'player' : ''}`} key={team.id}>
                    <span className="rank-num">{index + 1}</span>
                    <div className="rank-copy">
                      <strong>
                        {team.isPlayer ? 'YOUR TEAM · ' : ''}
                        {team.name}
                      </strong>
                      <div className="rank-track">
                        <span style={{ width: `${Math.min(100, (team.points / 80) * 100)}%` }} />
                      </div>
                    </div>
                    <span className="rank-avatar">{avatar}</span>
                    <strong className="rank-points">{team.points}</strong>
                  </div>
                )
              })}
            </div>
            <p className="vault-hint">Teacher panel → Teams: add teams and bonus points.</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
