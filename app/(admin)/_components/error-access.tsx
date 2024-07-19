import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const ErrorAccess = () => {
    return (
        <div className="w-full h-full gap-4 relative md:px-8 pt-4 pb-8 flex flex-col items-center">
              <div className="w-full p-2 flex items-center">
                <Link href='/'>
                  <Button variant='link' className='text-lg'>Home</Button>
                </Link>
              </div>
              <div className="w-full flex-1 md:p-4 flex flex-col">
                    Cant access this website
              </div>
        </div>
      )
}

export default ErrorAccess