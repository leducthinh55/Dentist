import db from '../../../dbconnect/dbconnect';
import nc from 'next-connect';
import CustomerModel from '../../../models/CustomerModel';
import type { NextApiRequest, NextApiResponse } from 'next'
const handler = nc<NextApiRequest, NextApiResponse>();

handler.post(async (req, res) => {
    await db.connect();
    
    const { id } = req.body;
    console.log(id);
    const custom = await CustomerModel.findByIdAndDelete(id);
    await db.disconnect();
    res.status(200).json({ success: true, data: custom });
});

export default handler;