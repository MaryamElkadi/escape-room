import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react'
import { GAME_SECONDS, MISSIONS, STORAGE_KEY } from './content'
import type { Action, AvatarId, GameState, Team } from './types'

function makeTeam(name: string, avatar: AvatarId, isPlayer: boolean): Team {
  return {
    id: `${isPlayer ? 'player' : 'team'}-${Date.now()}-${Math.floor(Math.random() * 999)}`,
    name: name.trim(),
    avatar,
    points: 0,
    missions: 0,
    isPlayer,
    finalSolved: false,
  }
}

export function createInitialState(soundOn = true): GameState {
  return {
    version: 1,
    phase: 'intro',
    view: 'dashboard',
    teamName: '',
    avatar: 'fox',
    timerRemaining: GAME_SECONDS,
    timerRunning: false,
    timerStartedAt: null,
    missions: MISSIONS.map(() => ({
      unlocked: false,
      completed: false,
      verified: false,
      taskDone: false,
      hint: 0,
    })),
    activeMission: null,
    digits: {},
    teams: [],
    finalSolved: false,
    finalAttempts: 0,
    teamworkAwarded: false,
    soundOn,
    passwordRevealed: false,
    timeUp: false,
    savedAt: Date.now(),
  }
}

function awardPlayer(state: GameState, points: number, missions = 0): Team[] {
  return state.teams.map((team) =>
    team.isPlayer
      ? { ...team, points: Math.max(0, team.points + points), missions: team.missions + missions }
      : team,
  )
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_INVESTIGATION':
      return { ...state, phase: 'setup' }

    case 'CREATETEAM': {
      const name = action.name.trim().slice(0, 28)
      if (!name) return state
      const missions = state.missions.map((m, i) => ({
        ...m,
        unlocked: i === 0,
      }))
      return {
        ...state,
        phase: 'game',
        view: 'dashboard',
        teamName: name,
        avatar: action.avatar,
        timerRemaining: GAME_SECONDS,
        timerRunning: true,
        timerStartedAt: Date.now(),
        missions,
        teams: [makeTeam(name, action.avatar, true)],
        activeMission: null,
        digits: {},
        finalSolved: false,
        finalAttempts: 0,
        timeUp: false,
      }
    }

    case 'TICK': {
      if (!state.timerRunning || state.phase !== 'game') return state
      const remaining = Math.max(0, state.timerRemaining - 1)
      return {
        ...state,
        timerRemaining: remaining,
        timerRunning: remaining > 0,
        timeUp: remaining === 0,
      }
    }

    case 'TOGGLE_TIMER':
      return {
        ...state,
        timerRunning: !state.timerRunning && state.timerRemaining > 0,
      }

    case 'SET_TIME': {
      const seconds = Math.max(0, Math.min(99 * 60, Math.round(action.seconds)))
      return {
        ...state,
        timerRemaining: seconds,
        timerRunning: seconds > 0 ? state.timerRunning : false,
        timeUp: seconds === 0,
      }
    }

    case 'SET_VIEW':
      return { ...state, view: action.view }

    case 'OPEN_MISSION': {
      const mission = state.missions[action.id - 1]
      if (!mission?.unlocked) return state
      return { ...state, view: 'mission', activeMission: action.id }
    }

    case 'UNLOCK_MISSION':
      return {
        ...state,
        missions: state.missions.map((m, i) => (i === action.id - 1 ? { ...m, unlocked: true } : m)),
      }

    case 'COMPLETE_TASK':
      return {
        ...state,
        missions: state.missions.map((m, i) =>
          i === action.id - 1 ? { ...m, unlocked: true, taskDone: true } : m,
        ),
      }

    case 'REVEAL_HINT':
      return {
        ...state,
        missions: state.missions.map((m, i) =>
          i === action.id - 1 ? { ...m, hint: Math.min(m.hint + 1, MISSIONS[i].hints.length) } : m,
        ),
      }

    case 'VERIFY_MISSION': {
      const index = action.id - 1
      const mission = MISSIONS[index]
      const current = state.missions[index]
      if (!mission || !current) return state
      if (current.completed) {
        return {
          ...state,
          missions: state.missions.map((m, i) => (i === index ? { ...m, verified: true } : m)),
        }
      }
      const missions = state.missions.map((m, i) => {
        if (i === index) return { ...m, completed: true, verified: true, unlocked: true }
        if (i === index + 1) return { ...m, unlocked: true }
        return m
      })
      return {
        ...state,
        missions,
        digits: { ...state.digits, [mission.id]: mission.digit },
        teams: awardPlayer(state, mission.points, 1),
      }
    }

    case 'AWARD_TEAMWORK':
      if (state.teamworkAwarded) return state
      return {
        ...state,
        teamworkAwarded: true,
        teams: awardPlayer(state, 10),
      }

    case 'ADD_TEAM': {
      const name = action.name.trim().slice(0, 28)
      if (!name) return state
      return {
        ...state,
        teams: [...state.teams, makeTeam(name, action.avatar, false)],
      }
    }

    case 'AWARD_BONUS':
      return {
        ...state,
        teams: state.teams.map((team) =>
          team.id === action.teamId
            ? { ...team, points: Math.max(0, team.points + action.points) }
            : team,
        ),
      }

    case 'REMOVE_TEAM':
      return {
        ...state,
        teams: state.teams.filter((team) => team.id !== action.teamId || team.isPlayer),
      }

    case 'SOLVE_FINAL': {
      if (state.finalSolved) return state
      return {
        ...state,
        finalSolved: true,
        phase: 'victory',
        view: 'dashboard',
        timerRunning: false,
        teams: state.teams.map((team) =>
          team.isPlayer
            ? { ...team, points: team.points + 10, finalSolved: true }
            : team,
        ),
      }
    }

    case 'WRONG_FINAL':
      return { ...state, finalAttempts: state.finalAttempts + 1 }

    case 'REVEAL_PASSWORD':
      return { ...state, passwordRevealed: true }

    case 'TOGGLE_SOUND':
      return { ...state, soundOn: !state.soundOn }

    case 'RESET':
      return createInitialState(state.soundOn)

    case 'RESTORE':
      return action.state

    default:
      return state
  }
}

interface GameContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
}

const GameContext = createContext<GameContextValue | null>(null)

function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as GameState
    if (!parsed || parsed.version !== 1) return createInitialState()
    let remaining = parsed.timerRemaining
    if (parsed.timerRunning && parsed.savedAt) {
      const elapsed = Math.floor((Date.now() - parsed.savedAt) / 1000)
      remaining = Math.max(0, remaining - elapsed)
    }
    return {
      ...createInitialState(parsed.soundOn ?? true),
      ...parsed,
      timerRemaining: remaining,
      timerRunning: parsed.timerRunning && remaining > 0,
      timeUp: remaining === 0,
      view: parsed.phase === 'victory' ? 'dashboard' : parsed.view,
    }
  } catch {
    return createInitialState()
  }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, savedAt: Date.now() }))
    } catch {
      // Storage can be full or blocked; the game still runs.
    }
  }, [state])

  useEffect(() => {
    if (!state.timerRunning || state.phase !== 'game') return
    const id = window.setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => window.clearInterval(id)
  }, [state.timerRunning, state.phase])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used inside GameProvider')
  return context
}

export function formatTime(totalSeconds: number) {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
