import React from 'react'

const VirtualTour = () => {
  return (
    <div className="border-gray-500 text-gray-300 w-full h-[20rem] md:h-[35rem] overflow-hidden z-10 relative">
        <video
            className="
                w-full
                h-full
                object-cover
                brightness-[110%]
            "
            autoPlay
            muted
            loop
            poster={'/images/house-blue-led.jpg'}
            src={'https://firebasestorage.googleapis.com/v0/b/emp-portal-b03eb.appspot.com/o/serverImage%2Fhouse-outside.mp4?alt=media&token=b8fefcbe-57d8-49f2-a0a8-aa5f059fedd7'}
        />
        <div className="w-[20rem] md:w-[40rem] h-auto mx-auto absolute left-0 right-0 bottom-[1%] md:bottom-[10%] p-8 items-center flex flex-col md:gap-4">
            <h1 className='w-full h-auto text-center line-clamp-1 text-ellipsis text-2xl md:text-4xl font-sans font-medium text-white tracking-wider drop-shadow-2xl'>Rental Title</h1>
            <h2 className='w-full text-center line-clamp-1 text-ellipsis text-balance md:text-lg text-white font-medium'> Simple rental introduction</h2>
        </div>
    </div>
  )
}

export default VirtualTour