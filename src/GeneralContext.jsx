import { AppProvider, useApp } from './context'

export { AppProvider }

export function useGeneralContext() {
  return useApp()
}

export default AppProvider
