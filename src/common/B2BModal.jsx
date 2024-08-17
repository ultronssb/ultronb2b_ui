import { Modal } from '@mantine/core';
import React from 'react';

const B2BModal = ({ opened, close, children, title, styles }) => {

    return (
        // <Modal.Root opened={opened}
        //     onClose={close}
        //     title="Authentication"
        //     centered
        //     transitionProps={{ transition: 'fade', duration: 200 }}
        // >
        //     <Modal.Overlay />
        //     <Modal.Content>
        //         <Modal.Header>
        //             <Modal.Title>{title}</Modal.Title>
        //             <Modal.CloseButton />
        //         </Modal.Header>
        //         <Modal.Body>
        //             {children}
        //         </Modal.Body>
        //     </Modal.Content>
        // </Modal.Root>

        <Modal styles={{...styles}} opened={opened} onClose={close} title={title} centered>
            {children}
        </Modal>
    );
};

export default B2BModal;
