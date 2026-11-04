import { FINAL_PASSWORD, TEACHER_CLUES } from '../game/content'

export function PrintClues() {
  return (
    <div className="print-only" aria-hidden="true">
      <header className="print-head">
        <div>
          <h1>EXCEL ESCAPE ROOM · THE MISSING DATA</h1>
          <p>Primary 6 · Printable station clue cards · Cut along the dashed lines.</p>
        </div>
        <span>WALK, DON&apos;T RUN</span>
      </header>

      <div className="print-cards">
        {TEACHER_CLUES.map((clue) => (
          <article className="print-card" key={clue.mission}>
            <div className="print-card-top">
              <span>STATION {clue.station}</span>
              <span>MISSION {clue.mission}</span>
            </div>
            <h2>{clue.title}</h2>
            <div className="print-lines">
              {clue.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="print-card-foot">
              <strong>CODE LOCKED</strong>
              <span>Teacher verifies your Excel work</span>
            </div>
            <p className="print-placement">Teacher: place at {clue.placement}</p>
          </article>
        ))}
      </div>

      <div className="print-teacher">
        <h2>TEACHER SET-UP &amp; ANSWER KEY</h2>
        <div className="print-key-grid">
          <div>
            <h3>Station placement</h3>
            <ol>
              {TEACHER_CLUES.map((clue) => (
                <li key={clue.mission}>
                  <b>Station {clue.station}:</b> {clue.placement}
                </li>
              ))}
            </ol>
            <p>Print one copy of each card. Seal cards in envelopes marked A, B, C and D.</p>
          </div>
          <div>
            <h3>Answers</h3>
            <ul>
              <li>Mission 1: data table correct, Sara’s Science cell D4 → digit 4</li>
              <li>Mission 2: bold, fill, borders, column width → digit 7</li>
              <li>Mission 3: =SUM(B2:D2) and =AVERAGE(B2:D2) → digit 2</li>
              <li>Mission 4: column chart, Sara highest total 285 · SARA (4 letters) + 5 → digit 9</li>
              <li>
                Final password: <b>{FINAL_PASSWORD.join(' ')}</b>
              </li>
            </ul>
            <p>Teacher panel PIN: <b>2468</b> (change in src/game/content.ts).</p>
          </div>
        </div>
        <p className="print-tip">
          Classroom rules: one Navigator per team at a station, whisper-level voices, rotate the
          Computer Captain, and always walk.
        </p>
      </div>
    </div>
  )
}
