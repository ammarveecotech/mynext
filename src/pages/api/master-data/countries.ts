import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('mynext_db');
    
    const countries = await db
      .collection('master_countries')
      .find({})
      .project({ 
        _id: 1, 
        Id: 1,
        Name: 1,
        Iso2: 1,
        Iso3: 1,
        NumericCode: 1,
        PhoneCode: 1,
        Capital: 1,
        Currency: 1,
        Region: 1,
        Subregion: 1
      })
      .sort({ Name: 1 })
      .toArray();

    await client.close();
    
    return res.status(200).json(countries);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
}