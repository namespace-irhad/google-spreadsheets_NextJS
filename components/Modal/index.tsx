import { FC } from 'react';
import {
  Box,
  Button,
  Modal as ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';

type ModalTypes = {
  onClose: () => void;
  handleImport: () => void;
  isOpen: boolean;
  title: string;
  disabled?: boolean;
};

const Modal: FC<ModalTypes> = ({
  onClose,
  isOpen,
  title,
  children,
  handleImport,
  disabled,
}) => {
  return (
    <ChakraModal size="4xl" onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody minHeight="sm">{children}</ModalBody>
        <ModalFooter>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Button onClick={onClose} size="md">
              Close
            </Button>
            <Button
              disabled={disabled}
              onClick={handleImport}
              size="md"
              colorScheme="linkedin"
            >
              Import
            </Button>
          </Box>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
};

export default Modal;
