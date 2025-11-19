import { useState, useEffect } from 'react'
import { useStore } from '../store/useStore'
import { User, Save } from 'lucide-react'

export default function Profile() {
    const { profile, updateProfile } = useStore()
    const [name, setName] = useState(profile.name)
    const [about, setAbout] = useState(profile.about || '')
    const [photoUrl, setPhotoUrl] = useState(profile.photoUrl || '')
    const [isEditing, setIsEditing] = useState(false)

    // Sync local state with store when not editing or when store updates
    useEffect(() => {
        if (!isEditing) {
            setName(profile.name)
            setAbout(profile.about || '')
            setPhotoUrl(profile.photoUrl || '')
        }
    }, [profile, isEditing])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateProfile({
            name,
            about,
            photoUrl: photoUrl || undefined
        })
        setIsEditing(false)
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
            <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>

            <div className="bg-card border rounded-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
                <div className="px-8 pb-8">
                    <div className="relative -mt-16 mb-6">
                        <div className="h-32 w-32 rounded-full border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
                            {photoUrl ? (
                                <img src={photoUrl} alt={name} className="h-full w-full object-cover" />
                            ) : (
                                <User className="h-16 w-16 text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Display Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Profile Photo URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="url"
                                        value={photoUrl}
                                        onChange={(e) => setPhotoUrl(e.target.value)}
                                        placeholder="https://example.com/avatar.jpg"
                                        className="flex-1 h-10 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enter a URL for your profile picture.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">About</label>
                                <textarea
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 h-10 px-4 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                                >
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="h-10 px-4 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold">{name}</h2>
                                {about && (
                                    <p className="text-muted-foreground mt-2 max-w-lg">
                                        {about}
                                    </p>
                                )}
                            </div>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="h-10 px-4 rounded-md border bg-background hover:bg-accent hover:text-accent-foreground transition-colors font-medium"
                            >
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
