'use client'

import Image from 'next/image'
import React from 'react'

import {
  motion,
} from "framer-motion";
import Link from 'next/link';

const toTopAnimation = {
  hidden: {
    opacity: 0,
    y: 100
  },
  reveal: {
    opacity: 100,
    y: 0,
    transition: {
      duration: 1,
    }
  }
}

const toTopAnimationDelay = {
  hidden: {
    opacity: 0,
    y: 100
  },
  reveal: {
    opacity: 100,
    y: 0,
    transition: {
      duration: 1,
      delay: .5
    }
  }
}

const toLeftAnimation = {
  hidden: {
    opacity: 0,
    x: 100
  },
  reveal: {
    opacity: 100,
    x: 0,
    transition: {
      duration: 1,
    }
  }
}

const HomeImage = () => {

  return (
    <div className='h-[25rem] w-[100vw] grid grid-cols-1 lg:grid-cols-2 relative bg-[#0E1725]'>
      <motion.div
        variants={toTopAnimation}
        viewport={{
          once: true
        }}
        initial="hidden"
        whileInView="reveal"
        className="flex flex-col p-4 gap-4 justify-start items-start px-4 md:px-16"
      >
          <p className='text-lg text-white'>Let us help you</p>
          <h1 className="relative z-10 text-4xl font-semibold md:text-6xl line-clamp-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-300 text-wrap px-2">
              Find Real Estate and Got Your Dream Space 
          </h1>
          <p className="text-white max-w-lg my-4 text-sm text-center relative z-10">
            Zen Dental Studio brings you a modern, calming experience that leaves your teeth healthy and your soul rejuvenated.
          </p>
      </motion.div>
      <div className="w-full h-full relative hidden lg:block">
        <div className="absolute top-20 -left-20 w-full h-full">
          <div className="h-full relative w-full p-8 py-0">
            <motion.div 
              variants={toLeftAnimation}
              viewport={{
                once: true
              }}
              initial="hidden"
              whileInView="reveal"
              className="relative shadow-xl rounded-2xl bg-white px-4 py-4 h-full flex flex-col justify-end items-start"
            >
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-90 bg-red-500 rounded-full blur-3xl" />
              <Image
                alt='Home'
                src='/images/dark-house-landscape.png'
                layout='fill'
                width={0}
                height={0}
                className='object-cover object-bottom rounded-2xl'
              />
            </motion.div>
            <motion.div 
              variants={toTopAnimationDelay}
              viewport={{
                once: true
              }}
              initial="hidden"
              whileInView="reveal"
              className="justify-center w-3/4 p-2 h-auto bg-white absolute bottom-10 -left-[20rem] rounded-xl shadow-xl grid gap-4 md:grid-cols-2 lg:grid-cols-4"
            >
              <div className="rounded-xl bg-card text-card-foreground shadow">
                <div className="p-1 px-2 flex flex-row items-center justify-between space-y-0">
                  <h3 className="tracking-tight text-sm :text-md font-bold">Rental Value</h3>
                </div>
                <div className="p-1 px-2">
                  <div className="text-sm md:text-md font-medium">₱5,231.89</div>
                </div>
              </div>
              <div className="rounded-xl bg-card text-card-foreground shadow">
                <div className="p-1 px-2 flex flex-row items-center justify-between space-y-0">
                  <h3 className="tracking-tight text-sm :text-md font-bold">Laundry Value</h3>
                </div>
                <div className="p-1 px-2">
                  <div className="text-sm md:text-md font-medium">₱231.89</div>
                </div>
              </div>
              <div className="rounded-xl bg-card text-card-foreground shadow">
                <div className="p-1 px-2 flex flex-row items-center justify-between space-y-0">
                  <h3 className="tracking-tight text-sm :text-md font-bold">Long Term Rate</h3>
                </div>
                <div className="p-1 px-2">
                  <div className="text-sm md:text-md font-medium">30-40% off</div>
                </div>
              </div>
              <div className="h-full relative w-full">
                <button className="p-[3px] relative w-full h-full">
                  <div className="absolute top-0 inset-0 bg-gradient-to-r from-blue-500 to-black rounded-lg" />
                  <Link href="/#Listings" >
                    <div className="justify-center items-center w-full h-full text-center flex bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                      Book
                    </div>
                  </Link>
                </button>
              </div>
            </motion.div>
          </div>  
        </div>
      </div>
    </div>
  )
}

export default HomeImage