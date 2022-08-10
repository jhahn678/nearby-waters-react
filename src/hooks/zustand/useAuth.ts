import create from 'zustand'
import axios from '../../utils/axios'

interface AuthStore {
    username: string | null
    token: string | null
    isAuthenticated: boolean
    signIn: (args: { username: string, password: string }) => Promise<void>
    signOut: () => void
    autoSignIn: (args: { token: string, username: string }) => void
}

export const useAuth = create<AuthStore>((set) => ({
    username: null,
    token: null,
    isAuthenticated: false,
    signIn: async (args) => {
        const res = await axios.post('/admin/login', args)
        localStorage.setItem('AUTH_TOKEN', res.data.token)
        localStorage.setItem('USERNAME', res.data.username)
        set({ 
            username: res.data.username, 
            token: res.data.token,
            isAuthenticated: true
        })
    },
    signOut: () => {
        localStorage.removeItem('AUTH_TOKEN')
        localStorage.removeItem('USERNAME')
        set({ 
            username: null, 
            token: null, 
            isAuthenticated: false 
        })
    },
    autoSignIn: ({ token, username }) => {
        set({
            token,
            username,
            isAuthenticated: true
        })
    }
}))

