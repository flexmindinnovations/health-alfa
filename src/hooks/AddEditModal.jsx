import {useCallback} from 'react';
import {modals} from "@mantine/modals";
import {useTranslation} from "react-i18next";

export function useModal(handleRefresh) {
    const {t} = useTranslation();
    const openModal = useCallback((
        {
            Component, data = [] | {} | null, mode = 'add', title = 'Add ',
            handleRefresh,
            props,
            isAddEdit = true,
            size = 'lg',
            titleprops,
            closable = false
        }
    ) => {
        modals.closeAll();
        modals.open({
            title: `${isAddEdit ? mode === "edit" ? t("update") : t("add") : ''}` + ` ${title}`,
            centered: true,
            trapFocus: false,
            withCloseButton: closable,
            size: size,
            classNames: {
                body: `${props} !p-0 !overflow-hidden`,
            },
            styles: {
                title: {fontWeight: '500', fontSize: '14px', ...titleprops},
            },
            children: (
                <Component
                    mode={mode}
                    data={data}
                    handleCancel={(event) => {
                        const {refresh} = event;
                        modals.closeAll();
                        refresh && handleRefresh({refresh});
                    }}
                />
            ),
        });
    }, [handleRefresh])

    return {openModal};
}