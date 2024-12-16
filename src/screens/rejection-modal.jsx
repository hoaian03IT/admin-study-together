/* eslint-disable react/prop-types */
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from "@nextui-org/react";
import { memo } from "react";

// eslint-disable-next-line react/display-name
export const RejectionModal = memo(
    ({ showRejectReasonModal, rejectReason, setRejectReason, handleRejectCourse, onClose }) => {
        return (
            <Modal isOpen={!!showRejectReasonModal} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Reject reason</ModalHeader>
                    <ModalBody>
                        <Textarea
                            rows={5}
                            cols={50}
                            placeholder="You can reject without reason"
                            value={rejectReason}
                            onValueChange={setRejectReason}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="warning" radius="sm" size="sm" onPress={handleRejectCourse}>
                            Reject
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        );
    }
);
