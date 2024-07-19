import client from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const {
            reference,
            updatedPayment,
            paymentDue,
            previousPayment
        } = await req.json()

        const validUser = await client.user.findUnique({
            where: {
                emailId: userId
            },
            select: {
                role: true
            }
        })

        if (validUser === null || validUser.role === 'GUEST') {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const totalPayment = previousPayment + updatedPayment;

        if (totalPayment >= paymentDue) {
            const updatedData = await client.reservation.delete({
                where: {
                    id: reference
                },
                select: {
                    value: true,
                    
                }
            })
            
            return NextResponse.json(updatedData);
        }
        
        const updatedData = await client.reservation.update({
            where: {
                id: reference
            },
            data: {
                value: totalPayment,
            },
            select: {
                value: true,
            }
        })

        return NextResponse.json(updatedData)
    } catch (error) {
        console.log('[SERVER_POST][UPDATE_SCHEDULE]', error)
        return new NextResponse('[Internal Error][UPDATE_SCHEDULE]', {status: 500})
    }
}