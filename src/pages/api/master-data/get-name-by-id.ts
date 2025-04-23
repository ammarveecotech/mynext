import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import * as MasterTables from '@/models/MasterTables';

type MasterNameResponse = {
  success: boolean;
  name?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MasterNameResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get the parameters
    const { table, id } = req.query;
    
    if (!table || !id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Table and ID are required parameters' 
      });
    }
    
    // Convert ID to number if possible
    const numericId = Number(id);
    
    // Query for the item with the specified ID
    let item: any;
    
    switch (table) {
      case 'states':
        item = await MasterTables.MasterState.findOne({ Id: numericId });
        break;
      case 'cities':
        item = await MasterTables.MasterCity.findOne({ Id: numericId });
        break;
      case 'countries':
        item = await MasterTables.MasterCountry.findOne({ Id: numericId });
        break;
      // Add other cases as needed
      default:
        return res.status(404).json({ 
          success: false, 
          error: `Table ${table} not supported` 
        });
    }
    
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        error: `Item not found with ID ${id} in table ${table}` 
      });
    }
    
    // Return the name
    return res.status(200).json({ 
      success: true, 
      name: item.Name
    });
    
  } catch (error) {
    console.error('Error retrieving master item name:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
