import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { Play, Pause, RotateCcw, Plus, Trash2, Bell, BellOff } from 'lucide-react'
import { cn } from '../lib/utils'

export default function ClockPage() {
    const { alarms, addAlarm, toggleAlarm, deleteAlarm } = useStore()
    const [activeTab, setActiveTab] = useState<'timer' | 'alarm'>('timer')

    // Timer State
    const [timeLeft, setTimeLeft] = useState(0)
    const [isActive, setIsActive] = useState(false)
    const [duration, setDuration] = useState(0) // Initial duration to reset to
    const timerRef = useRef<number | null>(null)

    // Alarm State
    const [newAlarmTime, setNewAlarmTime] = useState('')
    const [newAlarmLabel, setNewAlarmLabel] = useState('')

    // Timer Logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            setIsActive(false)
            if (timerRef.current) clearInterval(timerRef.current)
            if (duration > 0) {
                // Timer finished logic (could play sound here)
                // For now just visual indication
            }
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current)
        }
    }, [isActive, timeLeft, duration])

    const startTimer = (minutes: number) => {
        const seconds = minutes * 60
        setDuration(seconds)
        setTimeLeft(seconds)
        setIsActive(true)
    }

    const toggleTimer = () => {
        setIsActive(!isActive)
    }

    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(duration)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Alarm Logic
    const handleAddAlarm = (e: React.FormEvent) => {
        e.preventDefault()
        if (newAlarmTime) {
            addAlarm({
                time: newAlarmTime,
                label: newAlarmLabel || 'Alarm',
                enabled: true,
                days: [0, 1, 2, 3, 4, 5, 6] // Default to every day for MVP
            })
            setNewAlarmTime('')
            setNewAlarmLabel('')
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl mx-auto">
            <header className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Clock</h1>
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setActiveTab('timer')}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            activeTab === 'timer'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        Timer
                    </button>
                    <button
                        onClick={() => setActiveTab('alarm')}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                            activeTab === 'alarm'
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        Alarm
                    </button>
                </div>
            </header>

            {activeTab === 'timer' ? (
                <div className="space-y-8">
                    {/* Timer Display */}
                    <div className="flex flex-col items-center justify-center p-12 rounded-full border-4 border-primary/20 h-80 w-80 mx-auto relative">
                        <span className="text-6xl font-mono font-bold tracking-wider">
                            {formatTime(timeLeft)}
                        </span>
                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={toggleTimer}
                                disabled={timeLeft === 0 && duration === 0}
                                className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                            </button>
                            <button
                                onClick={resetTimer}
                                disabled={timeLeft === 0 && duration === 0}
                                className="p-4 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
                            >
                                <RotateCcw className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-3 gap-4">
                        {[1, 5, 10, 15, 30, 60].map((min) => (
                            <button
                                key={min}
                                onClick={() => startTimer(min)}
                                className="p-4 rounded-xl border bg-card hover:border-primary/50 hover:bg-accent/50 transition-all"
                            >
                                <span className="text-xl font-bold">{min}</span>
                                <span className="text-xs text-muted-foreground ml-1">min</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Add Alarm */}
                    <form onSubmit={handleAddAlarm} className="bg-card border rounded-xl p-4 flex gap-4 items-end">
                        <div className="flex-1 space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <input
                                type="time"
                                value={newAlarmTime}
                                onChange={(e) => setNewAlarmTime(e.target.value)}
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                        </div>
                        <div className="flex-[2] space-y-2">
                            <label className="text-sm font-medium">Label</label>
                            <input
                                type="text"
                                value={newAlarmLabel}
                                onChange={(e) => setNewAlarmLabel(e.target.value)}
                                placeholder="Alarm name"
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                        </div>
                        <button
                            type="submit"
                            className="h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </form>

                    {/* Alarm List */}
                    <div className="space-y-3">
                        {alarms.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No alarms set.
                            </div>
                        ) : (
                            alarms.map((alarm) => (
                                <div
                                    key={alarm.id}
                                    className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border bg-card transition-all",
                                        !alarm.enabled && "opacity-60"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => toggleAlarm(alarm.id)}
                                            className={cn(
                                                "p-2 rounded-full transition-colors",
                                                alarm.enabled
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-muted text-muted-foreground"
                                            )}
                                        >
                                            {alarm.enabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                                        </button>
                                        <div>
                                            <div className="text-2xl font-bold font-mono">{alarm.time}</div>
                                            <div className="text-sm text-muted-foreground">{alarm.label}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteAlarm(alarm.id)}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
