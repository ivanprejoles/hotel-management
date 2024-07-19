import { currentUser } from '@clerk/nextjs/server';
import client from "./prismadb"
import { $Enums } from '@prisma/client';

export interface userType {
    id: string;
    email: string;
    role: $Enums.MemberRole;
    reservations?: {
        startDate: Date;
        endDate: Date;
    }[];
    referenceCode: string | null;
}

const getCurrentUser = async () => {

    const CurrentUser = await currentUser()

    if (!CurrentUser) return undefined

    let user: userType|null = await client.user.findFirst({
        where: {
            emailId: CurrentUser.id
        },
        select: {
             id: true,
             email: true,
             referenceCode: true,
             role: true,
             reservations: {
                where: {
                    endDate: {
                        gt: new Date()
                    }
                },
                select: {
                    startDate: true,
                    endDate: true,
                }
             }
        }
    })
    
    if (!user) {
        const newUser = await client.user.create({
            data: {
                email: CurrentUser.emailAddresses[0].emailAddress,
                emailId: CurrentUser.id,
                number: String(CurrentUser.phoneNumbers[0]) || '',
                referenceCode: CurrentUser.id+ Date.now(),
            }
        })

        user = {
            role: newUser.role,
            email: newUser.email,
            id: newUser.id,
            referenceCode: newUser.referenceCode
        } 
    }
    
    return user;
}

export default getCurrentUser