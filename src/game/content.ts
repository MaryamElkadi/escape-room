import type { AvatarId, Mission, TeacherClue } from './types'

export const GAME_SECONDS = 20 * 60
export const FINAL_PASSWORD = ['4', '7', '2', '9']
export const TEACHER_PIN = '2468'
export const STORAGE_KEY = 'excel-escape-room-v1'
export const MAX_SCORE = 80

export const AVATARS: { id: AvatarId; name: string; emoji: string; tag: string }[] = [
  { id: 'fox', name: 'Cyber Fox', emoji: '🦊', tag: 'Quick thinking' },
  { id: 'falcon', name: 'Neon Falcon', emoji: '🦅', tag: 'Sharp eyes' },
  { id: 'wolf', name: 'Data Wolf', emoji: '🐺', tag: 'Team spirit' },
  { id: 'cobra', name: 'Code Cobra', emoji: '🐍', tag: 'Cool under pressure' },
  { id: 'owl', name: 'Pixel Owl', emoji: '🦉', tag: 'Wise planner' },
  { id: 'lynx', name: 'Logic Lynx', emoji: '🐈‍⬛', tag: 'Pattern finder' },
]

export const ROLES = [
  { name: 'Computer Captain', icon: '🖥️', job: 'Runs Excel.' },
  { name: 'Data Detective', icon: '🔎', job: 'Checks clues and cells.' },
  { name: 'Formula Expert', icon: '🧮', job: 'Checks sums and averages.' },
  { name: 'Navigator', icon: '🗺️', job: 'Collects the station clue.' },
  { name: 'Team Reporter', icon: '📣', job: 'Talks to the teacher.' },
]

export const MISSIONS: Mission[] = [
  {
    id: 1,
    station: 'A',
    stationName: 'Data Detectives',
    name: 'Find the Missing Data',
    topic: 'Cells, rows, columns & organisation',
    points: 10,
    digit: '4',
    color: '#38f5a0',
    icon: 'table',
    story: 'The student table was wiped. One paper clue survived.',
    brief: 'Rebuild the marks table.',
    objective: [
      'Type the headings in row 1.',
      'Add 4 students and their marks.',
      'Click Sara’s Science cell.',
      'Save as TEAM-NAME_MISSION1.',
    ],
    movement: 'Station A · read the green clue, then return.',
    stationSpot: 'Front-left desk · green envelope A',
    clue: 'CLUE A · THE LOST RECORDS',
    clueLines: [
      'The table has 5 rows and 4 columns.',
      'Student | English | Math | Science',
      'Lina | 85 | 90 | 88',
      'Omar | 72 | 80 | 75',
      'Sara | 95 | 92 | 98',
      'Adam | 60 | 70 | 65',
      'Sara’s Science mark is in cell D4.',
    ],
    hints: [
      'Headings go in A1–D1. Lina starts in row 2.',
      'Use Tab to move right. Enter starts a new row.',
      'Sara’s Science mark is column D, row 4 → cell D4.',
    ],
    teacherNote:
      'Table must match the clue card. Sara’s Science mark is D4. Ask one student to explain rows vs columns.',
    taskLabel: 'Rebuild the data table',
  },
  {
    id: 2,
    station: 'B',
    stationName: 'Format Lab',
    name: 'The Formatting Virus',
    topic: 'Formatting cells',
    points: 10,
    digit: '7',
    color: '#43c7ff',
    icon: 'paint',
    story: 'A virus stripped every style from the table.',
    brief: 'Fix the formatting.',
    objective: [
      'Bold the headings.',
      'Add a heading fill colour.',
      'Add borders to every cell.',
      'Widen the columns.',
      'Show marks as whole numbers.',
    ],
    movement: 'Station B · read the blue clue, then return.',
    stationSpot: 'Window sill · blue envelope B',
    clue: 'CLUE B · THE STYLE CODE',
    clueLines: [
      'Bold like a hero. 🦸',
      'Fill it green, keep it clean. 🟩',
      'Box it in, every cell. 🔲',
      'Make it wide, let it breathe. ↔️',
      'Your secret digit is the number of formatting jobs: 4 + 3.',
    ],
    hints: [
      'Select A1:D1, then press Ctrl + B.',
      'Home tab → Fill Color and Borders.',
      'Select columns A–D, then double-click a column edge to auto-fit.',
    ],
    teacherNote:
      'Ask the team to point to Bold, Fill, Borders and Column Width. Clue answer: 7.',
    taskLabel: 'Repair the formatting',
  },
  {
    id: 3,
    station: 'C',
    stationName: 'Formula Control Room',
    name: 'Formula Control Room',
    topic: 'Formulas: SUM & AVERAGE',
    points: 20,
    digit: '2',
    color: '#ffb703',
    icon: 'formula',
    story: 'Every total and average has vanished.',
    brief: 'Add SUM and AVERAGE formulas.',
    objective: [
      'Add Total in E1.',
      'Use =SUM(B2:D2).',
      'Add Average in F1.',
      'Use =AVERAGE(B2:D2).',
      'Round to 1 decimal place.',
    ],
    movement: 'Station C · read the yellow clue, then return.',
    stationSpot: 'Back bookshelf · yellow folder C',
    clue: 'CLUE C · THE POWER PUZZLE',
    clueLines: [
      'Lina: 85 + 90 + 88 = ?',
      'Now divide that total by 3. What is her average?',
      'The digit is the number of students in the table, minus 2.',
      'Test your answer in Excel — the computer never guesses.',
    ],
    hints: [
      'Every formula starts with =. SUM adds B2:D2.',
      'Average = total ÷ how many → =AVERAGE(B2:D2).',
      'Lina: total 263, average 87.7. The digit is 2.',
    ],
    teacherNote:
      'Check formulas start with = and use the right range. Ask the Formula Expert to predict Lina’s total first.',
    taskLabel: 'Power the formula engine',
  },
  {
    id: 4,
    station: 'D',
    stationName: 'Secret Code Lab',
    name: 'The Final Data Recovery',
    topic: 'Charts & data interpretation',
    points: 20,
    digit: '9',
    color: '#ff5a76',
    icon: 'chart',
    story: 'The last file is locked inside a chart.',
    brief: 'Build a column chart.',
    objective: [
      'Select A1:D5.',
      'Insert a Column chart.',
      'Title: Student Marks Comparison.',
      'Find the highest total.',
      'Show the teacher.',
    ],
    movement: 'Station D · read the red clue, then return.',
    stationSpot: 'Teacher’s desk · red envelope D',
    clue: 'CLUE D · THE LAST SIGNAL',
    clueLines: [
      'The chart shows three subjects for four students.',
      'Read the tallest bars carefully.',
      'Sara: 95 + 92 + 98 = ?',
      'Count the letters in the winner’s first name, then add 5.',
    ],
    hints: [
      'Select A1:D5, then Insert → Chart → Column.',
      'A good chart title tells the reader what the chart shows.',
      'Sara has the highest total: 285. SARA has 4 letters; 4 + 5 = 9.',
    ],
    teacherNote:
      'Verify the chart title and that it uses all three subjects. Sara has the highest total (285); digit 9.',
    taskLabel: 'Crack the final chart',
  },
]

