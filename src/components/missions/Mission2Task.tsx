import { useState } from 'react'
import {
  Bold,
  Check,
  CircleAlert,
  Grid3X3,
  MoveHorizontal,
  PaintBucket,
  Paintbrush,
  RotateCcw,
} from 'lucide-react'
import { playIf } from '../../game/audio'

interface TaskProps {
  solved: boolean
  soundOn: boolean
  onSolved: () => void
}

const ROWS = [
  ['Lina', '85', '90', '88'],
  ['Omar', '72', '80', '75'],
  ['Sara', '95', '92', '98'],
  ['Adam', '60', '70', '65'],
]

type StyleKey = 'bold' | 'fill' | 'borders' | 'wide'

export function Mission2Task({ solved, soundOn, onSolved }: TaskProps) {
  const [styles, setStyles] = useState<Record<StyleKey, boolean>>({
    bold: solved,
    fill: solved,
    borders: solved,
    wide: solved,
  })
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState<'good' | 'error' | ''>('')

  const toggle = (key: StyleKey) => {
    if (solved) return
    setStyles((current) => ({ ...current, [key]: !current[key] }))
    setMessage('')
    setTone('')
    playIf(soundOn, 'click')
  }

  const check = () => {
    const missing = (Object.keys(styles) as StyleKey[]).filter((key) => !styles[key])
    if (missing.length) {
      const labels: Record<StyleKey, string> = {
        bold: 'bold headings',
        fill: 'heading fill colour',
        borders: 'cell borders',
        wide: 'wider columns',
      }
      setTone('error')
      setMessage(`Not yet. Still missing: ${missing.map((key) => labels[key]).join(', ')}.`)
      playIf(soundOn, 'error')
      return
    }
    setTone('good')
    setMessage('Formatting repaired! The report is clear, bold, boxed and readable.')
    playIf(soundOn, 'success')
    onSolved()
  }

  const reset = () => {
    setStyles({ bold: false, fill: false, borders: false, wide: false })
    setMessage('')
    setTone('')
    playIf(soundOn, 'click')
  }

  const tableClass = [
    'format-table',
    styles.bold ? 'is-bold' : '',
    styles.fill ? 'is-filled' : '',
    styles.borders ? 'is-bordered' : '',
    styles.wide ? 'is-wide' : '',
  ].join(' ')

  return (
    <div className="task-body">
      <div className="format-lab">
        <div className="ribbon">
          <div className="ribbon-tabs">
            <span>HOME</span>
            <span>INSERT</span>
            <span>DATA</span>
          </div>
          <div className="ribbon-tools">
            <button
              type="button"
              className={`ribbon-btn ${styles.bold ? 'active' : ''}`}
              onClick={() => toggle('bold')}
              aria-pressed={styles.bold}
              title="Bold headings"
            >
              <Bold size={18} />
              <span>Bold</span>
            </button>
            <button
              type="button"
              className={`ribbon-btn fill ${styles.fill ? 'active' : ''}`}
              onClick={() => toggle('fill')}
              aria-pressed={styles.fill}
              title="Fill headings green"
            >
              <PaintBucket size={18} />
              <span>Fill</span>
            </button>
            <button
              type="button"
              className={`ribbon-btn ${styles.borders ? 'active' : ''}`}
              onClick={() => toggle('borders')}
              aria-pressed={styles.borders}
              title="Add borders"
            >
              <Grid3X3 size={18} />
              <span>Borders</span>
            </button>
            <button
              type="button"
              className={`ribbon-btn ${styles.wide ? 'active' : ''}`}
              onClick={() => toggle('wide')}
              aria-pressed={styles.wide}
              title="Widen columns"
            >
              <MoveHorizontal size={18} />
              <span>Width</span>
            </button>
          </div>
        </div>

        <div className="format-preview">
          <span className="preview-label">LIVE SHEET PREVIEW · {Object.values(styles).filter(Boolean).length}/4 REPAIRS</span>
          <div className="format-scroll">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>English</th>
                  <th>Math</th>
                  <th>Science</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${index}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="preview-tip">
            Toggle each tool, then run the repair check. The preview is your before-and-after proof.
          </p>
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="btn btn-primary" onClick={check} disabled={solved}>
          <Paintbrush size={17} /> RUN FORMAT CHECK
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset} disabled={solved}>
          <RotateCcw size={15} /> RESET
        </button>
      </div>

      {solved && (
        <div className="task-solved compact">
          <Check size={22} />
          <div>
            <h3>FORMATTING VIRUS CONTAINED</h3>
            <p>Bold + fill + borders + wide columns are all repaired.</p>
          </div>
        </div>
      )}

      {message && !solved && (
        <div className={`task-message ${tone}`}>
          {tone === 'good' ? <Check size={16} /> : <CircleAlert size={16} />}
          {message}
        </div>
      )}
    </div>
  )
}
