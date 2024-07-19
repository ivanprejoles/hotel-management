import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const RoomLayout = ({
    children
}: {children: React.ReactNode}) => {
  return (
    <div className="w-full h-full overflow-auto">
      <div className="w-full h-auto flex justify-center items-center">
          {children}
      </div>
    </div>
  )
}

export default RoomLayout