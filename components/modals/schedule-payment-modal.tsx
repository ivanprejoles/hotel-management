'use client'

import React from 'react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'

import { deleteSchedule, updateSchedule } from '@/lib/redux/tabs/admin-tab'
import { usePaymentModal } from '@/hooks/use-payment-modal'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const updateSchema = z.object({
    reference: z.string().min(1, {
        message: 'reference invalid',
    }),
    updatedPayment: z.coerce.number().min(-100000, {
        message: 'Invald payment'
    }),
    paymentDue: z.number().min(0, {
        message: 'payment due should not be zero'
    }),
    previousPayment: z.number().min(-1000000, {
        message: 'Payment not allowed'
    })
})

const UpdateScheduleModal = () => {
    const {isOpen, reference, paymentDue, previousPayment, roomReference , onClose} = usePaymentModal()
    const dispatch = useDispatch()
    const form = useForm({
        resolver: zodResolver(updateSchema),
        defaultValues: {
            reference: '',
            updatedPayment: 0,
            paymentDue: 0,
            previousPayment: 0,
        }
    })

    form.setValue('reference', reference);  
    form.setValue('paymentDue', paymentDue);
    form.setValue('previousPayment', previousPayment);

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof updateSchema>) => {
        if (values.updatedPayment === 0) return
        if (values.reference.length < 2) return
        values.updatedPayment = Number(values.updatedPayment)
        await axios.patch('/api/admin/updateSchedule', values)
            .then(() => {
                const totalPayment = values.previousPayment + values.updatedPayment

                toast.success('Updating Schedule', {
                    description: 'Schedule successfully updated',
                  })
                  
                if (totalPayment >= values.paymentDue) {
                    dispatch(deleteSchedule({reference, roomReference}))
                } else {
                    dispatch(updateSchedule({reference, roomReference, totalPayment}))
                }
            })
            .catch((error) => {
                console.log(error)
                toast.error('Updating Schedule', {
                    description: 'Error updating schedule',
                  })
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
                    Update Payment
                </DialogTitle>
                <DialogDescription className='text-center text-zinc-500'>
                    Add payment, schedule will be removed once the payment reached the payment due.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
                >
                    <div className="space-y-8 px-6">
                        <FormField
                            control={form.control}
                            name="updatedPayment"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel
                                        className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                    >
                                        Payment
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            disabled={isLoading}
                                            placeholder='Add New Payment'
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
                        <Button type='submit' variant="outline" disabled={isLoading}>
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    </Dialog>
  )
}

export default UpdateScheduleModal