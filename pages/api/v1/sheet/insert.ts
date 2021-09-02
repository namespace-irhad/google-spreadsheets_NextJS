// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

type Data = {
  message?: { [key: string]: any };
  data?: Array<any>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  return new Promise<void>(async (resolve) => {
    const { valueOne, valueTwo } = req.body;
    const scopes = ['https://www.googleapis.com/auth/spreadsheets'];

    const auth = await google.auth.getClient({ scopes });
    const sheets = google.sheets({ version: 'v4', auth });

    const body = {
      range: 'Sheet1',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [['', valueOne, valueTwo]],
      },
    };

    sheets.spreadsheets.values.append(
      {
        auth,
        spreadsheetId: process.env.SHEET_ID,
        ...body,
      },
      async (err: any, response: any) => {
        if (err) {
          console.log(err);
          res.json({ message: err.message });
          res.status(400).end();
          return resolve();
        }

        const { data } = await sheets.spreadsheets.values.get({
          range: response.data.updates.updatedRange.replace(/[AC]/g, ''),
          spreadsheetId: process.env.SHEET_ID,
        });

        res.json({ data: data.values || [] });
        res.status(200).end();
        return resolve();
      }
    );
  });
}
