import React from 'react';
import { Modal, Text, Title } from '@mantine/core'
import useModalContext from '../../../hooks/contexts/modal/useModalContext';

const ErrorModal = (): JSX.Element => {

    const { state, dispatch } = useModalContext()

    return (
        <Modal opened={state.showErrorModal}
            onClose={() => dispatch({ type: 'HIDE_ERROR_MODAL' })}
            title={<Title order={3}>{state.errorModalTitle}</Title>}
            closeOnClickOutside={true} closeOnEscape={true}
            style={{ marginTop: '10vh' }}
        >
            <Text style={{ paddingTop: '.5em', paddingBottom: '1em'}}>{state.errorModalBody}</Text>
        </Modal>
    )
}

export default ErrorModal;