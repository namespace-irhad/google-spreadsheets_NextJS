import {
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Input,
  Tfoot,
  Tooltip,
  CloseButton,
} from '@chakra-ui/react';
import { FC, useState, useRef, useEffect } from 'react';

const Table: FC<{
  titles: Array<string>;
  body: Array<any>;
  isUpdate?: boolean;
  setUpdate?: any;
  deleteBtn?: boolean;
  setModalData?: any;
}> = ({
  titles,
  body,
  isUpdate,
  setUpdate,
  deleteBtn = false,
  setModalData,
}) => {
  const [receivedData, setReceivedData] = useState(body);
  const [loading, setLoading] = useState(false);
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [valueOne, setValueOne] = useState(0);
  const [valueTwo, setValueTwo] = useState(0);

  const tableRef = useRef<any>(null);

  const removeItem: (itemIndex: any) => void = (itemIndex) => {
    const dataArray = receivedData.filter((_, i) => i !== itemIndex);
    setReceivedData(dataArray);
    setModalData({ titles, body: dataArray });
  };

  useEffect(() => {
    if (valueOne === 0 && valueTwo === 0) {
      setDisabledBtn(true);
    } else {
      setDisabledBtn(false);
    }
  }, [valueOne, valueTwo]);

  const handleInput = async () => {
    setLoading(true);

    const body = {
      valueOne,
      valueTwo,
    };

    fetch('api/v1/sheet/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.data) {
          setReceivedData((prevData) => [...prevData, ...payload.data]);
          tableRef.current.scrollTop = tableRef.current.scrollHeight;
        }
        setUpdate.toggle();
        setValueOne(0);
        setValueTwo(0);
        setLoading(false);
      });
  };

  return (
    <Box overflowX="hidden" w="100%" display="grid" placeItems="center">
      <ChakraTable
        display="table"
        size="sm"
        colorScheme="blackAlpha"
        variant="striped"
        width="initial"
      >
        <Thead backgroundColor="linkedin.100" display="block">
          <Tr display="flex" justifyContent="space-around">
            {titles.map((title: string) => (
              <Th key={title}>{title}</Th>
            ))}
            {deleteBtn && <Th colSpan={2} />}
          </Tr>
        </Thead>
        <Tbody ref={tableRef} maxHeight="300px" overflow="auto" display="block">
          {receivedData.map((bodyArray: Array<any>, i: number) => (
            <Tr key={bodyArray[0] + i}>
              {bodyArray.map((item: any, j: number) => (
                <Td textAlign="center" w={24} key={item.toString() + j}>
                  {item}
                </Td>
              ))}
              {deleteBtn && (
                <Td>
                  <CloseButton
                    onClick={() => removeItem(i)}
                    color="red"
                    size="sm"
                  />
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
        {isUpdate && (
          <Tfoot display="block">
            <Tr
              display="flex"
              alignItems="center"
              width="100%"
              bg="telegram.400"
              color="white"
            >
              <Td border="none" width="20px" />
              <Td border="none">#</Td>
              <Td border="none">
                <Input
                  disabled={loading}
                  value={valueOne}
                  onChange={({ target: { value } }) =>
                    setValueOne(Number(value))
                  }
                  type="number"
                  variant="filled"
                  color="black"
                  size="xs"
                  maxW={16}
                />
              </Td>
              <Td border="none">
                <Input
                  disabled={loading}
                  value={valueTwo}
                  onChange={({ target: { value } }) =>
                    setValueTwo(Number(value))
                  }
                  type="number"
                  variant="filled"
                  color="black"
                  size="xs"
                  maxW={16}
                />
              </Td>
              <Td border="none" flex="1">
                <Tooltip
                  label="Enter values to submit."
                  aria-label="Required fields"
                  placement="right"
                  isDisabled={!disabledBtn}
                >
                  <span style={{ float: 'right' }}>
                    <Button
                      disabled={disabledBtn}
                      isLoading={loading}
                      color="white"
                      float="right"
                      variant="ghost"
                      _hover={{ color: 'green' }}
                      onClick={handleInput}
                    >
                      ✓
                    </Button>
                  </span>
                </Tooltip>
              </Td>
            </Tr>
          </Tfoot>
        )}
      </ChakraTable>
    </Box>
  );
};

export default Table;
