import type { Project } from '@/types'
import { ProjectCard } from './ProjectCard'

interface ProjectListProps {
  projects: Project[]
  onSelect: (id: string) => void
}

const bentoPattern = [
  { col: 2, row: 2 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
  { col: 1, row: 1 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 2, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 2 },
]

function getBentoSize(index: number) {
  return bentoPattern[index % bentoPattern.length]
}

export function ProjectList({ projects, onSelect }: ProjectListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[140px]">
      {projects.map((project, index) => {
        const size = getBentoSize(index)
        return (
          <ProjectCard
            key={project.id}
            project={project}
            colorIndex={index}
            colSpan={size.col}
            rowSpan={size.row}
            onClick={() => onSelect(project.id)}
          />
        )
      })}
    </div>
  )
}
