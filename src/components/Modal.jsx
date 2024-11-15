import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

export default function ModalWrapper({ children, isOpen, toggle, title }) {
    const [opened, { open, close }] = useDisclosure(isOpen);

    const handleModalClose = () => {
        close();
        toggle();
    }

    return (
        <Modal
            transitionProps={{ transition: 'fade', duration: 200 }}
            radius={'lg'}
            size="lg"
            centered
            opened={opened}
            onClose={handleModalClose}
            title={title}
        >
            {children}
        </Modal>
    )
}