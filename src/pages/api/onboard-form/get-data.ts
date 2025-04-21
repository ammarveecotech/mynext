import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import CoreModelOnboardform from '@/models/CoreModelOnboardform';
import { getSession } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

type GetFormResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetFormResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get user session from server-side
    const session = await getServerSession(req, res, authOptions) || await getSession({ req });
    const userId = session?.user?.id || req.query.userId as string;
    
    console.log('API get-data - User ID:', userId);
    console.log('API get-data - Session:', session ? 'exists' : 'null');
    
    if (!userId) {
      console.log('API get-data - No user ID found');
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required'
      });
    }
    
    // Find form data for the user
    let onboardForm = await CoreModelOnboardform.findOne({ user_id: userId });
    
    // If no form data exists, create an empty one
    if (!onboardForm) {
      console.log('API get-data - Creating new form data for user:', userId);
      try {
        onboardForm = await CoreModelOnboardform.create({
          user_id: userId,
          step: 0,
          // Default values for required fields
          id_type: 1, // Default to Malaysian IC
          id_number: 'Not provided',
          display_name: 'Not provided',
          gender: 'M', // Default to Male
          dob: new Date('1990-01-01'), // Default date of birth
          mob_number: 'Not provided',
          nationality: 1, // Default to Malaysian
          created_at: new Date(),
          updated_at: new Date()
        });
        console.log('API get-data - Created new form data with ID:', onboardForm._id);
      } catch (error) {
        console.error('API get-data - Error creating form data:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to create form data',
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Return success response with data
    return res.status(200).json({ 
      success: true, 
      data: onboardForm
    });
  } catch (error) {
    // Log the error
    console.error('Error retrieving form data:', error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      message: 'Error retrieving form data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
