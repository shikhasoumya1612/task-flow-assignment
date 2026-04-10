interface RegisterFormProps {
  name: string
  email: string
  password: string
  error: string | null
  fieldErrors: Record<string, string>
  loading: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterForm({
  name,
  email,
  password,
  error,
  fieldErrors,
  loading,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-card-red/15 px-4 py-3 text-sm font-medium text-card-red">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          autoComplete="name"
          className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
          placeholder="Jane Doe"
        />
        {fieldErrors.name && <p className="mt-1.5 text-xs font-medium text-card-red">{fieldErrors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
          placeholder="jane@example.com"
        />
        {fieldErrors.email && <p className="mt-1.5 text-xs font-medium text-card-red">{fieldErrors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-colors"
          placeholder="At least 6 characters"
        />
        {fieldErrors.password && <p className="mt-1.5 text-xs font-medium text-card-red">{fieldErrors.password}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-card-purple px-4 py-3 text-sm font-bold text-background hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
  )
}
