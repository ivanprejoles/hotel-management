'use client'

import dynamic from 'next/dynamic'
import React, { useMemo } from 'react'

import { PiMapPinAreaFill } from "react-icons/pi";
import { FaGlobeAfrica } from "react-icons/fa";

const HotelMap = () => {

  const Map = useMemo(() => dynamic(
    () => import('@/components/map/index'),
    {
      loading: () => 
        <div className="h-full border border-blue-300 shadow rounded-md p-4 w-full mx-auto">
          <div className="animate-pulse h-full w-full space-x-4 relative">
          <PiMapPinAreaFill className="absolute top-0 bottom-0 left-0 right-0 m-auto w-10 h-10 text-gray-400" />
          
          <div className="absolute top-0 bottom-10 left-0 right-0 m-auto w-auto h-auto text-gray-400 text-xl">Loading...</div>
            <div className="flex-1 space-y-6 py-1 w-full h-full flex items-center justify-center">
              <FaGlobeAfrica className="w-2/3 h-2/3 text-gray-400" />
            </div>
          </div>
        </div>,
      ssr: false
    }
  ), [])

  return (
    <div className="w-full h-full flex">
      <Map posix={[14.5995, 120.9842]} />
    </div>
  )
}

export default HotelMap