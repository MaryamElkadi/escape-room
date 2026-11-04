import { useState, type FormEvent } from 'react'
import { ArrowRight, Footprints, ShieldCheck, Users } from 'lucide-react'
import { AVATARS, ROLES } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'
import type { AvatarId } from '../game/types'

export function TeamSetup() {
  const { state, dispatch } = useGame()
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<AvatarId>('fox')
  const [error, setError] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!name.trim()) {
      setError('Give your investigation team a name first.')
      playIf(state.soundOn, 'error')
      return
    }
    playIf(state.soundOn, 'unlock')
    dispatch({ type: 'CREATETEAM', name, avatar })
  }

  return (
    <div className="setup-screen">
      <div className="setup-grid-bg" aria-hidden="true" />
      <div className="setup-shell">
        <header className="setup-head">
          <div className="setup-badge">
            <ShieldCheck size={18} /> CLEARANCE GRANTED · TEAM REGISTRATION
          </div>
          <h1>
            INVESTIGATION <span>TEAMS</span>
          </h1>
          <p>Name your team, pick an avatar, start the mission.</p>
        </header>

        <form className="setup-form" onSubmit={submit}>
          <div className="setup-left">
            <label className="field-label" htmlFor="teamName">
              01 · TEAM NAME
            </label>
            <input
              id="teamName"
              className={`team-input ${error ? 'has-error' : ''}`}
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="e.g. The Data Defenders"
              maxLength={28}
              autoComplete="off"
              autoFocus
            />
            {error && <p className="field-error">{error}</p>}

            <div className="field-label">02 · TEAM IDENTITY</div>
            <div className="avatar-grid" role="radiogroup" aria-label="Choose team identity">
              {AVATARS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="radio"
                  aria-checked={avatar === item.id}
                  className={`avatar-card ${avatar === item.id ? 'selected' : ''}`}
                  onClick={() => {
                    setAvatar(item.id)
                    playIf(state.soundOn, 'click')
                  }}
                >
                  <span className="avatar-emoji">{item.emoji}</span>
                  <span className="avatar-name">{item.name}</span>
                  <span className="avatar-tag">{item.tag}</span>
                  {avatar === item.id && <span className="avatar-check">✓</span>}
                </button>
              ))}
            </div>

            <button type="submit" className="btn btn-primary btn-xl setup-start">
              LAUNCH MISSION CONTROL <ArrowRight size={20} />
            </button>
          </div>

          <aside className="setup-right">
            <div className="brief-card">
              <h2>
                <Users size={18} /> YOUR CREW OF 5
              </h2>
              <div className="role-preview">
                {ROLES.map((role, index) => (
                  <div className="role-row" key={role.name}>
                    <span className="role-index">{String(index + 1).padStart(2, '0')}</span>
                    <span className="role-icon">{role.icon}</span>
                    <div>
                      <strong>{role.name}</strong>
                      <p>{role.job}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="rotate-note">Rotate roles after every mission. Everyone gets a turn.</p>
            </div>

            <div className="rules-card">
              <h2>
                <Footprints size={18} /> LAB RULES
              </h2>
              <ul>
                <li>Walk, never run.</li>
                <li>One Navigator leaves the computer at a time.</li>
                <li>Whisper-level voices.</li>
                <li>Hints are free.</li>
              </ul>
            </div>
          </aside>
        </form>
      </div>
    </div>
  )
}
