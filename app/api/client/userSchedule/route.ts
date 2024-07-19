import { getStartOfToday } from "@/lib/changeDateTime";
import client from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
) {
    try {
        const {userId} = auth()
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const users = await client.user.findUnique({
            where: {
                emailId: userId,
                role: 'GUEST',
            },
            select: {
                email: true,
                referenceCode: true,
                tokens: true,
                createdAt: true,
                number: true,
                reservations: {
                    select: {
                        startDate: true,
                        endDate: true,
                        createdAt: true,
                        room: {
                            select: {
                                title: true
                            }
                        },
                        totalValue: true,
                        value: true
                    }
                }
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.log('[SERVER_POST][GET_USER_SCHEDULE]', error)
        return new NextResponse('[Internal Error][GET_USER_SCHEDULE]', {status: 500})
    }
}