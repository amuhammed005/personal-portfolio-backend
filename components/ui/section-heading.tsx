interface SectionHeadingProps {
  title: string
}

export function SectionHeading({ title }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground whitespace-nowrap">
        {title}
      </h2>
      <div className="h-px bg-border flex-1 max-w-xs" />
    </div>
  )
}