export const TEACHER_CLUES: TeacherClue[] = [
  {
    mission: 1,
    station: 'A',
    title: 'STATION A · DATA DETECTIVES',
    placement: 'Front-left desk. Green envelope marked A.',
    lines: [
      'Student | English | Math | Science',
      'Lina | 85 | 90 | 88',
      'Omar | 72 | 80 | 75',
      'Sara | 95 | 92 | 98',
      'Adam | 60 | 70 | 65',
      'Task: rebuild this table in Excel. Which cell holds Sara’s Science mark? (D4)',
    ],
    answer: 'Secret digit 4',
  },
  {
    mission: 2,
    station: 'B',
    title: 'STATION B · FORMAT LAB',
    placement: 'Window sill. Blue envelope marked B.',
    lines: [
      'The formatting virus erased: bold headings, heading fill colour, cell borders and wide columns.',
      'Repair all four in Excel.',
      'The digit is the number of repair jobs (4) plus 3.',
    ],
    answer: 'Secret digit 7',
  },
  {
    mission: 3,
    station: 'C',
    title: 'STATION C · FORMULA CONTROL ROOM',
    placement: 'Back bookshelf. Yellow folder marked C.',
    lines: [
      'Lina: 85 + 90 + 88 = 263',
      'Average = 263 ÷ 3 = 87.7',
      'Predict the total before pressing Enter.',
      'The digit is the number of students minus 2.',
    ],
    answer: 'Secret digit 2',
  },
  {
    mission: 4,
    station: 'D',
    title: 'STATION D · SECRET CODE LAB',
    placement: 'Teacher’s desk. Red envelope marked D.',
    lines: [
      'Build a column chart from student names and all three mark columns.',
      'Title: Student Marks Comparison',
      'Who has the highest total? Add each row carefully.',
      'Count the letters in the winner’s first name, then add 5.',
    ],
    answer: 'Secret digit 9 (SARA: 4 + 5)',
  },
]

export const STATION_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 14, y: 22 },
  2: { x: 84, y: 48 },
  3: { x: 20, y: 80 },
  4: { x: 76, y: 16 },
}
