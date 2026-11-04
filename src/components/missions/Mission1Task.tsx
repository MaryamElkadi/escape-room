import { useState } from 'react'
import { Check, CircleAlert, Database, Grid2X2, RotateCcw } from 'lucide-react'
import { playIf } from '../../game/audio'

interface TaskProps {
  solved: boolean
  soundOn: boolean
  onSolved: () => void
}

const STUDENTS = ['Lina', 'Omar', 'Sara', 'Adam']
const HEADINGS = ['Student', 'English', 'Math', 'Science']
const ANSWERS: Record<string, number[]> = {
  Lina: [85, 90, 88],
  Omar: [72, 80, 75],
  Sara: [95, 92, 98],
  Adam: [60, 70, 65],
}
const EMPTY = Object.fromEntries(STUDENTS.map((student) => [student, ['', '', '']])) as Record<
  string,
  string[]
>

export function Mission1Task({ solved, soundOn, onSolved }: TaskProps) {
  const [values, setValues] = useState<Record<string, string[]>>(EMPTY)
  const [step, setStep] = useState<'data' | 'cell'>('data')
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState<'good' | 'error' | ''>('')
  const [selected, setSelected] = useState('')
  const [wrongCell, setWrongCell] = useState('')

  const update = (student: string, index: number, value: string) => {
    setValues((current) => ({
      ...current,
      [student]: current[student].map((cell, i) => (i === index ? value.replace(/[^0-9]/g, '').slice(0, 3) : cell)),
    }))
    setMessage('')
    setTone('')
  }

  const checkData = () => {
    const missing: string[] = []
    const wrong: string[] = []
    STUDENTS.forEach((student, rowIndex) => {
      ANSWERS[student].forEach((answer, colIndex) => {
        const raw = values[student][colIndex].trim()
        if (!raw) missing.push(`${student} ${HEADINGS[colIndex + 1]}`)
        else if (Number(raw) !== answer) wrong.push(`${student} ${HEADINGS[colIndex + 1]} (row ${rowIndex + 2})`)
      })
    })

    if (missing.length) {
      setTone('error')
      setMessage(`${missing.length} cell${missing.length > 1 ? 's are' : ' is'} still empty. Use the clue card.`)
      playIf(soundOn, 'error')
      return
    }
    if (wrong.length) {
      setTone('error')
      setMessage(`Check ${wrong.length} mark${wrong.length > 1 ? 's' : ''}: ${wrong.join(', ')}. Marks must match the clue exactly.`)
      playIf(soundOn, 'error')
      return
    }
    setStep('cell')
    setTone('good')
    setMessage('Table rebuilt! Now identify the cell that holds Sara’s Science mark.')
    playIf(soundOn, 'success')
  }

  const pickCell = (address: string) => {
    setSelected(address)
    if (address === 'D4') {
      setWrongCell('')
      setTone('good')
      setMessage('Correct! D4 = column D, row 4. Sara’s Science mark is 98.')
      playIf(soundOn, 'success')
      onSolved()
    } else {
      setWrongCell(address)
      setTone('error')
      setMessage(`${address} is not Sara’s Science cell. Remember: column letter first, then row number.`)
      playIf(soundOn, 'error')
    }
  }

  const clearAll = () => {
    setValues(EMPTY)
    setMessage('')
    setTone('')
    setStep('data')
    setSelected('')
    setWrongCell('')
    playIf(soundOn, 'click')
  }

  if (solved) {
    return (
      <div className="task-solved">
        <div className="task-solved-icon">
          <Check size={30} />
        </div>
        <h3>DATA TABLE REBUILT</h3>
        <p>The records are back. You identified cell D4 as Sara’s Science mark.</p>
        <div className="mini-table">
          <div className="mini-row head">
            {HEADINGS.map((heading) => (
              <span key={heading}>{heading}</span>
            ))}
          </div>
          {STUDENTS.map((student) => (
            <div className="mini-row" key={student}>
              <span>{student}</span>
              {ANSWERS[student].map((mark) => (
                <span key={mark}>{mark}</span>
              ))}
            </div>
          ))}
        </div>
        <span className="task-done-chip">
          <Database size={14} /> + CELL ADDRESS CONFIRMED
        </span>
      </div>
    )
  }

  return (
    <div className="task-body">
      <div className="task-step-row">
        <span className={`task-step ${step === 'data' ? 'active' : 'done'}`}>1 · ENTER THE DATA</span>
        <span className={`task-step ${step === 'cell' ? 'active' : ''}`}>2 · FIND THE CELL</span>
      </div>

      {step === 'data' ? (
        <>
          <p className="task-instruction">
            Type the marks from the clue card (left). Headings are already in row 1.
          </p>
          <div className="sheet-wrap">
            <div className="sheet-scroll">
              <table className="excel-grid">
                <thead>
                  <tr>
                    <th className="corner" />
                    {['A', 'B', 'C', 'D'].map((letter) => (
                      <th key={letter} className="col-head">
                        {letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="row-head">1</th>
                    {HEADINGS.map((heading) => (
                      <td key={heading} className="grid-heading">
                        {heading}
                      </td>
                    ))}
                  </tr>
                  {STUDENTS.map((student) => (
                    <tr key={student}>
                      <th className="row-head">{STUDENTS.indexOf(student) + 2}</th>
                      <td className="grid-name">{student}</td>
                      {[0, 1, 2].map((index) => (
                        <td key={index} className="grid-input-cell">
                          <input
                            value={values[student][index]}
                            onChange={(event) => update(student, index, event.target.value)}
                            inputMode="numeric"
                            aria-label={`${student} ${HEADINGS[index + 1]} mark`}
                            className="grid-input"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="task-actions">
            <button type="button" className="btn btn-primary" onClick={checkData}>
              <Grid2X2 size={17} /> CHECK MY TABLE
            </button>
            <button type="button" className="btn btn-ghost" onClick={clearAll}>
              <RotateCcw size={15} /> CLEAR
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="task-instruction">
            Click the cell that contains <strong>Sara’s Science mark</strong>. The selected address
            appears below the grid.
          </p>
          <div className="sheet-wrap">
            <div className="sheet-scroll">
              <table className="excel-grid selectable">
                <thead>
                  <tr>
                    <th className="corner" />
                    {['A', 'B', 'C', 'D'].map((letter) => (
                      <th key={letter} className="col-head">
                        {letter}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th className="row-head">1</th>
                    {HEADINGS.map((heading) => (
                      <td key={heading} className="grid-heading">
                        {heading}
                      </td>
                    ))}
                  </tr>
                  {STUDENTS.map((student, rowIndex) => (
                    <tr key={student}>
                      <th className="row-head">{rowIndex + 2}</th>
                      <td className="grid-name">{student}</td>
                      {ANSWERS[student].map((mark, colIndex) => {
                        const address = `${String.fromCharCode(66 + colIndex)}${rowIndex + 2}`
                        return (
                          <td
                            key={address}
                            className={`grid-cell-btn ${selected === address ? 'selected' : ''} ${wrongCell === address ? 'wrong' : ''}`}
                          >
                            <button type="button" onClick={() => pickCell(address)} aria-label={`Cell ${address}, value ${mark}`}>
                              {mark}
                            </button>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cell-address">
            NAME BOX <strong>{selected || '—'}</strong>
            {selected === 'D4' && <span className="cell-good">✓ correct cell</span>}
          </div>
        </>
      )}

      {message && (
        <div className={`task-message ${tone}`}>
          {tone === 'good' ? <Check size={16} /> : <CircleAlert size={16} />}
          {message}
        </div>
      )}
    </div>
  )
}
