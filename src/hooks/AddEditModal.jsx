import {useCallback} from 'react';
import {modals} from "@mantine/modals";

export function useModal(handleRefresh) {
    const openModal = useCallback((
        {Component, data = [] | {} | null, mode = 'add', title = 'Add '}
    ) => {
        modals.closeAll();
        modals.open({
            title: title,
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
                        refresh && handleRefresh();
                    }}
                />
            ),
        });
    }, [handleRefresh])

    return {openModal};
}