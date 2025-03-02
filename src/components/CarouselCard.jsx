import { Button, Paper, Text, Title } from '@mantine/core';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import classes from '@styles/card.module.css';

export function CarouselCard({ image, title, category, isActive }) {
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
            style={{
                position: 'relative',
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                clipPath: "polygon(0 0, 100% 0, 100% 80%, 50% 100%, 0 80%)",
                borderRadius: "0 0 20px 20px"
            }}
        >
            <motion.div
                initial="hidden"
                animate={isActive ? "visible" : "hidden"}
                variants={fadeVariant}
                className={`absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r xl:bg-gradient-to-r 2xl:bg-gradient-to-r from-tb-950/95 via-tb-800/90 to-transparent`}
            ></motion.div>
            <div className="relative w-full h-full flex items-start justify-start lg:justify-center xl:justify-center 2x:justify-center flex-col gap-5 p-10 md:p-10 lg:p-20 xl:p-20 2xl:p-20">
                <motion.div
                    initial="hidden"
                    animate={isActive ? "visible" : "hidden"}
                    variants={slideVariant}
                    className="box flex items-start justify-center flex-col gap-5 max-w-2xl absolute top-[40%] -translate-y-[40%]"
                >
                    <Title order={1} size={1} className={classes.title}>
                        {title}
                    </Title>
                    <Text className={classes.category} size="sm">
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
