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

        const {
            recentDate
        } = await req.json()

        const previousUsers = await client.user.findMany({
            where: {
                role: 'GUEST',
                createdAt: {
                    lte: recentDate
                }
            },
            select: {
                tokens: true,
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
                        createdAt: true,
                        roomId: true,

                    }
                }
            }
        })

        const newUsers = await client.user.findMany({
            where: {
                role: 'GUEST',
                createdAt: {
                    gt: recentDate
                }
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

        return NextResponse.json({previousUsers, newUsers})
    } catch (error) {
        console.log('[SERVER_POST][GET_NEW_USERS]', error)
        return new NextResponse('[Internal Error][GET_NEW_USERS]', {status: 500})
    }
}