import { useState } from 'react'
import { useStore } from '../store/useStore'
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns'
import { ChevronLeft, ChevronRight, Trash2, Clock } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Calendar() {
    const { events, addEvent, deleteEvent } = useStore()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [newEventTitle, setNewEventTitle] = useState('')
    const [newEventTime, setNewEventTime] = useState('')

    const firstDayOfMonth = startOfMonth(currentMonth)
    const lastDayOfMonth = endOfMonth(currentMonth)
    const startDate = startOfWeek(firstDayOfMonth)
    const endDate = endOfWeek(lastDayOfMonth)

    const days = eachDayOfInterval({ start: startDate, end: endDate })

    const selectedDateEvents = events
        .filter(event => isSameDay(new Date(event.date), selectedDate))
        .sort((a, b) => {
            if (a.time && b.time) return a.time.localeCompare(b.time)
            if (a.time) return -1
            if (b.time) return 1
            return 0
        })

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault()
        if (newEventTitle.trim()) {
            addEvent({
                title: newEventTitle.trim(),
                date: selectedDate.toISOString(),
                time: newEventTime || undefined
            })
            setNewEventTitle('')
            setNewEventTime('')
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
                <div className="flex items-center gap-2 bg-card border rounded-lg p-1">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="font-semibold min-w-[120px] text-center">
                        {format(currentMonth, 'MMMM yyyy')}
                    </span>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-accent rounded-md transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-card border rounded-xl p-4 flex flex-col">
                    <div className="grid grid-cols-7 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-1">
                        {days.map((day) => {
                            const dayEvents = events.filter(e => isSameDay(new Date(e.date), day))
                            const isSelected = isSameDay(day, selectedDate)
                            const isCurrentMonth = isSameMonth(day, currentMonth)

                            return (
                                <button
                                    key={day.toString()}
                                    onClick={() => setSelectedDate(day)}
                                    className={cn(
                                        "relative flex flex-col items-center p-2 rounded-lg transition-all hover:bg-accent/50",
                                        !isCurrentMonth && "text-muted-foreground opacity-50",
                                        isSelected && "bg-accent ring-2 ring-primary ring-offset-2 ring-offset-background z-10",
                                        isToday(day) && !isSelected && "bg-primary/5 font-bold text-primary"
                                    )}
                                >
                                    <span className={cn(
                                        "text-sm h-7 w-7 flex items-center justify-center rounded-full",
                                        isToday(day) && "bg-primary text-primary-foreground"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center max-w-full">
                                        {dayEvents.slice(0, 3).map((_, i) => (
                                            <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary" />
                                        ))}
                                        {dayEvents.length > 3 && (
                                            <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                        )}
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Selected Day Events */}
                <div className="bg-card border rounded-xl p-6 flex flex-col">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-1">
                            {format(selectedDate, 'EEEE, MMMM do')}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            {selectedDateEvents.length} event{selectedDateEvents.length !== 1 && 's'} scheduled
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                        {selectedDateEvents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-4 border-2 border-dashed rounded-lg">
                                <Clock className="h-8 w-8 mb-2 opacity-50" />
                                <p>No events for this day</p>
                            </div>
                        ) : (
                            selectedDateEvents.map(event => (
                                <div key={event.id} className="group flex items-center gap-3 p-3 rounded-lg border bg-muted/30 hover:bg-muted transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            {event.time && (
                                                <span className="text-xs font-mono bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                    {event.time}
                                                </span>
                                            )}
                                            <p className="font-medium text-sm">{event.title}</p>
                                        </div>
                                        {event.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={handleAddEvent} className="mt-auto pt-4 border-t space-y-2">
                        <input
                            type="text"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                            placeholder="Event title..."
                            className="w-full h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        />
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                                className="h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            <button
                                type="submit"
                                disabled={!newEventTitle.trim()}
                                className="flex-1 h-10 flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
                            >
                                Add Event
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
