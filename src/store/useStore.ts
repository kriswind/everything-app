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
    description?: string
}

export interface Note {
    id: string
    title: string
    content: string
    updatedAt: number
}

interface AppState {
    todos: Todo[]
    events: CalendarEvent[]
    notes: Note[]

    addTodo: (text: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void

    addEvent: (event: Omit<CalendarEvent, 'id'>) => void
    deleteEvent: (id: string) => void

    addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void
    updateNote: (id: string, content: Partial<Omit<Note, 'id' | 'updatedAt'>>) => void
    deleteNote: (id: string) => void
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            todos: [],
            events: [],
            notes: [],

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
        }),
        {
            name: 'everything-app-storage',
        }
    )
)
