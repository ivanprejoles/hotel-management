'use client'

import '@/lib/styles/scroll.css'

import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import Image from 'next/image';
import { BiCategory } from "react-icons/bi";
import { useMemo, useState } from 'react';
import { Range } from 'react-date-range';
import { useDispatch, useSelector } from 'react-redux';
import { eachDayOfInterval } from 'date-fns';
import moment from 'moment'
import { useMediaQuery } from 'usehooks-ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useRoomModal } from '@/hooks/use-room-modal';
import { useImageModal } from '@/hooks/use-images-modal';
import { useRoomDetails } from '@/hooks/use-image-details';
import { cn } from '@/lib/utils';
import { RootState } from '@/lib/redux/store';
import { addSchedule } from '@/lib/redux/tabs/client-tabs';
import { toLocaleDatestring } from '@/lib/changeDateTime';

import {
    Dialog,
    DialogContent,
    DialogHeader,
} from '@/components/ui/dialog'
import {
    Form
} from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import { ScrollArea } from '../ui/scroll-area';
import Calendar from '../general/calendar';

const initialDateRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
}

const parseDateString = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date;
};

const ScheduleSchema = z.object({
    id: z.string().min(0, {
        message: 'emailId is required'
    }),
    email: z.string().min(0, {
        message: 'Template name is required.'
    }),
    roomId: z.string().min(2, {
        message: 'Room is required'
    }),
    value: z.number().min(0, {
        message: 'Room value is not inserted'
    }),
    startDate: z.preprocess((arg) => {
        if (typeof arg === 'string') {
          return parseDateString(arg);
        }
        return arg;
    }, z.date().min(moment().subtract(1, 'days').toDate(), {
        message: 'Date inappropriate.',
    })),
    endDate: z.preprocess((arg) => {
        if (typeof arg === 'string') {
          return parseDateString(arg);
        }
        return arg;
    }, z.date().min(new Date(moment().toDate()), {
        message: 'Date inappropriate.',
    })),
})


