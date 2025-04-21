import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db('mynext_db');
    
    const qualifications = await db
      .collection('master_academic_qualifications')
      .find({})
      .project({ 
        _id: 1,
        Id: 1,
        Name: 1,
        Sequence: 1,
        EnumValue: 1,
        UniversityId: 1
      })
      .sort({ Sequence: 1 }) // Sort by sequence for proper ordering
      .toArray();

    await client.close();
    
    return res.status(200).json(qualifications);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ message: 'Error connecting to database' });
  }
} 