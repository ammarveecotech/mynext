import { NextApiRequest, NextApiResponse } from 'next';
import { MasterScholarshipType } from '@/models/MasterTables';
import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    
    const scholarshipTypes = await MasterScholarshipType.find({ IsDeleted: false })
      .select('Id Title Name IsDisabled')
      .sort('Title')
      .lean();

    return res.status(200).json(scholarshipTypes);
  } catch (error) {
    console.error('Error fetching scholarship types:', error);
    return res.status(500).json({ message: 'Failed to fetch scholarship types' });
  }
} 