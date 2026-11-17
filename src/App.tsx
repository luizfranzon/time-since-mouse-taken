import { onValue, ref, serverTimestamp, update } from 'firebase/database'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { db } from './firebase'

const pad = (n: number) => String(n).padStart(2, '0')

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return [days, hours, minutes, seconds].map(pad).join(':')
}

function App() {
  const [now, setNow] = useState(Date.now())
  const [startedAt, setStartedAt] = useState<number | null>(null)
  const [password, setPassword] = useState(localStorage.getItem('password') ?? '')
  const [error, setError] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    return onValue(ref(db, 'startedAt'), (snap) => setStartedAt(snap.val()))
  }, [])

  function openModal() {
    setError('')
    dialogRef.current?.showModal()
  }

  async function reset(e: FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await update(ref(db), { startedAt: serverTimestamp(), attempt: password })
      localStorage.setItem('password', password)
      dialogRef.current?.close()
    } catch {
      localStorage.removeItem('password')
      setError('Senha incorreta')
    }
  }

  const elapsed = startedAt === null ? 0 : now - startedAt

  return (
    <main className="min-h-screen grid place-items-center bg-neutral-950 text-white">
      <button
        onClick={openModal}
        className="absolute top-4 right-4 rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-500"
      >
        Resetar
      </button>

      <div className="text-center">
        <p className="mb-6 text-2xl font-semibold">
          Tempo desde que o luiz pegou meu mouse pela ultima vez
        </p>
        <h1 className="font-mono text-7xl font-bold tabular-nums">
          {format(elapsed)}
        </h1>
      </div>

      <dialog
        ref={dialogRef}
        className="m-auto rounded-lg bg-neutral-900 p-6 text-white backdrop:bg-black/60"
      >
        <form onSubmit={reset} className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">Resetar contador</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="rounded bg-neutral-800 px-3 py-2"
          />
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded bg-neutral-700 px-4 py-2 hover:bg-neutral-600"
            >
              Cancelar
            </button>
            <button className="rounded bg-red-600 px-4 py-2 font-semibold hover:bg-red-500">
              Confirmar
            </button>
          </div>
        </form>
      </dialog>
    </main>
  )
}

export default App
