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

        const users = await client.user.findMany({
            where: {
                role: 'GUEST',
            },
            select: {
                email: true,
                referenceCode: true,
                tokens: true,
                createdAt: true,
                number: true,
                reservations: {
                    where: {
                        endDate: {
                            gte: getStartOfToday()
                        }
                    },
                    select: {
                        startDate: true,
                        endDate: true,
                        createdAt: true
                    }
                }
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.log('[SERVER_POST][GET_USERS]', error)
        return new NextResponse('[Internal Error][GET_USERS]', {status: 500})
    }
}