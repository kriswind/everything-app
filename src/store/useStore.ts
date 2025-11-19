import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Todo {
    id: string
    text: string
    completed: boolean
    createdAt: number
}

export interface CalendarEvent {
    id: string
    title: string
    date: string // ISO date string YYYY-MM-DD
    time?: string // HH:mm
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
    time: string // HH:mm
    label: string
    enabled: boolean
    days: number[] // 0-6, where 0 is Sunday
}

export interface UserProfile {
    name: string
    photoUrl?: string
    about?: string
}

interface AppState {
    todos: Todo[]
    events: CalendarEvent[]
    notes: Note[]
    alarms: Alarm[]
    profile: UserProfile

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

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            todos: [],
            events: [],
            notes: [],
            alarms: [],
            profile: {
                name: 'User',
                about: 'Welcome to your Everything App.'
            },

            addTodo: (text) => set((state) => ({
                todos: [
                    ...state.todos,
                    { id: crypto.randomUUID(), text, completed: false, createdAt: Date.now() }
                ]
            })),
            toggleTodo: (id) => set((state) => ({
                todos: state.todos.map((t) =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            })),
            deleteTodo: (id) => set((state) => ({
                todos: state.todos.filter((t) => t.id !== id)
            })),

            addEvent: (event) => set((state) => ({
                events: [...state.events, { ...event, id: crypto.randomUUID() }]
            })),
            deleteEvent: (id) => set((state) => ({
                events: state.events.filter((e) => e.id !== id)
            })),

            addNote: (note) => set((state) => ({
                notes: [
                    ...state.notes,
                    { ...note, id: crypto.randomUUID(), updatedAt: Date.now() }
                ]
            })),
            updateNote: (id, content) => set((state) => ({
                notes: state.notes.map((n) =>
                    n.id === id ? { ...n, ...content, updatedAt: Date.now() } : n
                )
            })),
            deleteNote: (id) => set((state) => ({
                notes: state.notes.filter((n) => n.id !== id)
            })),

            addAlarm: (alarm) => set((state) => ({
                alarms: [...state.alarms, { ...alarm, id: crypto.randomUUID() }]
            })),
            toggleAlarm: (id) => set((state) => ({
                alarms: state.alarms.map((a) =>
                    a.id === id ? { ...a, enabled: !a.enabled } : a
                )
            })),
            deleteAlarm: (id) => set((state) => ({
                alarms: state.alarms.filter((a) => a.id !== id)
            })),

            updateProfile: (profile) => set((state) => ({
                profile: { ...state.profile, ...profile }
            })),
        }),
        {
            name: 'everything-app-storage',
        }
    )
)
