import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  onClick: () => void
  colorIndex: number
  colSpan: number
  rowSpan: number
}

const cardColors = [
  'bg-card-green',
  'bg-card-yellow',
  'bg-card-purple',
  'bg-card-red',
  'bg-card-blue',
  'bg-card-orange',
  'bg-card-teal',
  'bg-card-pink',
]

function getSpanClass(col: number, row: number) {
  if (col === 2 && row === 2) return 'col-span-1 sm:col-span-2 row-span-1 sm:row-span-2'
  if (col === 2 && row === 1) return 'col-span-1 sm:col-span-2 row-span-1'
  if (col === 1 && row === 2) return 'col-span-1 row-span-1 sm:row-span-2'
  return 'col-span-1 row-span-1'
}

export function ProjectCard({ project, onClick, colorIndex, colSpan, rowSpan }: ProjectCardProps) {
  const color = cardColors[colorIndex % cardColors.length]
  const spanClass = getSpanClass(colSpan, rowSpan)
  const isLarge = colSpan === 2 && rowSpan === 2
  const isTall = rowSpan === 2 && colSpan === 1

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl ${color} p-5 hover:brightness-105 active:scale-[0.98] transition-all flex flex-col justify-between overflow-hidden ${spanClass}`}
    >
      <div>
        <h3 className={`font-bold text-black leading-snug ${isLarge ? 'text-2xl' : 'text-base'}`}>
          {project.name}
        </h3>
        {project.description && (
          <p className={`mt-2 font-medium text-black/60 ${isLarge || isTall ? 'text-sm line-clamp-4' : 'text-xs line-clamp-2'}`}>
            {project.description}
          </p>
        )}
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-black/40">
          {new Date(project.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        <span className="rounded-lg bg-black/10 px-2 py-0.5 text-xs font-bold text-black/70">
          Open →
        </span>
      </div>
    </button>
  )
}
