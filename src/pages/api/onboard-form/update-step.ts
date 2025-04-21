import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import CoreModelOnboardform from '@/models/CoreModelOnboardform';
import { getSession } from 'next-auth/react';

type UpdateStepResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateStepResponse>
) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get the step data from the request
    const { step } = req.body;
    
    if (!step || typeof step !== 'number') {
      return res.status(400).json({ 
        success: false, 
        message: 'Step is required and must be a number'
      });
    }
    
    // Get user session or user ID from body
    const session = await getSession({ req });
    const userId = session?.user?.id || req.body.user_id;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required'
      });
    }
    
    // Set current timestamp
    const now = new Date();
    
    // Find and update form data for the user
    const onboardForm = await CoreModelOnboardform.findOneAndUpdate(
      { user_id: userId },
      { 
        step,
        update_time: now,
        updated_at: now
      },
      { new: true, upsert: true }
    );
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Step updated successfully',
      data: onboardForm
    });
  } catch (error) {
    // Log the error
    console.error('Error updating step:', error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      message: 'Error updating step',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
