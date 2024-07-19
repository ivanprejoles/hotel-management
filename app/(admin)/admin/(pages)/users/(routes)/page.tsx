'use client'

import axios from 'axios'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { getRecentDatefromObject } from '@/lib/methods/getRecentDate'
import { userState } from '@/lib/redux/slices/users-slice'
import { addPreviousUser, addUsers } from '@/lib/redux/tabs/admin-tab'
import { RootState } from '@/lib/redux/store'
import { toLocaleDatestring } from '@/lib/changeDateTime'

import { Button } from '@/components/ui/button'
import { RoomSchedules } from '../../rooms/_components/room-schedule'

const UsersPage = () => {
  const userTemplate = useSelector((state: RootState) => state.adminTemplate.users)

  const dispatch = useDispatch()

  useEffect(() => {
    const getUsers = async () => {
      await axios.post('/api/users')
        .then((response) => {
          const data: userState[] = response.data

          const objectResponse = data.reduce((acc: any, user: any) => {
            acc[user.id]= {...user}
            return acc
          }, {})

          toast.success('Users Information', {
            description: 'Users Information Fetched',
          })

          dispatch(addUsers(objectResponse))
        })
        .catch((error) => {
          toast.error('Users Information', {
            description: 'Error fetching user information, check your internet',
          })
          console.log(error)
        })
    }

    const getNewUsers = async () => {
      const recentDate = getRecentDatefromObject(userTemplate)

      await axios.post('/api/newUsers', {recentDate})
        .then((response) => {
          const currentObjectResponse = response.data.previousUsers.reduce((acc: any, user: any) => {
            const {reservations, id, ...other} = user
            acc[id]= {
              ...other,
              createdAt: toLocaleDatestring(other.createdAt)
            }
            return acc
          }, {})

          const newObjectResponse = response.data.newUsers.reduce((acc: any, user: any) => {
            const {reservations, id, ...other} = user
            acc[id]= {
              ...other,
              createdAt: toLocaleDatestring(other.createdAt)
            }
            return acc
          }, {})
 
          toast.success('Users Information', {
            description: 'Users Information Fetched',
          })

          dispatch(addUsers(newObjectResponse))
          dispatch(addPreviousUser(currentObjectResponse))

        })
        .catch((error) => {
          toast.error('Users Information', {
            description: 'Error fetching user information, check your internet',
          })
          console.log(error)
        })
    }

    if (Object.keys(userTemplate).length <= 0) {
      getUsers()
    } else {
      getNewUsers()
    }
  }, [])


  const data = Object.values(userTemplate).map((user) => {
    return user
  })
  
  return (
    <>
      <div className="w-full h-12 border-b-2 p-2 flex flex-row items-center">
          <Link href='/'>
            <Button variant='link' className='text-lg'>Home</Button>
          </Link>
      </div>
      <div className="flex-1 relative h-full scroll overflow-x-auto">
        <div className="w-full h-auto p-2 relative border-b-2 ">
          <div className="w-full h-auto p-2">
            <h1 className="text-lg font-bold ">User Information</h1>
          </div>
          <div className="h-auto w-full relative">
            <RoomSchedules data={data} user={true} />
          </div>
        </div>
      </div>
    </>
  )
}

export default UsersPage