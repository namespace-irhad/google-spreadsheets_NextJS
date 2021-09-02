// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

type Data = {
  message?: { [key: string]: any };
  data?: Array<any>;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  console.log('Batch insert\n', req.body);
  res.status(200).json({ message: 'Success' });
}
