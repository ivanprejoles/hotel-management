'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const UserMainPage = () => {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        router.push('/user/account')
    })

    if (isMounted) {
        return (
            <div>Redirecting to your Account...</div>
        )
    }
  return (
    <div>Redirected</div>
  )
}

export default UserMainPage