import { useState } from 'react'
import {
  BarChart3,
  Check,
  CircleAlert,
  LineChart,
  PieChart,
  Table2,
  Trophy,
} from 'lucide-react'
import { playIf } from '../../game/audio'

interface TaskProps {
  solved: boolean
  soundOn: boolean
  onSolved: () => void
}

const RANGE_OPTIONS = [
  { value: 'A1:A5', label: 'A1:A5 · names only' },
  { value: 'A1:D5', label: 'A1:D5 · names + all marks' },
  { value: 'C1:D5', label: 'C1:D5 · marks only' },
]
const CHART_OPTIONS = [
  { value: 'column', label: 'Column', icon: BarChart3 },
  { value: 'pie', label: 'Pie', icon: PieChart },
  { value: 'line', label: 'Line', icon: LineChart },
]
const TITLE_OPTIONS = ['Student Marks Comparison', 'My Chart', 'Marks']
const WINNER_OPTIONS = ['Lina', 'Omar', 'Sara', 'Adam']
const CHART_DATA = [
  { name: 'Lina', marks: [85, 90, 88] },
  { name: 'Omar', marks: [72, 80, 75] },
  { name: 'Sara', marks: [95, 92, 98] },
  { name: 'Adam', marks: [60, 70, 65] },
]

export function Mission4Task({ solved, soundOn, onSolved }: TaskProps) {
  const [range, setRange] = useState<string | null>(null)
  const [chart, setChart] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [winner, setWinner] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [tone, setTone] = useState<'good' | 'error' | ''>('')

  const say = (nextTone: 'good' | 'error', text: string) => {
    setTone(nextTone)
    setMessage(text)
    playIf(soundOn, nextTone === 'good' ? 'success' : 'error')
  }

  const chooseRange = (value: string) => {
    if (value === 'A1:D5') {
      setRange(value)
      say('good', 'Range locked: A1:D5 includes the names and all three mark columns.')
    } else {
      say('error', 'That range leaves out important data. You need student names AND all three marks.')
    }
  }

  const chooseChart = (value: string) => {
    if (value === 'column') {
      setChart(value)
      say('good', 'Column chart selected. It compares marks side by side.')
    } else {
      say('error', 'For comparing marks across students, a column chart is the clearest choice.')
    }
  }

  const chooseTitle = (value: string) => {
    if (value === 'Student Marks Comparison') {
      setTitle(value)
      say('good', 'Strong chart title: it tells the reader exactly what the chart shows.')
    } else {
      say('error', 'A chart title should be clear and descriptive. Which option explains the chart best?')
    }
  }

  const chooseWinner = (value: string) => {
    if (value === 'Sara') {
      setWinner(value)
      say('good', 'Correct! Sara has the highest total: 95 + 92 + 98 = 285.')
      onSolved()
    } else {
      say('error', 'Add each student’s row. The tallest total is not this student.')
    }
  }

  const stepDone = solved
    ? [true, true, true, true]
    : [Boolean(range), Boolean(chart), Boolean(title), Boolean(winner)]

  return (
    <div className="task-body">
      <div className="mission4-steps">
        {['RANGE', 'CHART', 'TITLE', 'READ THE DATA'].map((label, index) => (
          <span key={label} className={`m4-step ${stepDone[index] ? 'done' : ''}`}>
            <b>{stepDone[index] ? <Check size={12} /> : index + 1}</b>
            {label}
          </span>
        ))}
      </div>

      {solved ? (
        <div className="task-solved compact green">
          <Check size={24} />
          <div>
            <h3>FINAL CHART DECODED</h3>
            <p>Range A1:D5 · Column chart · titled “Student Marks Comparison” · Sara is highest.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="m4-block">
            <div className="m4-question">
              <Table2 size={16} /> 1 · Which range should Excel chart?
            </div>
            <div className="option-list">
              {RANGE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`option-btn wide ${range === option.value ? 'selected' : ''}`}
                  onClick={() => chooseRange(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`m4-block ${!range ? 'disabled-block' : ''}`}>
            <div className="m4-question">
              <BarChart3 size={16} /> 2 · Which chart type?
            </div>
            <div className="chart-type-row">
              {CHART_OPTIONS.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={`chart-type-btn ${chart === option.value ? 'selected' : ''}`}
                    onClick={() => chooseChart(option.value)}
                    disabled={!range}
                  >
                    <Icon size={24} />
                    <span>{option.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className={`m4-block ${!chart ? 'disabled-block' : ''}`}>
            <div className="m4-question">3 · Choose a clear chart title</div>
            <div className="option-list">
              {TITLE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn wide ${title === option ? 'selected' : ''}`}
                  onClick={() => chooseTitle(option)}
                  disabled={!chart}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {title && (
            <div className="chart-preview">
              <div className="chart-title">{title}</div>
              <div className="chart-bars" aria-hidden="true">
                {CHART_DATA.map((student) => (
                  <div className="bar-column" key={student.name}>
                    <div className="bar-stack">
                      {student.marks.map((mark, index) => (
                        <span
                          key={index}
                          className={`bar-seg seg-${index}`}
                          style={{ height: `${(mark / 300) * 100}%` }}
                          title={`${mark} marks`}
                        />
                      ))}
                    </div>
                    <span className="bar-label">{student.name}</span>
                  </div>
                ))}
              </div>
              <div className="chart-legend">
                <span><i className="legend-eng" /> English</span>
                <span><i className="legend-math" /> Math</span>
                <span><i className="legend-sci" /> Science</span>
              </div>
            </div>
          )}

          <div className={`m4-block ${!title ? 'disabled-block' : ''}`}>
            <div className="m4-question">
              <Trophy size={16} /> 4 · Who has the highest total?
            </div>
            <div className="option-row">
              {WINNER_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-btn ${winner === option ? 'selected' : ''}`}
                  onClick={() => chooseWinner(option)}
                  disabled={!title}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
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
