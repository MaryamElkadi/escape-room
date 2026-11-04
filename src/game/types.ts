export type Phase = 'intro' | 'setup' | 'game' | 'victory'
export type View = 'dashboard' | 'mission' | 'lock' | 'scoreboard'

export type AvatarId = 'fox' | 'falcon' | 'wolf' | 'cobra' | 'owl' | 'lynx'

export interface MissionState {
  unlocked: boolean
  completed: boolean
  verified: boolean
  taskDone: boolean
  hint: number
}

export interface Team {
  id: string
  name: string
  avatar: AvatarId
  points: number
  missions: number
  isPlayer: boolean
  finalSolved: boolean
}

export interface GameState {
  version: number
  phase: Phase
  view: View
  teamName: string
  avatar: AvatarId
  timerRemaining: number
  timerRunning: boolean
  timerStartedAt: number | null
  missions: MissionState[]
  activeMission: number | null
  digits: Record<number, string>
  teams: Team[]
  finalSolved: boolean
  finalAttempts: number
  teamworkAwarded: boolean
  soundOn: boolean
  passwordRevealed: boolean
  timeUp: boolean
  savedAt: number
}

export type Action =
  | { type: 'START_INVESTIGATION' }
  | { type: 'CREATETEAM'; name: string; avatar: AvatarId }
  | { type: 'TICK' }
  | { type: 'TOGGLE_TIMER' }
  | { type: 'SET_TIME'; seconds: number }
  | { type: 'SET_VIEW'; view: View }
  | { type: 'OPEN_MISSION'; id: number }
  | { type: 'UNLOCK_MISSION'; id: number }
  | { type: 'COMPLETE_TASK'; id: number }
  | { type: 'REVEAL_HINT'; id: number }
  | { type: 'VERIFY_MISSION'; id: number }
  | { type: 'AWARD_TEAMWORK' }
  | { type: 'ADD_TEAM'; name: string; avatar: AvatarId }
  | { type: 'AWARD_BONUS'; teamId: string; points: number }
  | { type: 'REMOVE_TEAM'; teamId: string }
  | { type: 'SOLVE_FINAL' }
  | { type: 'WRONG_FINAL' }
  | { type: 'REVEAL_PASSWORD' }
  | { type: 'TOGGLE_SOUND' }
  | { type: 'RESET' }
  | { type: 'RESTORE'; state: GameState }

export interface Mission {
  id: number
  station: 'A' | 'B' | 'C' | 'D'
  stationName: string
  name: string
  topic: string
  points: number
  digit: string
  color: string
  icon: 'table' | 'paint' | 'formula' | 'chart'
  story: string
  brief: string
  objective: string[]
  movement: string
  stationSpot: string
  clue: string
  clueLines: string[]
  hints: string[]
  teacherNote: string
  taskLabel: string
}

export interface TeacherClue {
  mission: number
  station: string
  title: string
  placement: string
  lines: string[]
  answer: string
}
