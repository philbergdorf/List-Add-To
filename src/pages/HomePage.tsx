import { Construction } from 'lucide-react'

function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center px-8 pt-[25vh]">
      <div className="w-20 h-20 bg-[#F2F2F7] rounded-3xl flex items-center justify-center mb-5">
        <Construction size={36} color="var(--color-text-secondary)" strokeWidth={1.5} />
      </div>
      <h2 className="text-[20px] font-bold text-[var(--color-text)] text-center">
        Under Construction
      </h2>
      <p className="text-[14px] text-[var(--color-text-secondary)] text-center mt-3 leading-relaxed max-w-[260px]">
        Diese Seite ist noch in Arbeit.
      </p>
    </div>
  )
}

export default HomePage
