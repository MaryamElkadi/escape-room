import { useState } from 'react'
import { Calculator, Check, CircleAlert, Sigma } from 'lucide-react'
import { playIf } from '../../game/audio'

interface TaskProps {
  solved: boolean
  soundOn: boolean
  onSolved: () => void
}

const TOTAL_OPTIONS = [253, 263, 273]
const AVERAGE_OPTIONS = ['85.0', '87.7', '92.5']
const RESULTS = [
  { name: 'Lina', total: 263, average: '87.7' },
  { name: 'Omar', total: 227, average: '75.7' },
  { name: 'Sara', total: 285, average: '95.0' },
  { name: 'Adam', total: 195, average: '65.0' },
]

export function Mission3Task({ solved, soundOn, onSolved }: TaskProps) {
  const [step, setStep] = useState<'predict' | 'formula'>('predict')
  const [totalGuess, setTotalGuess] = useState<number | null>(null)
  const [averageGuess, setAverageGuess] = useState<string | null>(null)
  const [sumFormula, setSumFormula] = useState('')
  const [averageFormula, setAverageFormula] = useState('')
  const [activeField, setActiveField] = useState<'sum' | 'average'>('sum')
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState<'good' | 'error' | ''>('')

  const checkPrediction = () => {
    if (totalGuess === null || averageGuess === null) {
      setTone('error')
      setMessage('Choose both predictions before checking.')
      playIf(soundOn, 'error')
      return
    }
    if (totalGuess !== 263) {
      setTone('error')
      setMessage('The total is not right. Add 85 + 90 + 88 carefully.')
      playIf(soundOn, 'error')
      return
    }
    if (averageGuess !== '87.7') {
      setTone('error')
      setMessage('The average is not right. Divide the total by 3, then round to 1 decimal place.')
      playIf(soundOn, 'error')
      return
    }
    setStep('formula')
    setTone('good')
    setMessage('Prediction correct! Now make Excel do the work.')
    playIf(soundOn, 'success')
  }

  const appendFormula = (text: string) => {
    if (activeField === 'sum') setSumFormula((value) => value + text)
    else setAverageFormula((value) => value + text)
    setMessage('')
    setTone('')
    playIf(soundOn, 'click')
  }

  const checkFormulas = () => {
    const normal = (value: string) => value.toUpperCase().replace(/\s+/g, '')
    if (normal(sumFormula) !== '=SUM(B2:D2)') {
      setTone('error')
      setMessage('The total formula needs =SUM(B2:D2). Check the function name and the range.')
      playIf(soundOn, 'error')
      return
    }
    if (normal(averageFormula) !== '=AVERAGE(B2:D2)') {
      setTone('error')
      setMessage('The average formula needs =AVERAGE(B2:D2). AVERAGE divides by the number of cells.')
      playIf(soundOn, 'error')
      return
    }
    setTone('good')
    setMessage('Formula engine online! Total 263 · Average 87.7.')
    playIf(soundOn, 'success')
    onSolved()
  }

  if (solved) {
    return (
      <div className="task-solved">
        <div className="task-solved-icon">
          <Check size={30} />
        </div>
        <h3>FORMULA ENGINE ONLINE</h3>
        <p>=SUM(B2:D2) adds the range. =AVERAGE(B2:D2) divides by 3.</p>
        <div className="result-table">
          <div className="result-row head">
            <span>Student</span>
            <span>Total</span>
            <span>Average</span>
          </div>
          {RESULTS.map((row) => (
            <div className="result-row" key={row.name}>
              <span>{row.name}</span>
              <span>{row.total}</span>
              <span>{row.average}</span>
            </div>
          ))}
        </div>
        <span className="task-done-chip">
          <Sigma size={14} /> FORMULAS VERIFIED
        </span>
      </div>
    )
  }

  return (
    <div className="task-body">
      <div className="task-step-row">
        <span className={`task-step ${step === 'predict' ? 'active' : 'done'}`}>1 · PREDICT</span>
        <span className={`task-step ${step === 'formula' ? 'active' : ''}`}>2 · TYPE THE FORMULA</span>
      </div>

      {step === 'predict' ? (
        <>
          <p className="task-instruction">
            Before touching Excel, predict the answer for <strong>Lina</strong>. Use the clue card.
          </p>

          <div className="predict-block">
            <span className="predict-label">Lina’s TOTAL · 85 + 90 + 88 = ?</span>
            <div className="option-row">
              {TOTAL_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${totalGuess === option ? 'selected' : ''}`}
                  onClick={() => {
                    setTotalGuess(option)
                    setMessage('')
                    setTone('')
                    playIf(soundOn, 'click')
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="predict-block">
            <span className="predict-label">Lina’s AVERAGE · total ÷ 3 = ?</span>
            <div className="option-row">
              {AVERAGE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${averageGuess === option ? 'selected' : ''}`}
                  onClick={() => {
                    setAverageGuess(option)
                    setMessage('')
                    setTone('')
                    playIf(soundOn, 'click')
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn-primary" onClick={checkPrediction}>
            <Calculator size={17} /> CHECK PREDICTION
          </button>
        </>
      ) : (
        <>
          <p className="task-instruction">
            Type the two formulas Excel needs. Start with <strong>=</strong> and use the range{' '}
            <strong>B2:D2</strong>.
          </p>

          <label className="formula-field">
            <span>E2 · TOTAL FORMULA</span>
            <div className="formula-input-wrap">
              <span className="fx">fx</span>
              <input
                value={sumFormula}
                onFocus={() => setActiveField('sum')}
                onChange={(event) => {
                  setSumFormula(event.target.value)
                  setMessage('')
                  setTone('')
                }}
                placeholder="=FUNCTION(B2:D2)"
                spellCheck={false}
                autoCapitalize="characters"
                aria-label="Total formula"
              />
            </div>
          </label>

          <label className="formula-field">
            <span>F2 · AVERAGE FORMULA</span>
            <div className="formula-input-wrap">
              <span className="fx">fx</span>
              <input
                value={averageFormula}
                onFocus={() => setActiveField('average')}
                onChange={(event) => {
                  setAverageFormula(event.target.value)
                  setMessage('')
                  setTone('')
                }}
                placeholder="=FUNCTION(B2:D2)"
                spellCheck={false}
                autoCapitalize="characters"
                aria-label="Average formula"
              />
            </div>
          </label>

          <div className="formula-shortcuts">
            <span>Build into the selected box:</span>
            <button type="button" onClick={() => appendFormula('=SUM(')}>
              =SUM(
            </button>
            <button type="button" onClick={() => appendFormula('=AVERAGE(')}>
              =AVERAGE(
            </button>
            <button type="button" onClick={() => appendFormula('B2:D2')}>
              B2:D2
            </button>
            <button type="button" onClick={() => appendFormula(')')}>
              )
            </button>
          </div>

          <button type="button" className="btn btn-primary" onClick={checkFormulas}>
            <Sigma size={17} /> TEST FORMULAS
          </button>
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
