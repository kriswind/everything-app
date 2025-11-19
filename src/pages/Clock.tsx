import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Play, Pause, RotateCcw, Plus, Trash2, Bell, BellOff } from 'lucide-react'
import { cn } from '../lib/utils'

export default function ClockPage() {
    const { alarms, addAlarm, toggleAlarm, deleteAlarm, timer, setTimer, resetTimer } = useStore()
    const [activeTab, setActiveTab] = useState<'timer' | 'alarm'>('timer')

    // Alarm State
    const [newAlarmTime, setNewAlarmTime] = useState('')
    const [newAlarmLabel, setNewAlarmLabel] = useState('')
    const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]) // Default all days

    const startTimer = (minutes: number) => {
        const seconds = minutes * 60
        setTimer({ duration: seconds, timeLeft: seconds, isActive: true })
    }

    const toggleTimer = () => {
        setTimer({ isActive: !timer.isActive })
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    // Circular Progress Calculation
    const radius = 120
    const circumference = 2 * Math.PI * radius
    const progress = timer.duration > 0 ? ((timer.duration - timer.timeLeft) / timer.duration) : 0
    const strokeDashoffset = circumference * progress

    // Alarm Logic
    const handleAddAlarm = (e: React.FormEvent) => {
        e.preventDefault()
        if (newAlarmTime) {
            addAlarm({
                time: newAlarmTime,
                label: newAlarmLabel || 'Alarm',
                enabled: true,
                days: selectedDays
            })
            setNewAlarmTime('')
            setNewAlarmLabel('')
            setSelectedDays([0, 1, 2, 3, 4, 5, 6])
        }
    }

    const toggleDay = (dayIndex: number) => {
        if (selectedDays.includes(dayIndex)) {
            setSelectedDays(selectedDays.filter(d => d !== dayIndex))
        } else {
            setSelectedDays([...selectedDays, dayIndex].sort())
        }
    }

    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

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
                    {/* Timer Display with Circular Progress */}
                    <div className="relative flex items-center justify-center h-80 w-80 mx-auto">
                        {/* Background Circle */}
                        <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 300 300">
                            <circle
                                cx="150"
                                cy="150"
                                r={radius}
                                className="fill-none stroke-muted stroke-[8px]"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="150"
                                cy="150"
                                r={radius}
                                className="fill-none stroke-primary stroke-[8px] transition-all duration-1000 ease-linear"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                            />
                        </svg>

                        <div className="z-10 flex flex-col items-center">
                            <span className="text-6xl font-mono font-bold tracking-wider">
                                {formatTime(timer.timeLeft)}
                            </span>
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={toggleTimer}
                                    disabled={timer.timeLeft === 0 && timer.duration === 0}
                                    className="p-4 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                >
                                    {timer.isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    disabled={timer.timeLeft === 0 && timer.duration === 0}
                                    className="p-4 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50 transition-colors"
                                >
                                    <RotateCcw className="h-6 w-6" />
                                </button>
                            </div>
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
                    <form onSubmit={handleAddAlarm} className="bg-card border rounded-xl p-4 space-y-4">
                        <div className="flex gap-4 items-end">
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
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Repeat</label>
                            <div className="flex justify-between gap-1">
                                {days.map((day, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => toggleDay(index)}
                                        className={cn(
                                            "h-8 w-8 rounded-full text-xs font-medium transition-colors",
                                            selectedDays.includes(index)
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted text-muted-foreground hover:bg-accent"
                                        )}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                                            <div className="flex gap-2 items-center">
                                                <span className="text-sm text-muted-foreground">{alarm.label}</span>
                                                <span className="text-xs text-muted-foreground/60">•</span>
                                                <span className="text-xs text-muted-foreground/60">
                                                    {alarm.days.length === 7 ? 'Every day' :
                                                        alarm.days.length === 0 ? 'Once' :
                                                            alarm.days.map(d => days[d]).join(' ')}
                                                </span>
                                            </div>
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
