import db from '../../../dbconnect/dbconnect';
import nc from 'next-connect';
import CustomerModel from '../../../models/CustomerModel';
import type { NextApiRequest, NextApiResponse } from 'next'
const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
  try {
    await db.connect();
    const custom = await CustomerModel.create(req.body);
    await db.disconnect();
    res.status(200).json({ success: true, data: custom });
  } catch (error) {
    res.status(200).json({ success: false });
  }    
});

export default handler;