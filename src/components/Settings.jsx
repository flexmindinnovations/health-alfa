import ModalWrapper from '@components/Modal';

function Settings({ isOpen, toggle }) {
    return (
        <ModalWrapper title="Settings" isOpen={isOpen} toggle={toggle}>
            <p>
                Settings Modal Content
            </p>
        </ModalWrapper>
    );
}

export default Settings;