import { FC } from 'react'

interface SectionHeadingProps {
  children: React.ReactNode
  className?: string
}

export const SectionHeading: FC<SectionHeadingProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl font-bold text-purple-600 mb-6 ${className}`}>
      {children}
    </h2>
  )
}
