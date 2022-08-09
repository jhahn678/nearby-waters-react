import create from 'zustand'
import axios from '../../utils/axios'

interface AuthStore {
    username: string | null
    token: string | null
    isAuthenticated: boolean
    signIn: (args: { username: string, password: string }) => Promise<void>
    signOut: () => void
}

export const useAuth = create<AuthStore>((set) => ({
    username: null,
    token: null,
    isAuthenticated: false,
    signIn: async (args) => {
        const res = await axios.post('/admin/login', args)
        set({ 
            username: res.data.username, 
            token: res.data.token,
            isAuthenticated: true
        })
    },
    signOut: () => set({ 
        username: null, 
        token: null, 
        isAuthenticated: false 
    })
}))

