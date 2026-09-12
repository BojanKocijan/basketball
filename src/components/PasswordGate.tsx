import { useState, type FormEvent } from 'react'
import { usePasswordGate } from '../hooks/usePasswordGate'

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const { unlocked, tryUnlock, passwordConfigured } = usePasswordGate()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (tryUnlock(value)) {
      setError(false)
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 dark:bg-neutral-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-4 rounded-3xl border border-black/10 bg-white p-6 text-center shadow-sm dark:border-white/10 dark:bg-neutral-900"
      >
        <p className="text-4xl">🏀</p>
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
          U8 Basketball Training
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Enter the team password to continue.
        </p>
        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="Password"
          className={`w-full rounded-2xl border px-4 py-3 text-center text-sm outline-none dark:bg-neutral-800 dark:text-neutral-100 ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-black/10 focus:border-orange-400 dark:border-white/10'
          }`}
        />
        {error && <p className="text-xs font-semibold text-red-500">Wrong password, try again.</p>}
        {!passwordConfigured && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            No password is configured for this build yet.
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white active:bg-orange-600"
        >
          Unlock
        </button>
      </form>
    </div>
  )
}
