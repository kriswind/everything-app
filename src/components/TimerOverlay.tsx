import { useStore } from '../store/useStore'
import { useLocation, useNavigate } from 'react-router-dom'
import { Maximize2, X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '../lib/utils'

export function TimerOverlay() {
    const { timer, setTimer } = useStore()
    const location = useLocation()
    const navigate = useNavigate()

    // Global Timer Logic
    useEffect(() => {
        let interval: number
        if (timer.isActive && timer.timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimer({ timeLeft: timer.timeLeft - 1 })
            }, 1000)
        } else if (timer.timeLeft === 0 && timer.isActive) {
            setTimer({ isActive: false })
            // Play sound or notification here in future
        }
        return () => clearInterval(interval)
    }, [timer.isActive, timer.timeLeft, setTimer])

    if ((timer.timeLeft === 0 && !timer.isActive) || location.pathname === '/clock') return null

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const progress = timer.duration > 0 ? ((timer.duration - timer.timeLeft) / timer.duration) * 100 : 0

    return (
        <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="bg-card border shadow-lg rounded-xl p-4 w-56 relative overflow-hidden">
                {/* Progress Bar Background */}
                <div
                    className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                />

                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">
                        {timer.isActive ? 'Timer Active' : 'Timer Paused'}
                    </span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setTimer({ isActive: !timer.isActive })}
                            className="p-1 hover:bg-accent rounded-md transition-colors"
                        >
                            {timer.isActive ? (
                                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                                    <rect x="6" y="4" width="4" height="16" />
                                    <rect x="14" y="4" width="4" height="16" />
                                </svg>
                            ) : (
                                <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </button>
                        <button
                            onClick={() => navigate('/clock')}
                            className="p-1 hover:bg-accent rounded-md transition-colors"
                        >
                            <Maximize2 className="h-3 w-3" />
                        </button>
                        <button
                            onClick={() => setTimer({ isActive: false, timeLeft: 0 })}
                            className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-md transition-colors"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                </div>

                <div className={cn(
                    "text-2xl font-mono font-bold text-center transition-opacity",
                    !timer.isActive && "opacity-50"
                )}>
                    {formatTime(timer.timeLeft)}
                </div>
            </div>
        </div>
    )
}
