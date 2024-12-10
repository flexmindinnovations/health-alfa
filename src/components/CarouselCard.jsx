import { Button, Paper, Text, Title } from '@mantine/core';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import classes from '@styles/card.module.css';

export function CarouselCard({ image, title, category }) {
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
            style={{
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                position: 'relative',
                overflow: 'hidden',
                width: '100%'
            }}
            className={`${classes.card}`}
        >
            <motion.div
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={fadeVariant}
                className="absolute inset-0 bg-gradient-to-r from-tb-950/95 via-tb-800/90 to-transparent"
            ></motion.div>
            <div className="relative w-full h-full flex items-start justify-center flex-col gap-5 p-20">
                <motion.div
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    variants={slideVariant}
                    className="box flex items-start justify-center flex-col gap-5 max-w-2xl"
                >
                    <Title order={1} size={1} className={classes.title}>
                        {title}
                    </Title>
                    <Text className={classes.category} size="lg">
                        {category}
                    </Text>
                    <Button variant="white" color="dark">
                        Read article
                    </Button>
                </motion.div>
            </div>
        </Paper>
    );
}
