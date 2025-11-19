import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { Plus, Trash2, FileText, Search } from 'lucide-react'
import { cn } from '../lib/utils'
import { format } from 'date-fns'

export default function Notebook() {
    const { notes, addNote, updateNote, deleteNote } = useStore()
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const selectedNote = notes.find(n => n.id === selectedNoteId)

    // Select first note if none selected and notes exist
    useEffect(() => {
        if (!selectedNoteId && notes.length > 0) {
            setSelectedNoteId(notes[0].id)
        }
    }, [notes.length, selectedNoteId])

    const handleCreateNote = () => {
        const newNote = {
            title: 'Untitled Note',
            content: '',
        }
        addNote(newNote)
        // We can't easily select the new note immediately without the ID returned from addNote
        // But since it's added to the end or beginning, we could try to find it.
        // For now, the user can click it.
        // Actually, let's just rely on the user clicking it or improved store logic later.
    }

    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.updatedAt - a.updatedAt)

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in duration-500">
            {/* Sidebar List */}
            <div className="w-80 flex flex-col gap-4 bg-card border rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Notes</h2>
                    <button
                        onClick={handleCreateNote}
                        className="p-2 hover:bg-accent rounded-md transition-colors text-primary"
                        title="New Note"
                    >
                        <Plus className="h-5 w-5" />
                    </button>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 pl-9 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {filteredNotes.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No notes found.
                        </div>
                    ) : (
                        filteredNotes.map(note => (
                            <button
                                key={note.id}
                                onClick={() => setSelectedNoteId(note.id)}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg transition-all border hover:border-primary/50",
                                    selectedNoteId === note.id
                                        ? "bg-accent border-primary/50 shadow-sm"
                                        : "bg-background border-transparent hover:bg-accent/50"
                                )}
                            >
                                <h3 className={cn("font-medium truncate", !note.title && "text-muted-foreground italic")}>
                                    {note.title || 'Untitled Note'}
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 truncate">
                                    {note.content || 'No content'}
                                </p>
                                <p className="text-[10px] text-muted-foreground/70 mt-2 text-right">
                                    {format(note.updatedAt, 'MMM d, h:mm a')}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-card border rounded-xl p-6 flex flex-col shadow-sm">
                {selectedNote ? (
                    <>
                        <div className="flex items-center justify-between mb-6 border-b pb-4">
                            <input
                                type="text"
                                value={selectedNote.title}
                                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                                placeholder="Note Title"
                                className="text-2xl font-bold bg-transparent border-none focus:outline-none w-full placeholder:text-muted-foreground/50"
                            />
                            <button
                                onClick={() => {
                                    deleteNote(selectedNote.id)
                                    setSelectedNoteId(null)
                                }}
                                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                title="Delete Note"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </div>
                        <textarea
                            value={selectedNote.content}
                            onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                            placeholder="Start typing..."
                            className="flex-1 resize-none bg-transparent border-none focus:outline-none leading-relaxed text-lg placeholder:text-muted-foreground/30"
                        />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-16 w-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Select a note to view</p>
                        <p className="text-sm opacity-70">or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    )
}
