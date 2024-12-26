import {motion} from 'framer-motion';
import {Box, Button, CloseIcon, Group, Stack} from "@mantine/core";
import {Save, SquarePen} from "lucide-react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {useApiConfig} from "@contexts/ApiConfigContext.jsx";
import useHttp from "@hooks/AxiosInstance.jsx";
import {useMediaQuery} from "@mantine/hooks";

export function AddEditAppointment(
    {data = {}, mode = 'add', showCancel = true, handleCancel}
) {
    const {i18n, t} = useTranslation();
    const {apiConfig} = useApiConfig();
    const http = useHttp();
    const [disableForm, setDisableForm] = useState(false);
    const isSmallScreen = useMediaQuery('(max-width: 768px)');
    const [loading, setLoading] = useState(false);

    return (
        <motion.div initial={{opacity: 0, y: 50}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: 50}}>
            <Box>
                <motion.form>
                    <Stack>
                        <Group position="right" justify='flex-end' px={isSmallScreen ? 0 : 20}>
                            {showCancel && <Button
                                disabled={disableForm}
                                leftSection={<CloseIcon size={16}/>}
                                variant="outline"
                                onClick={() => handleCancel({refresh: false})}>
                                Cancel
                            </Button>}
                            <Button
                                type="submit"
                                loading={loading}
                                className='min-w-24'
                                leftSection={
                                    mode === 'add' ? <Save size={16}/> : <SquarePen size={16}/>
                                }
                            >
                                {mode === 'add' ? 'Save' : 'Update'}
                            </Button>
                        </Group>
                    </Stack>
                </motion.form>
            </Box>
        </motion.div>
    )
}