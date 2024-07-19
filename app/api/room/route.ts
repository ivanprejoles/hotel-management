import client from "@/lib/prismadb"
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
) {
    try {

        const { userId } = auth()
        
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }
        
        const {
            title
        } = await req.json()
        
        const room = await client.room.create({
            data: {
                title
            },
            select: {
                id: true,
                status: true,
                title: true,
                reservations: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        paid: true,
                        totalValue: true,
                        value: true,
                        user: {
                            select: {
                                email: true,
                                id: true,
                                number: true,
                                referenceCode: true,
                            },
                        },
                        createdAt: true,
                    }
                }
            }
        })
        
        return NextResponse.json(room)
    } catch (error) {
        console.log('[SERVER_POST][GET_ROOMS]', error)
        return new NextResponse('[Internal Error][GET_ROOMS]', {status: 500})
    }
}