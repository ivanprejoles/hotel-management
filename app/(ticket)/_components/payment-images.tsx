import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import Image from 'next/image';
import React from 'react'

interface PaymentImagesProps {
    products: {
        title: string;
        link: string;
        thumbnail: string;
    }[];
}

const PaymentImages = ({
    products
}: PaymentImagesProps) => {
  return (
    <>
        <InfiniteMovingCards
            items={products}
            direction="left"
            speed="normal"
            className='px-0 md:hidden flex w-auto h-auto absolute top-0 left-0'
            pauseOnHover={true}
        />
        <div className="md:flex h-full hidden flex-row items-center gap-4 justify-center relative">
            {products.map((item, key) => (
                <div className="h-[20rem] w-[20rem] relative" key={key}>
                    <Image
                        width={0}
                        height={0}
                        layout='fill'
                        src={item.thumbnail}
                        alt={item.title}
                        className='object-cover'
                    />
                </div>
            ))}
        </div>
    </>
  )
}

export default PaymentImages