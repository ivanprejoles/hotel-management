import React from 'react'
import { Separator } from './separator'
import { cn } from '@/lib/utils'

interface LedSeparatorProps {
  className?: string
}

const LedSeparator = ({
  className
}: LedSeparatorProps) => {
  return (
    <Separator className={cn("relative", className)}>
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
    </Separator>
  )
}

export default LedSeparator