import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';

function Settings({ isOpen, toggle }) {
    const [opened, { open, close }] = useDisclosure(isOpen);

    const handleModalClose = () => {
        close();
        toggle();
    }

    return (
        <>
            <Modal radius={'lg'} centered opened={opened} onClose={handleModalClose} title="Settings">
                {/* Modal content */}
            </Modal>
        </>
    );
}

export default Settings;