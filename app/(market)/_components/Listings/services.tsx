'use client'

import { useRef, useState, useEffect } from 'react'
import "swiper/swiper-bundle.css";
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import Image from 'next/image';

import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { GlareCard } from '@/components/ui/glare-card';
import LedSeparator from '@/components/ui/led-separator';

const Services = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLUListElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startScrollLeft, setStartScrollLeft] = useState(0);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | number>(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const sliderImageUrl = [
        //First image url
        {
        title: 'Braces',
        description: 'Dental braces can help improve the appearance of your smile, correct bite problems or crooked teeth, and enhance your overall oral health and well-being.'
        },
        {
        title: 'Crowns & Bridges',
        description: 'Dental crowns can provide structural support, enhance aesthetics, and restore function to damaged or weakened teeth, improving oral health and preventing further damage.'
        },
        //Second image url
        {    
        title: 'Crowns & Bridges',
        description: "Dental veneers can improve the appearance of teeth by covering imperfections, correcting alignment issues, and enhancing the overall aesthetics of a patient's smile."
        },
        {
        title: 'Whitening',
        description: 'Dental whitening can enhance the appearance of discolored or stained teeth, leading to a brighter, more youthful-looking smile and increased confidence.'
        },
    ]

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const carousel = carouselRef.current;
        if (!wrapper || !carousel) return;
        const firstCardWidth = (carousel.querySelector('.card') as HTMLElement).offsetWidth;
        const arrowBtns = wrapper?.querySelectorAll('.arrows');
        const carouselChildren = Array.from(carousel.children);

        let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth)

        carouselChildren.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML('afterbegin', card.outerHTML);
        });

        carouselChildren.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML('beforeend', card.outerHTML);
        });

        carousel.classList.add('no-transition');
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove('no-transition');

        const handleArrowClick = (e: any) => {
        carousel.scrollLeft += e.target.id === 'left' ? -(firstCardWidth) : firstCardWidth;
        };

        arrowBtns.forEach(btn => {
        btn.addEventListener('click', handleArrowClick);
        });

        const dragStart = (e: any) => {
        setIsDragging(true);
        carousel.classList.add('dragging');
        setStartX(e.pageX);
        setStartScrollLeft(carousel.scrollLeft);
        };

        const dragging = (e: any) => {
        if (!isDragging) return;
        carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
        };

        const dragStop = () => {
        setIsDragging(false);
        carousel.classList.remove('dragging');
        };

        const infiniteScroll = () => {
        if (carousel.scrollLeft === 0) {
            carousel.classList.add('no-transition');
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove('no-transition');
        } else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add('no-transition');
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove('no-transition');
        }

        clearTimeout(timeoutId);
        // if (!wrapper.matches(':hover')) autoPlay();
        };

        // const autoPlay = () => {
        // if (window.innerWidth < 800 || !isAutoPlay) return;
        // const id = setTimeout(() => {
        //     carousel.scrollLeft += firstCardWidth;
        // }, 5000);
        // setTimeoutId(id);
        // };

        // autoPlay();

        carousel.addEventListener('mousedown', dragStart);
        carousel.addEventListener('mousemove', dragging);
        document.addEventListener('mouseup', dragStop);
        carousel.addEventListener('scroll', infiniteScroll);
        wrapper.addEventListener('mouseenter', () => clearTimeout(timeoutId));
        // wrapper.addEventListener('mouseleave', autoPlay);

        return () => {
        arrowBtns.forEach(btn => {
            btn.removeEventListener('click', handleArrowClick);
        });
        carousel.removeEventListener('mousedown', dragStart);
        carousel.removeEventListener('mousemove', dragging);
        document.removeEventListener('mouseup', dragStop);
        carousel.removeEventListener('scroll', infiniteScroll);
        wrapper.removeEventListener('mouseenter', () => clearTimeout(timeoutId));
        // wrapper.removeEventListener('mouseleave', autoPlay);
        };
    }, []);
  
    
  return (
    <div className='w-full h-auto bg-dot-blue-500/50 relative'>
        <LedSeparator className='absolute top-0' />
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />
        <h2 className='text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-zinc-500 to-zinc-800 sm:text-4xl md:text-4xl tracking-wider mx-auto text-center mt-36 px-2 max-w-6xl !leading-[1.3]'>
            The Benefit From <br/>
            Our Service
        </h2>
        <div className="wrapper w-full relative px-10" ref={wrapperRef}>
            <ul className="carousel py-10 w-full" ref={carouselRef}>
                {sliderImageUrl.map((image, key) => (
                <li className="card group relative overflow-hidden rounded-md" key={key}>
                    <GlareCard className="flex flex-col items-center justify-center">
                        <Image
                            alt='House'
                            src='/images/house-blue-led.jpg'
                            layout='fill'
                            className='object-cover absolute top-0 z-20'
                        />
                        <div className="w-full h-full z-30 p-4 pt-10">
                            <p className="font-bold text-white text-lg">
                                {image.title}
                            </p>
                            <p className="font-normal text-base text-neutral-200 mt-4">
                                {image.description}
                            </p>
                        </div>
                    </GlareCard>
                </li>
                ))}
            </ul>
            <i id="left" className="arrows fa-solid fa-angle-left flex items-center justify-center left-0 bg-white">
                <FaArrowLeft id='left' className='w-1/2 h-1/2' />
            </i>
            <i id="right" className="arrows fa-solid fa-angle-right flex items-center justify-center bg-white">
                <FaArrowRight id='right' className='w-1/2 h-1/2' />
            </i>
        </div>
    </div>
  )
}

export default Services