'use client'

import {
    Dialog,
    DialogContent,
} from '@/components/ui/dialog'
import { useImageModal } from '@/hooks/use-images-modal';

import { ScrollArea } from '../ui/scroll-area';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useRoomDetails } from '@/hooks/use-image-details';

const ImageModal = () => {
    const {details} = useRoomDetails()
    
    const { isOpen, onClose } = useImageModal()
    
    const handleClose = () => {
        onClose();
    }

    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className=' p-0 pt-10 w-full  max-w-[80vw] h-[90vh] shadow-lg'>
                <ScrollArea>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full h-full px-2 lg:px-[5rem] xl:px-[20rem]">
                        {details.images.map((listing, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'col-span-1 relative h-[20rem]',
                                    index % 3 === 0 && 'col-span-1 md:col-span-2'
                                )}
                            >
                                <Image 
                                    width={0}
                                    height={0}
                                    layout='fill' 
                                    className="object-cover" 
                                    src={listing} 
                                    alt={details.title} 
                                />
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
 
export default ImageModal;