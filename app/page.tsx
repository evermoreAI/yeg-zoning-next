export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-[#0a0c10]">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="text-[#c8a951] text-3xl">⚡</span>
          <h1
            className="text-[#e8e0d0] text-4xl font-bold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            YEG ZONING
          </h1>
        </div>
        <p
          className="text-[#8a8070] text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          COMMAND CENTER
        </p>
        <div className="mt-6 w-48 h-px bg-gradient-to-r from-transparent via-[#c8a951] to-transparent opacity-40" />
        <p className="text-[#2a3545] text-xs tracking-widest uppercase mt-2">
          Initializing...
        </p>
      </div>
    </main>
  )
}
