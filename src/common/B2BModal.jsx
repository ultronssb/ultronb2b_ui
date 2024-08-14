import React from 'react';
import { Modal, Button } from '@mantine/core';

const B2BModal = ({ opened, close }) => {
    return (
        <Modal.Root opened={opened}
            onClose={close}
            title="Authentication"
            size="100%"
            transitionProps={{ transition: 'fade', duration: 200 }}
        >
            <Modal.Overlay />
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Modal title</Modal.Title>
                    <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                    To correctly integrate the B2BModal component into your Layout component, you've already made the necessary adjustments in your Layout component to control the visibility of the modal through the opened state and the openModal and closeModal functions. Your B2BModal component is designed to accept opened and close props, which aligns perfectly with how you intend to use it within the Layout.
                    Given this setup, your Layout component correctly renders the B2BModal conditionally based on the opened state. When opened is true, the modal is displayed; otherwise, it remains hidden. The closeModal function passed to the B2BModal allows the modal to be closed from within the modal itself by calling the onClose prop function.
                </Modal.Body>
            </Modal.Content>
        </Modal.Root>
    );
};

export default B2BModal;
