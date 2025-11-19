import { useStore } from '../store/useStore'
import { CheckCircle2, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const { todos, events } = useStore()

    const today = new Date()
    const todaysTasks = todos.filter(t => !t.completed)
    const upcomingEvents = events
        .filter(e => new Date(e.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</h1>
                <p className="text-muted-foreground mt-2">Here's what's happening today, {format(today, 'EEEE, MMMM do')}.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Tasks Overview */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            Tasks
                        </h3>
                        <Link to="/todos" className="text-sm text-primary hover:underline">View all</Link>
                    </div>
                    <div className="space-y-3">
                        {todaysTasks.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No active tasks. You're all caught up!</p>
                        ) : (
                            todaysTasks.slice(0, 5).map(task => (
                                <div key={task.id} className="flex items-center gap-2 text-sm">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="truncate">{task.text}</span>
                                </div>
                            ))
                        )}
                        {todaysTasks.length > 5 && (
                            <p className="text-xs text-muted-foreground pt-2">And {todaysTasks.length - 5} more...</p>
                        )}
                    </div>
                </div>

                {/* Events Overview */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            Upcoming
                        </h3>
                        <Link to="/calendar" className="text-sm text-primary hover:underline">View calendar</Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No upcoming events scheduled.</p>
                        ) : (
                            upcomingEvents.map(event => (
                                <div key={event.id} className="flex items-start gap-3 text-sm">
                                    <div className="flex flex-col items-center justify-center rounded bg-muted px-2 py-1 text-xs font-medium min-w-[3rem]">
                                        <span>{format(new Date(event.date), 'MMM')}</span>
                                        <span className="text-lg font-bold">{format(new Date(event.date), 'd')}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium">{event.title}</p>
                                        {event.description && <p className="text-xs text-muted-foreground line-clamp-1">{event.description}</p>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats / Time */}
                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary/5 to-primary/10">
                    <Clock className="h-8 w-8 text-primary mb-3" />
                    <h3 className="text-2xl font-bold">{format(new Date(), 'h:mm a')}</h3>
                    <p className="text-sm text-muted-foreground">Stay productive!</p>
                </div>
            </div>
        </div>
    )
}
