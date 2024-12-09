import React from 'react';
import { Carousel } from '@mantine/carousel';
import { CarouselCard } from './CarouselCard';

const data = [
    {
        image:
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Your Health, Simplified with Health Alpha',
        category:
            'Simplifying your health journey with Health Alpha, offering easy access to all your medical documents, reminders, and wellness tools, so you can focus on what matters most—your health.',
    },
    {
        image:
            'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'A Personal Health Partner You Can Count On',
        category:
            'Health Alpha is your trusted personal health companion, providing the tools and support you need to manage your health and stay on top of important appointments and health goals.',
    },
    {
        image:
            'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Stay Organized, Stay Healthy',
        category:
            'With Health Alpha, you can stay organized by storing and tracking your health data in one place, making it easy to manage your wellness and stay healthy.',
    },
];

export function HeroCarousel() {
    return (
        <Carousel
            loop={false}
            orientation='vertical'
            style={{ height: '800px', width: '100%', overflow: 'hidden' }}
            styles={{
                container: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '800px'
                },
                viewport: {
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'scroll',
                    overflowX: 'hidden',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    height: '800px',
                },
                slide: {
                    height: '100%',
                    minHeight: '800px',
                },
            }}
        >
            {data.map((item, index) => (
                <Carousel.Slide key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CarouselCard {...item} />
                </Carousel.Slide>
            ))}
        </Carousel>
    );
}
