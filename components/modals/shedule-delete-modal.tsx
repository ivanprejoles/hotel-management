'use client'

import React from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useDeleteModal } from '@/hooks/use-delete-schedule-modal'
import { deleteSchedule } from '@/lib/redux/tabs/admin-tab'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ScheduleDeleteModal = () => {
    const {isOpen, reference, onClose, text, roomReference} = useDeleteModal()
    const dispatch = useDispatch()

    const deleteSchema = z.object({
        reference: z.string().min(1, {
            message: 'reference invalid',
        }),
        validation: z.literal( text, {
            message: `Input must be equal to ${text}`
        })
    })

    const form = useForm({
        resolver: zodResolver(deleteSchema),
        defaultValues: {
            reference: '',
            validation: ''
        }
    })

    form.setValue('reference', reference);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof deleteSchema>) => {
        if (values.reference.length < 2) return
        await axios.patch('/api/admin/deleteSchedule', values)
            .then(() => {

                toast.success('Deleting Schedule', {
                    description: 'Schedule successfully deleted',
                  })

                dispatch(deleteSchedule({reference, roomReference}))
            })
            .catch((error) => {
                toast.error('Updating Schedule', {
                    description: 'Error deleting schedule',
                  })
                console.log(error)
            })
            .finally(() => {
                form.reset()
                onClose()
            })
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className='bg-white text-black p-0 overflow-hidden'>
            <DialogHeader className='pt-8 px-6'>
                <DialogTitle className='text-2xl text-center font-bold'>
                    Delete Schedule
                </DialogTitle>
                <DialogDescription className='text-center text-zinc-500'>
                   Delete your schedule by typing this <span className='font-bold'>{text}</span> to verify.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
                >
                    <div className="space-y-8 px-6">
                        <FormField
                            control={form.control}
                            name="validation"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                    >
                                        Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder='Enter server name'
                                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter className='bg-gray-100 px-6 py-4'>
                        <Button variant="destructive" disabled={isLoading}>
                            Delete
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
    )
}

export default ScheduleDeleteModal