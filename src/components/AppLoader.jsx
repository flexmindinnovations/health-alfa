import {Card, Center, Loader, Stack} from "@mantine/core";

export function AppLoader() {
    return (
        <div className={`h-full w-full flex items-center justify-center`}>
            <Card h={200} w={200}>
                <Stack>
                    <Center>
                        <Loader size={50}/>
                    </Center>
                </Stack>
            </Card>
        </div>
    )
}