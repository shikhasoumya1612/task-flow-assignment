import { useState } from 'react'

interface CreateProjectModalProps {
  open: boolean
  loading: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
}

export function CreateProjectModal({ open, loading, onClose, onSubmit }: CreateProjectModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!open) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() || undefined })
    setName('')
    setDescription('')
  }

  const inputClass = "w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-foreground mb-5">New Project</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="proj-name" className="block text-sm font-semibold text-foreground mb-2">
              Name
            </label>
            <input
              id="proj-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className={inputClass}
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label htmlFor="proj-desc" className="block text-sm font-semibold text-foreground mb-2">
              Description <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              id="proj-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="What's this project about?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="rounded-xl bg-card-green px-5 py-2.5 text-sm font-bold text-background hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
