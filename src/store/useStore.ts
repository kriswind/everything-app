import { create } from 'zustand'
import { auth, db } from '../lib/firebase'
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    query,
    orderBy,
    setDoc,
    getDoc
} from 'firebase/firestore'
import { onAuthStateChanged, type User } from 'firebase/auth'

export interface Todo {
    id: string
    text: string
    completed: boolean
    createdAt: number
}

export interface CalendarEvent {
    id: string
    title: string
    date: string
    time?: string
    description?: string
}

export interface Note {
    id: string
    title: string
    content: string
    updatedAt: number
}

export interface Alarm {
    id: string
    time: string
    label: string
    enabled: boolean
    days: number[]
}

export interface UserProfile {
    name: string
    photoUrl?: string
    about?: string
}

interface AppState {
    user: User | null
    loading: boolean
    todos: Todo[]
    events: CalendarEvent[]
    notes: Note[]
    alarms: Alarm[]
    profile: UserProfile

    initialize: () => () => void

    addTodo: (text: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void

    addEvent: (event: Omit<CalendarEvent, 'id'>) => void
    deleteEvent: (id: string) => void

    addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void
    updateNote: (id: string, content: Partial<Omit<Note, 'id' | 'updatedAt'>>) => void
    deleteNote: (id: string) => void

    addAlarm: (alarm: Omit<Alarm, 'id'>) => void
    toggleAlarm: (id: string) => void
    deleteAlarm: (id: string) => void

    updateProfile: (profile: Partial<UserProfile>) => void
}

// Helper to remove undefined values which Firestore doesn't like
const sanitize = <T extends object>(obj: T): T => {
    const newObj = { ...obj }
    Object.keys(newObj).forEach(key => {
        if ((newObj as any)[key] === undefined) {
            delete (newObj as any)[key]
        }
    })
    return newObj
}



export interface TimerState {
    timeLeft: number
    duration: number
    isActive: boolean
}

export interface DashboardConfig {
    widgets: string[]
}

interface AppState {
    user: User | null
    loading: boolean
    todos: Todo[]
    events: CalendarEvent[]
    notes: Note[]
    alarms: Alarm[]
    profile: UserProfile

    // Timer State
    timer: TimerState
    setTimer: (timer: Partial<TimerState>) => void
    resetTimer: () => void

    // Dashboard Config
    dashboardConfig: DashboardConfig
    setDashboardConfig: (config: DashboardConfig) => void

    initialize: () => () => void

    addTodo: (text: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void

    addEvent: (event: Omit<CalendarEvent, 'id'>) => void
    deleteEvent: (id: string) => void

    addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void
    updateNote: (id: string, content: Partial<Omit<Note, 'id' | 'updatedAt'>>) => void
    deleteNote: (id: string) => void

    addAlarm: (alarm: Omit<Alarm, 'id'>) => void
    toggleAlarm: (id: string) => void
    deleteAlarm: (id: string) => void

    updateProfile: (profile: Partial<UserProfile>) => void
}

export const useStore = create<AppState>((set, get) => ({
    user: null,
    loading: true,
    todos: [],
    events: [],
    notes: [],
    alarms: [],
    profile: {
        name: 'User',
        about: 'Welcome to your Everything App.'
    },

    timer: (() => {
        try {
            const saved = localStorage.getItem('timer')
            return saved ? JSON.parse(saved) : { timeLeft: 0, duration: 0, isActive: false }
        } catch {
            return { timeLeft: 0, duration: 0, isActive: false }
        }
    })(),

    dashboardConfig: {
        widgets: ['greeting', 'tasks', 'events', 'alarms']
    },

    setTimer: (timerUpdate) => set((state) => {
        const newTimer = { ...state.timer, ...timerUpdate }
        localStorage.setItem('timer', JSON.stringify(newTimer))
        return { timer: newTimer }
    }),

    resetTimer: () => set((state) => {
        const newTimer = { ...state.timer, timeLeft: state.timer.duration, isActive: false }
        localStorage.setItem('timer', JSON.stringify(newTimer))
        return { timer: newTimer }
    }),

    setDashboardConfig: (config) => {
        const { user } = get()
        set({ dashboardConfig: config })
        if (user) {
            updateDoc(doc(db, `users/${user.uid}/profile/dashboard`), sanitize(config) as any)
        }
    },

    initialize: () => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            set({ user, loading: false })

            if (user) {
                // Subscribe to collections
                const todosQuery = query(collection(db, `users/${user.uid}/todos`), orderBy('createdAt', 'desc'))
                const eventsQuery = query(collection(db, `users/${user.uid}/events`))
                const notesQuery = query(collection(db, `users/${user.uid}/notes`), orderBy('updatedAt', 'desc'))
                const alarmsQuery = query(collection(db, `users/${user.uid}/alarms`))

                // Profile
                const profileRef = doc(db, `users/${user.uid}/profile/main`)
                const profileSnap = await getDoc(profileRef)
                if (profileSnap.exists()) {
                    set({ profile: profileSnap.data() as UserProfile })
                } else {
                    // Initialize profile if not exists
                    const initialProfile = {
                        name: user.displayName || 'User',
                        photoUrl: user.photoURL || null, // Use null instead of undefined
                        about: 'Welcome to your Everything App.'
                    }
                    // Sanitize just in case
                    await setDoc(profileRef, sanitize(initialProfile))
                    set({ profile: initialProfile as UserProfile })
                }

                // Dashboard Config
                const dashboardRef = doc(db, `users/${user.uid}/profile/dashboard`)
                const dashboardSnap = await getDoc(dashboardRef)
                if (dashboardSnap.exists()) {
                    set({ dashboardConfig: dashboardSnap.data() as DashboardConfig })
                }

                const unsubTodos = onSnapshot(todosQuery, (snap) => {
                    set({ todos: snap.docs.map(d => ({ ...d.data(), id: d.id } as Todo)) })
                })

                const unsubEvents = onSnapshot(eventsQuery, (snap) => {
                    set({ events: snap.docs.map(d => ({ ...d.data(), id: d.id } as CalendarEvent)) })
                })

                const unsubNotes = onSnapshot(notesQuery, (snap) => {
                    set({ notes: snap.docs.map(d => ({ ...d.data(), id: d.id } as Note)) })
                })

                const unsubAlarms = onSnapshot(alarmsQuery, (snap) => {
                    set({ alarms: snap.docs.map(d => ({ ...d.data(), id: d.id } as Alarm)) })
                })

                return () => {
                    unsubTodos()
                    unsubEvents()
                    unsubNotes()
                    unsubAlarms()
                }
            } else {
                set({ todos: [], events: [], notes: [], alarms: [] })
            }
        })

        return unsubscribeAuth
    },

