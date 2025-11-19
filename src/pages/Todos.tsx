import { useState } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, Check } from 'lucide-react'
import { cn } from '../lib/utils'

export default function Todos() {
    const { todos, addTodo, toggleTodo, deleteTodo } = useStore()
    const [newTodo, setNewTodo] = useState('')
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTodo.trim()) {
            addTodo(newTodo.trim())
            setNewTodo('')
        }
    }

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
    })

    return (
        <div className="space-y-6 max-w-3xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Todos</h1>
                <div className="flex gap-2 bg-muted p-1 rounded-lg">
                    {(['all', 'active', 'completed'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1 text-sm font-medium rounded-md transition-all capitalize",
                                filter === f
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 h-12 rounded-lg border bg-background px-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                    type="submit"
                    disabled={!newTodo.trim()}
                    className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    <Plus className="h-5 w-5" />
                    Add
                </button>
            </form>

            <div className="space-y-2">
                {filteredTodos.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        {filter === 'all' ? "No tasks yet. Add one above!" : `No ${filter} tasks found.`}
                    </div>
                ) : (
                    filteredTodos.map((todo) => (
                        <div
                            key={todo.id}
                            className={cn(
                                "group flex items-center gap-3 p-4 rounded-xl border bg-card transition-all hover:shadow-sm",
                                todo.completed && "opacity-60 bg-muted/50"
                            )}
                        >
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={cn(
                                    "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                                    todo.completed
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "border-muted-foreground/30 hover:border-primary/50"
                                )}
                            >
                                {todo.completed && <Check className="h-3.5 w-3.5" />}
                            </button>

                            <span className={cn(
                                "flex-1 text-sm font-medium transition-all",
                                todo.completed && "line-through text-muted-foreground"
                            )}>
                                {todo.text}
                            </span>

                            <button
                                onClick={() => deleteTodo(todo.id)}
                                className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive transition-all"
                                aria-label="Delete todo"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
