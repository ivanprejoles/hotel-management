import { ScrollArea } from '@/components/ui/scroll-area'
import React from 'react'

const UserLayout = ({
    children
}: {children: React.ReactNode}) => {
  return (
    <div className="w-full h-full relative">
            <div className="w-full h-full flex flex-col justify-center items-center">
                {children}
            </div>
    </div>
  )
}

export default UserLayout