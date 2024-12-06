import {Button, Paper, Text, Title} from '@mantine/core';
import classes from '@styles/card.module.css';

export function CarouselCard(
    {image, title, category}
) {
    return (
        <Paper
            shadow="md"
            p="xl"
            radius={'none'}
            style={{backgroundImage: `url(${image})`}}
            className={classes.card}
        >
            <div>
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