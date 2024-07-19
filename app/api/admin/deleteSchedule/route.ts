import client from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request
) {
    try {
        const {userId} = auth()

        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const {
            reference
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

        const deletedData = await client.reservation.delete({
            where: {
                id: reference
            },
            select: {
                value: true
            }
        })

        return NextResponse.json(deletedData)
    } catch (error) {
        console.log('[SERVER_POST][DELETE_SCHEDULE]', error)
        return new NextResponse('[Internal Error][DELETE_SCHEDULE]', {status: 500})
    }
}