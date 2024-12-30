import {Button, Group} from "@mantine/core";
import {Save, SquarePen} from "lucide-react";
import {useTranslation} from "react-i18next";

export function ModalFooterButtons({
                                       mode = null,
                                       loading = true,
                                       disabled = true,
                                       title = null | '',
                                       handleCancel,
                                       handleSaveUpdate
                                   }) {

    const {t} = useTranslation();

    return (
        <Group>
            <Button variant="outline" onClick={handleCancel}>
                {t('cancel')}
            </Button>
            <Button
                loading={loading}
                disabled={loading || disabled}
                leftSection={
                    mode ? (
                        mode === 'add' ? <Save size={16}/> : <SquarePen size={16}/>
                    ) : <Save size={16}/>
                }
                onClick={handleSaveUpdate}
            >
                {title ? title : mode ? mode === 'add' ? t('add') : t('update') : t('save')}
            </Button>
        </Group>
    );
}