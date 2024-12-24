import {motion} from 'framer-motion';
import {Box, Button, CloseIcon, Group} from '@mantine/core';
import {Save, SquarePen} from "lucide-react";
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useState} from "react";

export function AddEditRole({data = {}, mode = 'add', handleCancel}) {
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);

    const {handleSubmit, watch, getValues, formState: {errors, isSubmitting}, control} = useForm({
        mode: 'onChange',
        defaultValues: {}
    })

    const onSubmit = (event) => {
        event.preventDefault();
        const values = getValues();

    };

    return (
        <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 50}}
        >
            <Box sx={{maxWidth: 900, margin: '0 auto'}}>
                <form>
                    <Group position="right" mt="xl" align="center" justify="end">
                        <Button variant="outline" leftSection={<CloseIcon size={16}/>}
                                onClick={() => handleCancel({refresh: false})}>
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={onSubmit}
                            loading={isSubmitting || loading}
                            leftSection={mode === 'add' ? <Save size={16}/> : <SquarePen size={16}/>}
                        >
                            {mode === 'add' ? t('save') : t('update')}
                        </Button>
                    </Group>
                </form>
            </Box>
        </motion.div>
    )
}