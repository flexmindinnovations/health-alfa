import {Carousel} from '@mantine/carousel';
import {useEffect, useRef, useState} from "react";
import Autoplay from "embla-carousel-autoplay";
import {CarouselCard} from "@components/CarouselCard.jsx";

const data = [
    {
        image:
            'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Best forests to visit in North America',
        category: 'nature',
    },
    {
        image:
            'https://images.unsplash.com/photo-1559494007-9f5847c49d94?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Hawaii beaches review: better than you think',
        category: 'beach',
    },
    {
        image:
            'https://images.unsplash.com/photo-1608481337062-4093bf3ed404?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Mountains at night: 12 best locations to enjoy the view',
        category: 'nature',
    },
    {
        image:
            'https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Aurora in Norway: when to visit for best experience',
        category: 'nature',
    },
    {
        image:
            'https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Best places to visit this winter',
        category: 'tourism',
    },
    {
        image:
            'https://images.unsplash.com/photo-1582721478779-0ae163c05a60?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80',
        title: 'Active volcanos reviews: travel at your own risk',
        category: 'nature',
    },
];

export function HeroCarousel({height}) {
    const autoplay = useRef(Autoplay({delay: 2000}));
    const [scrollIndex, setScrollIndex] = useState(0);
    const carouselRef = useRef(null);

    const slides = data.map((item) => (
        <Carousel.Slide key={item.title}>
            <CarouselCard {...item} />
        </Carousel.Slide>
    ));

    const handleScroll = (event) => {
        const direction = event.deltaY > 0 ? 1 : -1;
        setScrollIndex((prevIndex) => {
            const newIndex = Math.max(0, Math.min(data.length - 1, prevIndex + direction));
            return newIndex;
        });

        if ((direction > 0 && scrollIndex < data.length - 1) ||
            (direction < 0 && scrollIndex > 0)) {
            event.preventDefault();
        }
    };
    
    useEffect(() => {
        const handleWheel = (event) => {
            if (carouselRef.current && carouselRef.current.contains(event.target)) {
                handleScroll(event);
            }
        };

        window.addEventListener('wheel', handleWheel, {passive: false});

        return () => {
            window.removeEventListener('wheel', handleWheel);
        };
    }, [scrollIndex]);

    return (
        <div ref={carouselRef}>
            <Carousel
                plugins={[autoplay.current]}
                orientation="vertical"
                withControls={false}
                withIndicators
                height={height}
                value={scrollIndex}
                onChange={setScrollIndex}
                loop={false}
                style={{flex: 1}}
            >
                {slides}
            </Carousel>
        </div>
    );
}
