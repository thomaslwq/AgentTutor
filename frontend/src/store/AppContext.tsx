// EXPORTS: AppProvider, useAppStore
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { appReducer, loadState, saveState, type AppState, type AppAction } from './appStore'

interface AppStoreValue {
  state: AppState
  dispatch: Dispatch<AppAction>
}

const AppContext = createContext<AppStoreValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, undefined, loadState)

  // 持久化：订阅 state 变化统一写入，reducer 保持纯函数
  useEffect(() => {
    saveState(state)
  }, [state])

  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppStore(): AppStoreValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppStore 必须在 AppProvider 内使用')
  return ctx
}
