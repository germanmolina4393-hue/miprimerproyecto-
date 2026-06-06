interface Props {
  number: number
  icon: React.ReactNode
  title: string
  description: string
}

export default function StepCard({ number, icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <span className="absolute -top-1 -right-1 w-6 h-6 bg-coral text-white text-xs font-bold rounded-full flex items-center justify-center">
          {number}
        </span>
      </div>
      <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">{title}</h3>
      <p className="text-charcoal/60 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
