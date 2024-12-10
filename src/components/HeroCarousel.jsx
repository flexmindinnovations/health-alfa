import { Carousel } from '@mantine/carousel';
import { useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import { CarouselCard } from "@components/CarouselCard.jsx";

const data = [
    {
        image: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Your Health, Simplified with Health Alpha',
        category: 'Simplifying your health journey with Health Alpha, offering easy access to all your medical documents, reminders, and wellness tools, so you can focus on what matters most—your health.'
    },
    {
        image: 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'A Personal Health Partner You Can Count On',
        category: 'Health Alpha is your trusted personal health companion, providing the tools and support you need to manage your health and stay on top of important appointments and health goals.'
    },
    {
        image: 'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Stay Organized, Stay Healthy',
        category: 'With Health Alpha, you can stay organized by storing and tracking your health data in one place, making it easy to manage your wellness and stay healthy.'
    },
    {
        image: 'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'For You and Your Loved Ones',
        category: 'Health Alpha is designed not only for you but for your entire family, helping you manage health records, appointments, and more to ensure everyone stays healthy and safe.'
    },
    {
        image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Take Control of Your Health Today',
        category: 'Take charge of your health with Health Alpha. Set personalized goals, track your progress, and manage your health effortlessly, all at your fingertips.'
    },
    {
        image: 'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Active volcano reviews: Travel at your own risk',
        category: 'Health Alpha provides essential health management tools for all aspects of life, whether it’s tracking your wellness or staying informed about potential health risks during travel.'
    },
];

export function HeroCarousel({ height }) {
    const autoplay = useRef(Autoplay({ delay: 2500 }));
    const [scrollIndex, setScrollIndex] = useState(0);
    const carouselRef = useRef(null);

    const slides = data.map((item, index) => (
        <Carousel.Slide key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CarouselCard {...item} />
        </Carousel.Slide>
    ));

    return (
        <div ref={carouselRef} className={`h-full w-full`}>
            <Carousel
                // plugins={[autoplay.current]}
                orientation="vertical"
                withControls={false}
                withIndicators
                height={height}
                slidesToScroll={1}
                value={isNaN(scrollIndex) ? 0 : scrollIndex}
                onChange={setScrollIndex}
                loop={false}
                style={{ height: '100%', width: '100%', overflow: 'hidden' }}
            >
                {slides}
            </Carousel>
        </div>
    );
}
