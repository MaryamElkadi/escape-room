import { ArrowLeft, CheckCircle2, Crown, Trophy, Users } from 'lucide-react'
import { AVATARS, MAX_SCORE } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'

export function Scoreboard() {
  const { state, dispatch } = useGame()
  const sorted = [...state.teams].sort((a, b) => b.points - a.points || b.missions - a.missions)

  return (
    <div className="scoreboard-screen">
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

      <header className="scoreboard-head">
        <span className="eyebrow">
          <Trophy size={15} /> LIVE CLASS RANKING
        </span>
        <h1>
          INVESTIGATION <span>SCOREBOARD</span>
        </h1>
        <p>Highest score wins the recovery contract.</p>
      </header>

      <div className="scoreboard-summary">
        <div>
          <small>TEAMS ONLINE</small>
          <strong>{state.teams.length}</strong>
        </div>
        <div>
          <small>YOUR SCORE</small>
          <strong>{state.teams.find((team) => team.isPlayer)?.points ?? 0}</strong>
        </div>
        <div>
          <small>MAX POSSIBLE</small>
          <strong>{MAX_SCORE}</strong>
        </div>
        <div>
          <small>DIGITS RECOVERED</small>
          <strong>{Object.keys(state.digits).length}/4</strong>
        </div>
      </div>

      <section className="scoreboard-list">
        {sorted.map((team, index) => {
          const avatar = AVATARS.find((item) => item.id === team.avatar) ?? AVATARS[0]
          const width = Math.min(100, (team.points / MAX_SCORE) * 100)
          return (
            <div
              key={team.id}
              className={`score-row ${team.isPlayer ? 'player' : ''} ${index === 0 ? 'leader' : ''}`}
            >
              <div className="score-rank">
                {index === 0 ? <Crown size={22} /> : <span>{index + 1}</span>}
              </div>
              <div className="score-avatar">{avatar.emoji}</div>
              <div className="score-info">
                <div className="score-name">
                  <strong>{team.name}</strong>
                  {team.isPlayer && <span className="you-chip">YOUR TEAM</span>}
                  {team.finalSolved && (
                    <span className="solved-chip">
                      <CheckCircle2 size={12} /> SYSTEM RESTORED
                    </span>
                  )}
                </div>
                <div className="score-bar">
                  <span style={{ width: `${width}%` }} />
                </div>
                <div className="score-meta">
                  <span>{team.missions} mission{team.missions === 1 ? '' : 's'} verified</span>
                  <span>{team.points} / {MAX_SCORE} pts</span>
                </div>
              </div>
              <div className="score-points">
                <strong>{team.points}</strong>
                <small>PTS</small>
              </div>
            </div>
          )
        })}
      </section>

      <div className="score-legend">
        <span><Users size={15} /> Teacher panel → Teams to add teams and bonus points.</span>
        <span>Points: 10 + 10 + 20 + 20 · Teamwork +10 · Final code +10</span>
      </div>
    </div>
  )
}
