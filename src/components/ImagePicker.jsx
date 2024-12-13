import React, { useState, useRef, useEffect } from 'react';
import { FileInput, Center, Card, BackgroundImage, Overlay, Text, useMantineTheme } from '@mantine/core';

export function ImagePicker({ value, onChange, disableForm }) {
    const [preview, setPreview] = useState(value || '');
    const [visible, setVisible] = useState(false);
    const fileInputRef = useRef(null);
    const theme = useMantineTheme();

    useEffect(() => {
        const imageEndpoint = value;
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
        if (imageUrl) {
            setPreview(imageUrl);
        }
    }, [])

    const handleFileChange = (file) => {
        if (file instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
                // onChange(file);
                onChange(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview('');
        }
    };

    const handleBackgroundClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <Card
            shadow="lg"
            p={0}
            w={170}
            h={170}
            style={{
                border: `4px solid ${theme.colors.gray[5]}`,
                borderRadius: '100%',
                overflow: 'hidden',
                cursor: 'pointer',
                pointerEvents: disableForm ? 'none' : 'auto'
            }}
            onClick={handleBackgroundClick}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            <BackgroundImage
                src={preview || 'https://via.placeholder.com/170'}
                radius="xl"
                h={'100%'}
                styles={{
                    root: {
                        backgroundSize: '100% 100%'
                    }
                }}
            >
                <Center className='flex w-full h-full'>
                    {visible && (
                        <Overlay color={theme.colors.dark[5]} opacity={0.85} />
                    )}
                    {visible && <Text c={theme.white} opacity={1} weight={500} size="sm" className='z-10'>
                        Change image
                    </Text>}
                    <FileInput
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        ref={fileInputRef}
                    />
                </Center>
            </BackgroundImage>
        </Card>
    );
}
