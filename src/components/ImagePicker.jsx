import React, { useState, useRef, useEffect } from 'react';
import { FileInput, Center, Card, BackgroundImage, Overlay, Text, useMantineTheme, RingProgress, ActionIcon, rem, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';

export function ImagePicker({ value, onChange, disableForm, isUploading, uploadProgress }) {
    const placeholderImage = 'https://via.placeholder.com/170';
    const [preview, setPreview] = useState(value || placeholderImage);
    const [visible, setVisible] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isImageSelected, setIsImageSelected] = useState(false);
    const fileInputRef = useRef(null);
    const theme = useMantineTheme();
    useEffect(() => {
        const imageEndpoint = value;
        const host = import.meta.env.VITE_API_URL;
        const imageUrl = `${host}/${imageEndpoint}`.replace('/api', '');
        if (imageEndpoint && imageUrl && !isImageSelected) setPreview(imageUrl);
        if (isUploading) {
            setIsUploaded(false);
        } else {
            setTimeout(() => {
                if (uploadProgress === 100) setIsUploaded(true);
                setTimeout(() => setIsUploaded(false), 2000);
            }, 900);
        }
    }, [value, uploadProgress, isUploading]);

    const handleFileChange = (file) => {
        setIsImageSelected(true);
        if (file instanceof File) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
                onChange(file);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(placeholderImage);
        }
    };

    const handleBackgroundClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const getProgressColor = () => {
        if (uploadProgress > 0 && uploadProgress <= 33) return theme.colors.red[4];
        if (uploadProgress > 33 && uploadProgress <= 66) return theme.colors.blue[4];
        return !isUploading ? theme.colors.gray[2] : isUploaded ? theme.colors.gray[2] : theme.colors.teal[4];
    };

    return (
        <Center style={{ position: 'relative', width: 180, height: 180 }}>
            <motion.div
                initial={{ value: 0 }}
                animate={{ value: uploadProgress }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1,
                }}
            >
                <RingProgress
                    size={208}
                    thickness={10}
                    roundCaps
                    rootColor={theme.colors.gray[2]}
                    transitionDuration={1000}
                    sections={[{ value: uploadProgress, color: getProgressColor() }]}
                    style={{
                        position: 'relative',
                    }}
                />
            </motion.div>
            <Card
                shadow="lg"
                p={0}
                w={160}
                h={160}
                style={{
                    position: 'relative',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    pointerEvents: disableForm || isUploading ? 'none' : 'auto',
                    zIndex: 2,
                }}
                onClick={handleBackgroundClick}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
            >
                <BackgroundImage
                    src={preview}
                    radius="xl"
                    h="100%"
                    styles={{ root: { backgroundSize: 'cover' } }}
                >
                    <Center className="flex w-full h-full">
                        {visible && !isUploading && !isUploaded && <Overlay color={theme.colors.dark[5]} opacity={0.85} />}
                        {visible && !isUploading && (
                            <Text
                                c={theme.white}
                                opacity={1}
                                weight={500}
                                size="sm"
                                className="z-10"
                            >
                                Change image
                            </Text>
                        )}
                        {isUploading && !isUploaded && (
                            <Text
                                c={theme.white}
                                opacity={1}
                                fz="h2"
                                fw="bolder"
                                size="sm"
                                className="z-10"
                            >
                                {uploadProgress}%
                            </Text>
                        )}
                        {!isUploading && isUploaded && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                                className="bg-white/90 !w-full !h-full"
                            >
                                <Stack className="!h-full !w-full">
                                    <Center styles={{ root: { height: '100%', width: '100%' } }}>
                                        <ActionIcon color="teal" variant="light" radius="xl" size="xl">
                                            <CheckIcon style={{ width: rem(22), height: rem(22) }} />
                                        </ActionIcon>
                                    </Center>
                                </Stack>
                            </motion.div>
                        )}
                        <FileInput
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                        />
                    </Center>
                </BackgroundImage>
            </Card>
        </Center>
    );
}
