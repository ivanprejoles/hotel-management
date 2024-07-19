import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import React from 'react'
import Link from 'next/link'

import { UserMenu } from './user-menu'
import { userType } from '@/lib/current-user'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import LedSeparator from '@/components/ui/led-separator'

interface MainHeaderProps {
    user?: userType
}

const MainHeader = async ({
    user
}: MainHeaderProps) => {


  return (
    <div className='w-full h-auto sticky bg-[#0E1725]'>
        <div className="w-full h-[4rem] flex flex-row justify-between items-center p-2 shadow-sm z-50 dark:bg-background text-black dark:text-white">
            <div className=""></div>
            <div className="flex flex-row h-full items-center gap-4">
                {user?.id
                ? (
                    <>
                        <UserMenu role={user.role} />
                        <ClerkLoaded>
                            <UserButton
                                appearance={{
                                    elements: {
                                        userButtonAvatarBox: 'w-10 h-10'
                                    }
                                }}
                                afterSignOutUrl="/"  
                            />
                        </ClerkLoaded>
                        <ClerkLoading>
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </ClerkLoading>
                    </>
                )
                : (
                    <>
                        <Link href='/sign-up'>
                            <Button>Register</Button>
                        </Link>
                        <Link href='/sign-in'>
                            <Button>Login</Button>
                        </Link>
                    </>
                )}
            </div>
        </div>
        <LedSeparator />
    </div>
  )
}

export default MainHeader