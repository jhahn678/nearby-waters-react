import { Modal, Text, Title } from '@mantine/core'

const ErrorModal = ({ visible, setVisible, error }) => {


    return (
        <Modal
            opened={visible}
            onClose={setVisible}
            title={<Title order={3}>There was an issue..</Title>}
            closeOnClickOutside={true} closeOnEscape={true}
        >
            <Text>{error}</Text>
        </Modal>
    )
}

export default ErrorModal;