import { useStore } from '../store/useStore'
import { Moon, Sun, Trash2, Download } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Settings() {
    const { todos, events, notes } = useStore()
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
        }
        return 'light'
    })

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark')
        setTheme(isDark ? 'dark' : 'light')
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }

    const handleClearData = () => {
        if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
            localStorage.clear()
            window.location.reload()
        }
    }

    const exportData = () => {
        const data = { todos, events, notes }
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `everything-app-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your preferences and data.</p>
            </header>

            <div className="space-y-6">
                {/* Appearance */}
                <section className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <div className="font-medium">Theme</div>
                            <div className="text-sm text-muted-foreground">
                                Switch between light and dark mode
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className="inline-flex items-center justify-center rounded-md border p-2 hover:bg-accent transition-colors"
                        >
                            {theme === 'light' ? (
                                <Sun className="h-5 w-5" />
                            ) : (
                                <Moon className="h-5 w-5" />
                            )}
                            <span className="sr-only">Toggle theme</span>
                        </button>
                    </div>
                </section>

                {/* Data Management */}
                <section className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4">Data Management</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Export Data</div>
                                <div className="text-sm text-muted-foreground">
                                    Download a backup of your data
                                </div>
                            </div>
                            <button
                                onClick={exportData}
                                className="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </button>
                        </div>

                        <div className="border-t pt-4 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium text-destructive">Danger Zone</div>
                                <div className="text-sm text-muted-foreground">
                                    Clear all local data and reset app
                                </div>
                            </div>
                            <button
                                onClick={handleClearData}
                                className="flex items-center gap-2 rounded-md border border-destructive text-destructive px-3 py-2 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Clear Data
                            </button>
                        </div>
                    </div>
                </section>

                {/* About */}
                <section className="rounded-xl border bg-card p-6 shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">About</h2>
                    <p className="text-sm text-muted-foreground">
                        Everything App v1.0.0
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Built with React, Vite, and TailwindCSS.
                    </p>
                </section>
            </div>
        </div>
    )
}
