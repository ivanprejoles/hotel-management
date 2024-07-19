'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AdminMainPage = () => {
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        router.push('/admin/users')
    })

    if (isMounted) {
        return (
            <div>Redirecting to Users Table...</div>
        )
    }
  return (
    <div>Redirected</div>
  )
}

export default AdminMainPage