import { NextApiRequest, NextApiResponse } from 'next';
import { MasterScopeOfStudy } from '@/models/MasterTables';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const studyScopes = await MasterScopeOfStudy.find({ IsDeleted: false })
      .select('Id Name')
      .sort('Name')
      .lean();

    return res.status(200).json(studyScopes);
  } catch (error) {
    console.error('Error fetching study scopes:', error);
    return res.status(500).json({ message: 'Failed to fetch study scopes' });
  }
} 