    addTodo: async (text) => {
        const { user } = get()
        if (!user) return
        await addDoc(collection(db, `users/${user.uid}/todos`), sanitize({
            text,
            completed: false,
            createdAt: Date.now()
        }))
    },

    toggleTodo: async (id) => {
        const { user, todos } = get()
        if (!user) return
        const todo = todos.find(t => t.id === id)
        if (todo) {
            await updateDoc(doc(db, `users/${user.uid}/todos/${id}`), {
                completed: !todo.completed
            })
        }
    },

    deleteTodo: async (id) => {
        const { user } = get()
        if (!user) return
        await deleteDoc(doc(db, `users/${user.uid}/todos/${id}`))
    },

    addEvent: async (event) => {
        const { user } = get()
        if (!user) return
        await addDoc(collection(db, `users/${user.uid}/events`), sanitize(event))
    },

    deleteEvent: async (id) => {
        const { user } = get()
        if (!user) return
        await deleteDoc(doc(db, `users/${user.uid}/events/${id}`))
    },

    addNote: async (note) => {
        const { user } = get()
        if (!user) return
        await addDoc(collection(db, `users/${user.uid}/notes`), sanitize({
            ...note,
            updatedAt: Date.now()
        }))
    },

    updateNote: async (id, content) => {
        const { user } = get()
        if (!user) return
        await updateDoc(doc(db, `users/${user.uid}/notes/${id}`), sanitize({
            ...content,
            updatedAt: Date.now()
        }))
    },

    deleteNote: async (id) => {
        const { user } = get()
        if (!user) return
        await deleteDoc(doc(db, `users/${user.uid}/notes/${id}`))
    },

    addAlarm: async (alarm) => {
        const { user } = get()
        if (!user) return
        await addDoc(collection(db, `users/${user.uid}/alarms`), sanitize(alarm))
    },

    toggleAlarm: async (id) => {
        const { user, alarms } = get()
        if (!user) return
        const alarm = alarms.find(a => a.id === id)
        if (alarm) {
            await updateDoc(doc(db, `users/${user.uid}/alarms/${id}`), {
                enabled: !alarm.enabled
            })
        }
    },

    deleteAlarm: async (id) => {
        const { user } = get()
        if (!user) return
        await deleteDoc(doc(db, `users/${user.uid}/alarms/${id}`))
    },

    updateProfile: async (profileData) => {
        const { user } = get()
        if (!user) return
        await updateDoc(doc(db, `users/${user.uid}/profile/main`), sanitize(profileData))
        set(state => ({ profile: { ...state.profile, ...profileData } }))
    }
}))
