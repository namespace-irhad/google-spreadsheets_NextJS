import { FC, useState } from 'react';
import {
  Box,
  Switch,
  FormControl,
  FormLabel,
  ButtonGroup,
  Button,
  useToast,
  useClipboard,
} from '@chakra-ui/react';
import Modal from '../Modal';
import Table from '../Table';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type TableControlTypes = {
  titles: Array<string>;
  data: Array<any>;
  setUpdate: any;
  isOpen: boolean;
  isUpdate: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const TableControls: FC<TableControlTypes> = ({
  titles,
  data: receivedData,
  onOpen,
  isUpdate,
  setUpdate,
  isOpen,
  onClose,
}) => {
  const [modalData, setModalData] = useState({ titles: [], body: [] });
  const { onCopy } = useClipboard(
    JSON.stringify({
      titles: [...titles].slice(1),
      body: [...receivedData].map((row) => row.slice(1)),
    })
  );

  const copyToast = useToast();

  const exportPDF = () => {
    const unit = 'pt';
    const size = 'A4'; // Use A1, A2, A3 or A4
    const orientation = 'portrait'; // portrait or landscape

    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    const title = 'Google Sheets Calculation';

    let content = {
      startY: 50,
      head: [titles],
      body: receivedData,
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save('table-calc.pdf');
  };

  const exportJSON = () => {
    onCopy();
    copyToast({
      title: 'Copied.',
      description: 'Table Contents copied to clipboard.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  const importJSON = () => {
    navigator.clipboard.readText().then((text) => {
      try {
        const tableData = JSON.parse(text);
        if (tableData.titles && tableData.body) {
          setModalData({ titles: tableData.titles, body: tableData.body });
          onOpen();
        } else {
          copyToast({
            title: 'Error.',
            description: 'Table contents not suitable.',
            status: 'error',
            duration: 4000,
            isClosable: true,
          });
        }
      } catch (err) {
        copyToast({
          title: 'Error.',
          description: 'Clipboard contents not suitable.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    });
  };

  const handleBatchImport = () => {
    fetch('api/v1/sheet/batch-insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(modalData.body),
    })
      .then((res) => res.json())
      .then((payload) => console.log(payload));
  };

  return (
    <>
      <Modal
        handleImport={handleBatchImport}
        isOpen={isOpen}
        onClose={onClose}
        title="Unos novih podataka"
        disabled={!!!modalData.body.length}
      >
        <Box w="100%" p={2}>
          <Table
            body={modalData.body}
            titles={modalData.titles}
            setModalData={setModalData}
            deleteBtn
          />
        </Box>
      </Modal>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormControl display="flex" alignItems="center">
          <FormLabel
            userSelect="none"
            fontWeight="light"
            htmlFor="add-row"
            mb="0"
          >
            Add New?
          </FormLabel>
          <Switch
            id="add-row"
            isChecked={isUpdate}
            onChange={setUpdate.toggle}
          />
        </FormControl>

        <ButtonGroup alignItems="center" m="2">
          <Button onClick={exportPDF} colorScheme="linkedin" size="sm">
            Export
          </Button>
          <Button onClick={exportJSON} colorScheme="messenger" size="sm">
            Export as JSON
          </Button>
          <Button onClick={importJSON} variant="ghost" size="sm">
            Import
          </Button>
        </ButtonGroup>
      </Box>
    </>
  );
};

export default TableControls;
