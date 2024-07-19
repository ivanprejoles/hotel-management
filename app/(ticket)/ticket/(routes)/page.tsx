'use client'

import 'react-dropzone-uploader/dist/styles.css';

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as z from 'zod'
import { useForm } from 'react-hook-form';
import axios from 'axios'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {storage} from '@/firebase/firebase'
import {zodResolver} from '@hookform/resolvers/zod'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/forms/image-upload'
import { TextareaField } from '@/components/forms/textarea-form'
import PaymentImages from '../../_components/payment-images'

const formSchema = z.object({
    
  name: z.string().min(1, {
      message: 'Template name is required.'
  }),
  imageUrl: z.string().min(1, {
      message: 'Server image is required.'
  }),
  description: z.string().min(1, {
      message: 'Server image is required.'
  })
})

const TicketPage = () => {
  const products = [
    {
      title: "Moonbeam",
      link: "https://gomoonbeam.com",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/emp-portal-b03eb.appspot.com/o/serverImage%2Fdental-clinic%2FBraces-at-Kids-Dental.jpg?alt=media&token=0da59886-8af1-4760-8368-dc3a6e2d034a",
    },
    {
      title: "Cursor",
      link: "https://cursor.so",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/emp-portal-b03eb.appspot.com/o/serverImage%2Fdental-clinic%2F657a3e580653f7f6f9684718_crowns-and-bridges.webp?alt=media&token=39c71b8f-439e-46e2-85f2-13e4ea37b4bc",
    },
    {
      title: "Rogue",
      link: "https://userogue.com",
      thumbnail:
        "https://firebasestorage.googleapis.com/v0/b/emp-portal-b03eb.appspot.com/o/serverImage%2Fdental-clinic%2F6419204d5d87efb381fc14da_AdobeStock_54959689-min.jpg?alt=media&token=731cb21d-9722-439d-91f3-fc551247cbf3",
    },
  ];
  const [file, setFile] = useState<File|null>(null)
    const storageRef = ref(storage, `serverImage/${file?.name.split('.')[0]}`);

    const Router = useRouter()
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl: '',
            description: '',
        }
    })

    const isLoading = form.formState.isSubmitting;
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (!file) {
            return
        }

        uploadBytesResumable(storageRef, file).then((snapshot:any) => {
            getDownloadURL(snapshot.ref).then(async (getDownloadURL: string) => {
                values.imageUrl = getDownloadURL
                try {
                    await axios.post('/api/servers', values)
        
                    form.reset()
                    Router.refresh()
                    window.location.reload()
                } catch (error) {
                    console.log(error)
                }
            })
        })
    }
  
  return (
    <div className="w-full min-h-[100vh] gap-4 relative h-auto md:px-10 pt-5 pb-10 flex flex-col items-center">
      <div className='w-full h-auto'>
          <div className="w-full p-2 flex items-center">
            <Link href='/'>
              <Button variant='link' className='text-lg'>Redirect</Button>
            </Link>
          </div>
      </div>
      <div className="w-full h-auto md:p-4 flex flex-col">
        <p className='w-full h-auto'>
          dsadsadas
        </p>
        <div className="w-full h-[25rem] relative overflow-hidden">
          <PaymentImages products={products} />
        </div>
      </div>
      <div className="w-full h-auto md:h-[20rem] flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-[21rem] h-[20rem] md:h-full relative rounded-md overflow-hidden">
          <Image
            src='/images/gcash.png'
            width={0}
            height={0}
            layout='fill'
            alt='gcash'
            className='object-cover object-bottom'
          />
        </div>
        <div className="flex-1">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-8 w-full h-auto md:h-full flex flex-col md:flex-row gap-4 overflow-hidden p-4 items-center'
            >
              <FormField
                control={form.control}
                name="imageUrl"
                render={({field}) => (
                  <FormItem className='w-full md:w-[25rem] h-[20rem] md:h-full'>
                      <FormControl>
                          <ImageUpload                                                    
                              value={field.value}
                              onChange={field.onChange}
                              onFileChange={(file: File) => setFile(file)}
                          />
                      </FormControl>
                  </FormItem>
                )}
              />
              <TextareaField
                  name='description'
                  control={form.control}
                  isLoading={isLoading}
                  placeholder='Description'
              />   
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}

export default TicketPage