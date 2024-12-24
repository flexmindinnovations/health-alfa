import {useCallback} from 'react';
import {modals} from "@mantine/modals";
import {useTranslation} from "react-i18next";

export function useModal(handleRefresh) {
    const {t} = useTranslation();
    const openModal = useCallback((
        {Component, data = [] | {} | null, mode = 'add', title = 'Add ', handleRefresh}
    ) => {
        modals.closeAll();
        modals.open({
            title: `${mode === "edit" ? t("update") : t("add")}` + ` ${title}`,
            centered: true,
            trapFocus: false,
            size: 'xl',
            styles: {
                title: {fontWeight: '500', fontSize: '14px'},
                // inner: {
                //     maxHeight: '80vh',
                //     overflowY: 'auto',
                // },
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