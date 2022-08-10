import React from 'react';
import { Modal, Text, Title, Button } from '@mantine/core'
import useModalContext from '../../../hooks/contexts/modal/useModalContext';
import { useDeleteWaterbody } from '../../../hooks/mutations/useDeleteWaterbody'

interface Props {
    onSuccess: () => void
}

const ConfirmModal = ({ 
    onSuccess=()=>{} 
}: Props): JSX.Element => {

    const { state, dispatch } = useModalContext()

    const { mutate: deleteWaterbody } = useDeleteWaterbody()

    const handleConfirm = () => {
        if(state.selectedWaterbody && state.confirmType === 'DELETE'){
            deleteWaterbody({ _id: state.selectedWaterbody }, { onSuccess })
        }
        dispatch({ type: 'SUBMIT_CONFIRM' })
    }


    return (
        <Modal opened={state.showConfirmModal}
            onClose={() => dispatch({ type: 'CANCEL_CONFIRM' })}
            closeOnClickOutside={true} closeOnEscape={true}
            style={{ marginTop: '10vh' }}
            title={<Title order={3}>Confirm Action</Title>}
        >
            <Text style={{ paddingBottom: '3em', paddingTop: '1em'}}>{state.confirmModalBody}</Text>
            <div>
                <Button color='gray' style={{ marginRight: 8 }}
                    onClick={() => dispatch({ type: 'CANCEL_CONFIRM'})}
                >Cancel</Button>
                <Button onClick={handleConfirm} color='red'>Confirm</Button>
            </div>
        </Modal>
    )
}

export default ConfirmModal;