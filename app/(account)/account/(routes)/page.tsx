'use client'

import 'react-dropzone-uploader/dist/styles.css';

import React, {useState} from 'react'
import Link from 'next/link'
import axios from 'axios'
import * as z from 'zod'
import { useRouter } from 'next/navigation';
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import {storage} from '@/firebase/firebase'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

import { Ticket } from "lucide-react"

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'

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

const AccountPage = () => {
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
    <div className="w-full h-full gap-4 relative md:px-8 pt-4 pb-8 flex flex-col items-center">
      <div className='w-full h-auto'>
          <div className="w-full p-2 flex items-center">
            <Link href='/'>
              <Button variant='link' className='text-lg'>Redirect</Button>
            </Link>
          </div>
      </div>
        <div className="flex-1 w-full bg-gradient-to-b from-[#F6D7BC] to-white rounded-xl shadow-lg flex flex-row overflow-hidden">
            <aside className='w-[15rem] h-full shadow-md p-4 bg-gradient-to-b from-[#F6D7BC] via-white to-white'>
                <div className="w-full h-full relative flex flex-col gap-4">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild >
                                <div className="w-full h-[5rem] rounded-2xl bg-white shadow-lg p-4 flex flex-row items-center justify-center gap-4 relative">
                                    <div className="h-auto w-auto top-2 left-2 absolute p-2 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 via-red-500 to-red-100 shadow-md shadow-black">
                                        <Ticket className='w-4 h-4 text-white' />
                                    </div>
                                    <div className="">
                                        <span>
                                            13 days
                                        </span>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Your Credit</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Link href={'/ticket'} className='w-full'>
                        <Button className='rounded-full shadow-lg w-full'>
                                Buy Credit
                        </Button>
                    </Link>
                    <Button className='rounded-full shadow-lg'>
                        Copy Reference  
                    </Button>
                    <div className="flex-1 bg-white shadow-md rounded-xl p-4 relative">
                        <p className='w-full text-balance'>
                            Use credit as a token to sadsa dasd awd wad awdwadwadcawd wadwacdaw wuhdiwua
                        </p>
                    </div>
                </div>
            </aside>
            <div className="flex-1 p-8 w-full h-full">
                <div className="h-full rounded-xl shadow-xl bg-white/35 w-full relative">
                    <ScrollArea className='w-full h-full'>
                        {Array(5).fill(null).map((_, index) => (
                        <div key={index} className="w-full h-[10rem]"></div>
                        ))}
                    </ScrollArea>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AccountPage