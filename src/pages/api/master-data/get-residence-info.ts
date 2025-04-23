import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import { CoreModelOnboardform } from '@/models/CoreTables';
import { MasterState, MasterCity } from '@/models/MasterTables';
import { getSession } from 'next-auth/react';

type ResidenceInfoResponse = {
  success: boolean;
  stateName?: string;
  cityName?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResidenceInfoResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get user session
    const session = await getSession({ req });
    if (!session?.user?.id) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }
    
    // Get the form data for this user
    const formData = await CoreModelOnboardform.findOne({ user_id: session.user.id });
    if (!formData) {
      return res.status(404).json({ success: false, error: 'Form data not found' });
    }
    
    // Extract current residence information (not preferred states)
    const currentStateId = formData.state;
    const currentCityId = formData.city;
    
    // Collect the results
    let stateName = '';
    let cityName = '';
    
    // Get state name if state ID is provided and it's not a comma-separated list
    if (currentStateId && !String(currentStateId).includes(',')) {
      const stateData = await MasterState.findOne({ Id: Number(currentStateId) });
      if (stateData) {
        stateName = stateData.Name;
      }
    }
    
    // Get city name if city ID is provided
    if (currentCityId) {
      const cityData = await MasterCity.findOne({ Id: Number(currentCityId) });
      if (cityData) {
        cityName = cityData.Name;
      }
    }
    
    // Return the residence information
    return res.status(200).json({
      success: true,
      stateName,
      cityName
    });
    
  } catch (error) {
    console.error('Error retrieving residence information:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
