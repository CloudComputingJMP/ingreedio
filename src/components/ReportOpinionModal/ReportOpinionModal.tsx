import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import React, { useState } from 'react';

interface ReportOpinionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reportReason: string) => void;
}

const ReportOpinionModal: React.FC<ReportOpinionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reportReason, setReportReason] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(reportReason);
    setReportReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report Opinion</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Enter your reason for reporting this opinion..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Submit
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReportOpinionModal;