const RoomModal = () => {
    const dispatch = useDispatch()
    
    const isMobile = useMediaQuery('(max-width: 1200px)')
    const roomTemplate = useSelector((state: RootState) => state.clientTemplate.rooms)
    const [dateRange, setDateRange] = useState<Range>(initialDateRange);
    const router = useRouter()
    const {details} = useRoomDetails()
    const { isOpen, data, onClose } = useRoomModal()
    const {onOpen} = useImageModal()

    //number format
    const options = {  maximumFractionDigits: 2   }

    const dateTimes = useMemo(() => {
        if (dateRange.startDate && dateRange.endDate) {
           return Math.floor((dateRange.endDate?.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24))
        } 
        return 0
    }, [dateRange.startDate, dateRange.endDate])
    
    const disabledDates = useMemo(() => {
        let dates: Date[] = [];
        let roomById = roomTemplate[data.roomData.roomId]
        if (!roomById) return undefined
        roomById.reservations.forEach((reservation: { startDate: string | number | Date; endDate: string | number | Date; }) => {
          const range = eachDayOfInterval({
            start: new Date(reservation.startDate),
            end: new Date(reservation.endDate),
          })
          dates = [...dates, ...range];
        })
        
        return dates;
    }, [roomTemplate, data.roomData.roomId])

    const ScheduleForm = useForm({
        resolver: zodResolver(ScheduleSchema),
        defaultValues: {
            id: '',
            email: '',
            roomId: '',
            startDate: dateRange.startDate as Date,
            endDate: dateRange.endDate as Date,
            value: details.value,
        }
    })

    ScheduleForm.setValue('email', data.userData.email);
    ScheduleForm.setValue('id', data.userData.id);
    ScheduleForm.setValue('roomId', data.roomData.roomId);
    ScheduleForm.setValue('startDate', dateRange.startDate || new Date ());
    ScheduleForm.setValue('endDate', dateRange.endDate || new Date());
    ScheduleForm.setValue('value', details.value*dateTimes);

    const isLoading = ScheduleForm.formState.isSubmitting;    

    const onSubmit = async (values: z.infer<typeof ScheduleSchema>) => {
        if (values.email.length < 1 || values.id.length < 1) {
            onClose()
            console.log('redirect to sign in')
            return router.push('/sign-in')
        }

        await axios.post('/api/client/addSchedule', values)
            .then((response) => {
                if (response?.data) {

                    toast.success('Adding Schedule', {
                        description: 'Schedule successfully added',
                      })

                    dispatch(addSchedule({id: data.roomData.roomId, reservations: [response.data]}))
                    ScheduleForm.reset()
                }
            })
            .catch((error) => {
                console.log(error)
                toast.error('Adding Schedule', {
                    description: 'Error adding schedule',
                  })
            })
            .finally(() => {
                ScheduleForm.reset()
                onClose()
                setDateRange(initialDateRange)
            })
    }

    const imageOpen = () => {
        onOpen()
    }
    
    const handleClose = () => {
        onClose();
    }

    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className=' p-0 w-full max-w-[90vw] md:max-w-[80vw] h-[90vh] shadow-lg'>
                <DialogHeader>
                    
                </DialogHeader>
                <ScrollArea>
                    <div className='w-full h-full md:px-10'>
                        <div className="h-[4rem] w-full flex flex-row justify-between items-center">
                            <h1 className='text-xl font-semibold'>
                                {data.roomData.title}
                            </h1>
                        </div>
                        <div className="h-[22rem] w-full grid grid-cols-1 md:grid-cols-2 gap-2 p-2 relative">
                            <div onClick={imageOpen} className='relative hidden md:block cursor-pointer'>
                                    <Image 
                                        width={0}
                                        height={0}
                                        src={details.images[0]}
                                        alt='Image'
                                        layout='fill' 
                                        className='w-full h-full object-cover rounded-md' 
                                    />
                            </div>
                            <div className="grid relative grid-cols-2 grid-rows-2 gap-2">
                            {details.images.length > 1 && details.images.map((image, key) => (
                                (key !== 1 && key !== 5) && (
                                    <div onClick={imageOpen} className='relative cursor-pointer' key={key}>
                                        <Image 
                                            width={0}
                                            height={0}
                                            src={image}
                                            alt='Image'
                                            layout='fill' 
                                            className='w-full h-full object-cover rounded-md' 
                                        />
                                    </div>
                                )
                            ))}
                                <Button onClick={imageOpen} variant="outline" className='absolute bottom-5 right-5 flex flex-row items-center'>
                                    <BiCategory className='mr-2' />
                                    Show all photos
                                </Button>
                            </div>
                        </div>
                        <div className={cn(
                            "h-auto w-full grid grid-cols-3",
                            isMobile && 'grid-cols-1' 
                        )}>
                            <div className="h-auto col-span-2">
                                <div className="m-5 max-w-2xl font-sans">
                                    <h1 className="text-2xl mb-2">
                                        {details.title}
                                    </h1>
                                    <p className="mb-2">
                                        {details.bedrooms} bedroom
                                    </p>
                                    <div className="flex items-center mb-4 relative">
                                        <Image
                                            width={0}
                                            height={0}
                                            src="https://firebasestorage.googleapis.com/v0/b/emp-portal-b03eb.appspot.com/o/serverImage%2Fistockphoto-1026205392-612x612.jpg?alt=media&token=e2982493-33f3-4a0c-b637-e7bca9eb3e6d"
                                            alt="host"
                                            className="rounded-full mr-3 object-cover"
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <p>
                                            {details.description}
                                        </p>
                                    </div>
                                    <div className="w-full h-auto flex justify-center items-center mt-4 border-t">
                                        <Calendar
                                            value = {dateRange}
                                            disabledDates={disabledDates}
                                            onChange={(value) => setDateRange(value.selection)}
                                            number={(isMobile) ? 1 : 2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={cn(
                                "relative",
                            )}>
                                <div className="h-auto p-6 w-full sticky top-10 rounded-md border shadow-md">
                                    <div className="">
                                        <span>
                                            ₱ {details.value}
                                        </span>
                                        <span>
                                            {' night'}
                                        </span>
                                    </div>
                                    <div className="h-5 w-full"></div>
                                    <div className="flex flex-col space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <label htmlFor="startDate" className="text-sm font-medium">
                                                Check In:
                                                </label>
                                                <span className="text-gray-500">{dateRange.startDate && toLocaleDatestring(dateRange.startDate)}</span>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <label htmlFor="checkOutDate" className="text-sm font-medium">
                                                Check Out:
                                                </label>
                                                <span className="text-gray-500">{dateRange.endDate && toLocaleDatestring(dateRange.endDate)}</span>
                                            </div>
                                        </div>
                                    <div className="h-5 w-full"></div>
                                    <div className="h-auto w-full">
                                        <Form {...ScheduleForm}>
                                            <form onSubmit={ScheduleForm.handleSubmit(onSubmit)}>
                                                <Button 
                                                    disabled={isLoading} 
                                                    variant='blue' 
                                                    type='submit' 
                                                    size='lg' 
                                                    className='w-full text-lg'
                                                >
                                                    Reserve
                                                </Button>
                                            </form>
                                        </Form>
                                    </div>
                                    <div className="h-5 w-full"></div>
                                    <div className="flex justify-center items-center">
                                        {"you won't be charged yet"}
                                    </div>
                                    <div className="h-5 w-full"></div>
                                    {true && (
                                        <div className='flex flex-col gap-5'>
                                            <div className="h-5 w-full flex flex-row justify-between">
                                                <div className="text-gray-900">
                                                    {   (dateTimes) &&
                                                        dateTimes > 0
                                                        ? '₱ '+
                                                            Intl.NumberFormat("en-US",options).format(details.value)
                                                            +' x '+ dateTimes + (dateTimes > 1 ? ' nights': ' night')
                                                        : ''
                                                    }
                                                </div>
                                                <div className="text-black font-bold">
                                                    {   (dateTimes) &&
                                                        dateTimes > 0
                                                        ? '₱ '+Intl.NumberFormat("en-US",options).format(details.value*dateTimes)
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
 
export default RoomModal;