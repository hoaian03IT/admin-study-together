import { Image, Modal, ModalBody, ModalContent } from "@nextui-org/react";

export const PreviewImageModal = ({ imagePreview, setImagePreview }) => {
    return (
        <Modal
            size="lg"
            className="p-0"
            isOpen={!!imagePreview}
            onClose={() => {
                setImagePreview(null);
            }}>
            <ModalContent className="p-0">
                <ModalBody className="p-0">
                    <div className="flex justify-center">
                        <Image src={imagePreview} className="size-96" />
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
