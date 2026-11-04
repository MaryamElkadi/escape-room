import { Check, Lock, MapPin } from 'lucide-react'
import { MISSIONS, STATION_POSITIONS } from '../game/content'
import { playIf } from '../game/audio'
import { useGame } from '../game/store'

export function StationMap({ onOpenMission }: { onOpenMission: (id: number) => void }) {
  const { state } = useGame()
  const nextIndex = state.missions.findIndex((mission) => !mission.completed)
  const allDone = nextIndex === -1
  const runner = STATION_POSITIONS[allDone ? 4 : nextIndex + 1]

  return (
    <section className="panel station-map-panel">
      <div className="panel-head">
        <div>
          <span className="eyebrow">CLASSROOM MOVEMENT</span>
          <h2>INVESTIGATION MAP</h2>
        </div>
        <MapPin size={20} className="neon-cyan" />
      </div>

      <div className="station-map" role="group" aria-label="Classroom station map">
        <span className="map-label map-front">FRONT OF CLASSROOM</span>
        <span className="map-label map-door">DOOR</span>
        <span className="map-label map-teacher">TEACHER DESK</span>

        <svg className="map-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 14 22 L 84 48 L 20 80 L 76 16" />
        </svg>

        <div
          className={`map-runner ${allDone ? 'done' : ''}`}
          style={{ left: `${runner.x}%`, top: `${runner.y}%` }}
          aria-hidden="true"
        >
          <span className="runner-ring" />
          <span className="runner-core" />
          <span className="runner-label">{allDone ? 'ALL CLEAR' : 'NEXT'}</span>
        </div>

        {MISSIONS.map((mission, index) => {
          const missionState = state.missions[index]
          const isNext = !missionState.completed && state.missions.findIndex((m) => !m.completed) === index
          const position = STATION_POSITIONS[mission.id]
          return (
            <button
              key={mission.id}
              type="button"
              className={[
                'station-node',
                missionState.completed ? 'completed' : '',
                isNext ? 'active' : '',
                missionState.unlocked ? '' : 'locked',
                position.x > 60 ? 'right-side' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                ['--station-color' as string]: mission.color,
              }}
              onClick={() => {
                if (!missionState.unlocked) return
                playIf(state.soundOn, 'click')
                onOpenMission(mission.id)
              }}
              disabled={!missionState.unlocked}
              aria-label={`Station ${mission.station}, ${mission.stationName}${missionState.completed ? ', completed' : missionState.unlocked ? ', ready' : ', locked'}`}
            >
              <span className="station-pin">
                {missionState.completed ? <Check size={17} /> : !missionState.unlocked ? <Lock size={15} /> : mission.station}
              </span>
              <span className="station-meta">
                <small>STATION {mission.station}</small>
                <strong>{mission.stationName}</strong>
                <em>
                  {missionState.completed
                    ? `Digit ${mission.digit} recovered`
                    : missionState.unlocked
                      ? 'Ready to investigate'
                      : 'Locked'}
                </em>
              </span>
            </button>
          )
        })}
      </div>

      <div className="map-legend">
        <span><i className="legend-dot active" /> NEXT</span>
        <span><i className="legend-dot done" /> DONE</span>
        <span><i className="legend-dot locked" /> LOCKED</span>
        <span className="map-walk">🚶 WALK, DON&apos;T RUN</span>
      </div>
    </section>
  )
}
