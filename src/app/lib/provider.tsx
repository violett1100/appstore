'use client' // App Router 必須加

import { Provider } from 'react-redux'
import { store } from './store'

export function ReduxProvider({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>
}
