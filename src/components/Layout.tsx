import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, CheckSquare, Calendar, Book, Settings, Clock, User } from 'lucide-react'
import { cn } from '../lib/utils'
import { useStore } from '../store/useStore'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: CheckSquare, label: 'Todos', path: '/todos' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Book, label: 'Notebook', path: '/notebook' },
    { icon: Clock, label: 'Clock', path: '/clock' },
]

export function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const { profile } = useStore()

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r bg-card p-4">
                <div className="mb-8 flex items-center gap-3 px-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                        {profile.photoUrl ? (
                            <img src={profile.photoUrl} alt={profile.name} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-5 w-5 text-primary" />
                        )}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="font-bold truncate">{profile.name}</span>
                        <Link to="/profile" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                            View Profile
                        </Link>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className="mt-auto border-t pt-4">
                    <Link
                        to="/settings"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Settings className="h-4 w-4" />
                        Settings
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto p-4 md:p-8">
                <div className="mx-auto max-w-5xl">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card px-4 py-2 flex justify-around items-center z-50">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-accent-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    )
                })}
                <Link
                    to="/profile"
                    className={cn(
                        "flex flex-col items-center gap-1 p-2 text-xs font-medium transition-colors",
                        location.pathname === '/profile'
                            ? "text-primary"
                            : "text-muted-foreground hover:text-accent-foreground"
                    )}
                >
                    <User className="h-5 w-5" />
                    Profile
                </Link>
            </nav>
        </div>
    )
}
