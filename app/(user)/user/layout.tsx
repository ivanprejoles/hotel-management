import ErrorAccess from '@/app/(admin)/_components/error-access'
import MainHeader from '@/app/(market)/_components/Header/main-header'
import ReduxProvider from '@/components/providers/redux-provider'
import getCurrentUser from '@/lib/current-user'
import React from 'react'

const UserLayout = async ({
    children
}: {children: React.ReactNode}) => {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'GUEST') return <ErrorAccess />

  return (
    <div className="flex flex-col w-full h-full bg-white">
      <MainHeader user={currentUser} />
      <main className='w-full flex-1 backdrop-blur-sm'>
        <section className="w-full absolute h-full top-0 overflow-hidden">
          <div className="h-full flex dark:bg-[#1F1F1F] relative">
              <main className="flex-1 h-full overflow-y-hidden flex flex-col">
                <ReduxProvider>
                  {children}
                </ReduxProvider>
              </main>
          </div>
        </section>
      </main>
    </div>
  )
}

export default UserLayout