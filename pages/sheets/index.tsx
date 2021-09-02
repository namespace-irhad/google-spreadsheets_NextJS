import React from 'react';
import { GetStaticProps } from 'next';
import { google } from 'googleapis';
import {
  VStack,
  Heading,
  Box,
  Divider,
  useDisclosure,
  useBoolean,
} from '@chakra-ui/react';
import Table from '../../components/Table';
import TableControls from '../../components/TableControls';

interface SheetsType {
  titles: Array<string>;
  data: Array<any>;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const scopes = ['https://www.googleapis.com/auth/spreadsheets'];
  const range = 'Sheet1';

  const auth = await google.auth.getClient({ scopes });
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    range,
    spreadsheetId: process.env.SHEET_ID,
  });
  const [titles, ...data] = res.data.values || [];

  return {
    props: {
      titles,
      data,
    },
    revalidate: 1,
  };
};

const Sheets: React.FC<SheetsType> = ({ titles, data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUpdate, setUpdate] = useBoolean();

  return (
    <>
      <Box
        w="100vw"
        d="flex"
        mt="16"
        justifyContent="center"
        alignItems="center"
        backgroundColor="linkedin.50"
      >
        <VStack align="stretch" backgroundColor="white" padding="5" margin="5">
          <Heading
            textAlign="center"
            size="lg"
            backgroundColor="linkedin.600"
            color="white"
            p="2"
          >
            Google Sheets Calculation
          </Heading>
          <Divider />
          <Box w="100%" p={2}>
            <TableControls
              onOpen={onOpen}
              isUpdate={isUpdate}
              setUpdate={setUpdate}
              titles={titles}
              data={data}
              isOpen={isOpen}
              onClose={onClose}
            />
            <Table
              isUpdate={isUpdate}
              setUpdate={setUpdate}
              titles={titles}
              body={data}
            />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default Sheets;
