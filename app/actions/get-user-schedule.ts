import client from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const getUserSchedule = async () => {
    try {
        const {userId, redirectToSignIn} = auth()
        
        if (!userId) {
            return redirectToSignIn()
        }

        const accountData = await client.user.findUnique({
            where: {
                emailId: userId,
                role: 'GUEST'
            },
            select: {
                email: true,
                number: true,
                referenceCode: true,
                reservations: {
                    select: {
                        startDate: true,
                        endDate: true,
                        totalValue: true,
                        value: true,
                        room: {
                            select: {
                                title: true,
                            }
                        }
                    }
                }
            }
        })


        return accountData;

    } catch (error) {
        console.log('[ACTION_SIDE][GET_USER_SCHEDULE]', error);
        return null
    }
    
}

export default getUserSchedule