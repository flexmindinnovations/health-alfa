import { Button, Group, Text } from "@mantine/core";
import { Save, SquarePen } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ModalFooterButtons({
    mode = null,
    loading = true,
    disabled = true,
    title = null | '',
    showCancel = true,
    handleCancel,
    handleSaveUpdate,
    showCount = false,
    selectedRows = [],
}) {

    const { t } = useTranslation();

    return (
        <Group className={`w-full !flex items-center !justify-between`}>
            <Group>
                {
                    showCount &&
                    <Group>
                        {
                            selectedRows.length > 0 ? (
                                <Text size={"sm"}>
                                    {selectedRows.length}&nbsp;{selectedRows?.length > 1 ? t('slots') : t('slot')}&nbsp;{t('selected')}
                                </Text>
                            ) : (
                                <Text size={"sm"}>
                                    {t('no')}&nbsp;{t('slots')}&nbsp;{t('selected')}
                                </Text>
                            )
                        }
                    </Group>
                }
            </Group>
            <Group>
                {
                    showCancel && (
                        <Button variant="outline" onClick={handleCancel}>
                            {t('cancel')}
                        </Button>
                    )
                }
                <Button
                    loading={loading}
                    disabled={loading || disabled}
                    leftSection={
                        mode ? (
                            mode === 'add' ? <Save size={16} /> : <SquarePen size={16} />
                        ) : <Save size={16} />
                    }
                    onClick={handleSaveUpdate}
                >
                    {title ? title : mode ? mode === 'add' ? t('add') : t('update') : t('save')}
                </Button>
            </Group>
        </Group>
    );
}