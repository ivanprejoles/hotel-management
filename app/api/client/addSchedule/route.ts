import client from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = auth();

        // Ensure user is authenticated
        if (!userId) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        const {
            email,
            id,
            roomId,
            startDate,
            endDate,
            value
        } = await req.json()

        const addedSchedule = await client.reservation.create({
            data: {
                email,
                paid: false,
                startDate,
                endDate,
                userId: id,
                totalValue: value,
                value: 0,
                roomId
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
            }
        });

        return NextResponse.json(addedSchedule);
    } catch (error) {
        console.log('[SERVER_POST][ADD_CLIENT_SCHEDULE] Error:', error);

        if (error instanceof Error) {
            // Handle known errors
            return new NextResponse(`[Error][ADD_CLIENT_SCHEDULE] ${error.message}`, { status: 400 });
        }

        // Handle unknown error type
        return new NextResponse('[Internal Error][ADD_CLIENT_SCHEDULE]', { status: 500 });
    }
}
