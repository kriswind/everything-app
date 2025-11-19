import { useStore } from '../store/useStore'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { CheckCircle2, Calendar as CalendarIcon, Clock, Settings2, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../lib/utils'

export default function Dashboard() {
    const { todos, events, profile, alarms, dashboardConfig, setDashboardConfig } = useStore()
    const [isEditing, setIsEditing] = useState(false)

    const today = new Date()
    const todaysTasks = todos.filter(t => !t.completed)
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= new Date(new Date().setHours(0, 0, 0, 0)))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

    const nextAlarm = alarms
        .filter(a => a.enabled)
        .sort((a, b) => a.time.localeCompare(b.time))[0]

    const widgets = [
        { id: 'greeting', label: 'Greeting' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'events', label: 'Events' },
        { id: 'alarms', label: 'Next Alarm' },
    ]

    const toggleWidget = (id: string) => {
        const current = dashboardConfig.widgets || []
        if (current.includes(id)) {
            setDashboardConfig({ widgets: current.filter(w => w !== id) })
        } else {
            setDashboardConfig({ widgets: [...current, id] })
        }
    }

    const activeWidgets = dashboardConfig.widgets || ['greeting', 'tasks', 'events', 'alarms']

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-end">
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border shadow-sm",
                        isEditing
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-card text-foreground border-input hover:bg-accent hover:text-accent-foreground"
                    )}
                >
                    {isEditing ? <X className="h-4 w-4" /> : <Settings2 className="h-4 w-4" />}
                    {isEditing ? 'Done' : 'Customize Dashboard'}
                </button>
            </div>

            {isEditing && (
                <div className="bg-card border rounded-xl p-4 mb-8 animate-in slide-in-from-top-4">
                    <h3 className="font-medium mb-3">Manage Widgets</h3>
                    <div className="flex flex-wrap gap-2">
                        {widgets.map(widget => (
                            <button
                                key={widget.id}
                                onClick={() => toggleWidget(widget.id)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors",
                                    activeWidgets.includes(widget.id)
                                        ? "bg-primary/10 border-primary/20 text-primary"
                                        : "bg-background border-border text-muted-foreground hover:bg-accent"
                                )}
                            >
                                {activeWidgets.includes(widget.id) ? <CheckCircle2 className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                {widget.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {activeWidgets.includes('greeting') && (
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} {profile.name}</h1>
                    <p className="text-muted-foreground mt-2">Here's what's happening today, {format(today, 'EEEE, MMMM do')}.</p>
                </header>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Tasks Widget */}
                {activeWidgets.includes('tasks') && (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-semibold">Active Tasks</h3>
                            </div>
                            <div className="flex-1">
                                {todaysTasks.length > 0 ? (
                                    <div className="text-3xl font-bold">{todaysTasks.length}</div>
                                ) : (
                                    <div className="text-muted-foreground">No active tasks</div>
                                )}
                                <p className="text-sm text-muted-foreground mt-1">tasks remaining</p>
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/todos" className="text-sm font-medium text-primary hover:underline">
                                    View all tasks &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Events Widget */}
                {activeWidgets.includes('events') && (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm md:col-span-2 lg:col-span-1">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <CalendarIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <h3 className="font-semibold">Upcoming Events</h3>
                            </div>
                            <div className="flex-1 space-y-3">
                                {upcomingEvents.length > 0 ? (
                                    upcomingEvents.map(event => (
                                        <div key={event.id} className="flex items-start gap-3 text-sm">
                                            <div className="w-1 h-1 mt-2 rounded-full bg-blue-500 shrink-0" />
                                            <div>
                                                <div className="font-medium">{event.title}</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {format(new Date(event.date), 'MMM d')}
                                                    {event.time && ` • ${event.time}`}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-muted-foreground">No upcoming events</div>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/calendar" className="text-sm font-medium text-blue-500 hover:underline">
                                    Open calendar &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Alarm Widget */}
                {activeWidgets.includes('alarms') && (
                    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                        <div className="p-6 flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="p-2 bg-orange-500/10 rounded-lg">
                                    <Clock className="h-5 w-5 text-orange-500" />
                                </div>
                                <h3 className="font-semibold">Next Alarm</h3>
                            </div>
                            <div className="flex-1">
                                {nextAlarm ? (
                                    <>
                                        <div className="text-3xl font-bold font-mono">{nextAlarm.time}</div>
                                        <p className="text-sm text-muted-foreground mt-1">{nextAlarm.label}</p>
                                    </>
                                ) : (
                                    <div className="text-muted-foreground">No alarms set</div>
                                )}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <Link to="/clock" className="text-sm font-medium text-orange-500 hover:underline">
                                    Manage alarms &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
