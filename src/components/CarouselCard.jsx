import { AspectRatio, Paper, Image, Title } from '@mantine/core';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import classes from '@styles/card.module.css';

export function CarouselCard({ slide }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { threshold: 0.5 });
    const fadeVariant = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
    };

    const slideVariant = {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { delay: 0.5, type: 'spring', stiffness: 50, damping: 15 },
        },
    };

    return (
        <Paper
            ref={ref}
            shadow="md"
            radius={'none'}
            className={`${classes.card} w-full bg-transparent`}
        >
            <AspectRatio ratio={16 / 9} w={'100%'}>
                <Image src={slide} styles={{ root: { objectFit: 'fill' } }} />
            </AspectRatio>
        </Paper>
    );
}
