import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { countryId } = req.query;

  if (!countryId) {
    return res.status(400).json({ message: 'Country ID is required' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('mynext_db');
    
    const states = await db
      .collection('master_states')
      .find({ CountryId: parseInt(countryId as string) })
      .project({ 
        _id: 1, 
        Id: 1,
        Name: 1, 
        StateCode: 1,
        CountryId: 1,
        CountryCode: 1,
        CountryName: 1
      })
      .sort({ Name: 1 })
      .toArray();

    await client.close();
    
    return res.status(200).json(states);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
} 