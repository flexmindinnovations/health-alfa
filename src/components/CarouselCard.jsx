import { Button, Paper, Text, Title } from '@mantine/core';
import classes from '@styles/card.module.css';

export function CarouselCard(
    { image, title, category }
) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius={'none'}
            style={{ backgroundImage: `url(${image})` }}
            className={classes.card}
        >
            <div className="flex flex-col items-center justify-center h-full mx-auto text-center gap-4 px-4 sm:px-6 lg:px-8">
                <Title order={3} className={classes.title}>
                    {title}
                </Title>
                <Text className={classes.category} size="lg">
                    {category}
                </Text>
            </div>
            <Button variant="white" color="dark">
                Read article
            </Button>
        </Paper>
    )
}