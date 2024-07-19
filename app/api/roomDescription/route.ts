import client from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST (
    req: Request
) {
    try {
        
        const roomsDetails = await client.roomDescription.findFirst({
            select: {
              value: true,
              bedrooms: true,
              description: true,
              images: true,
              title: true
            }
        })

        return NextResponse.json(roomsDetails)
    } catch (error) {
        console.log('[SERVER_POST][GET_ROOMS_DESCRIPTION]', error)
        return new NextResponse('[Internal Error][GET_ROOMS_DESCRIPTION]', {status: 500})
    }
}