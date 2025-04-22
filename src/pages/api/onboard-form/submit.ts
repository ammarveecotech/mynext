import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import { CoreModelOnboardform } from '@/models/CoreTables';
import { getSession } from 'next-auth/react';

type SubmitFormResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitFormResponse>
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get the form data from the request
    const formData = req.body;
    
    // Get user session
    const session = await getSession({ req });
    const userId = session?.user?.id || formData.user_id;
    
    // Check if a form for this user already exists
    let onboardForm = await CoreModelOnboardform.findOne({ user_id: userId });
    
    // Set current timestamp
    const now = new Date();
    
    if (onboardForm) {
      // Update existing form
      onboardForm = await CoreModelOnboardform.findOneAndUpdate(
        { user_id: userId },
        { 
          ...formData,
          update_time: now,
          updated_at: now
        },
        { new: true, runValidators: true }
      );
    } else {
      // Create new form
      onboardForm = await CoreModelOnboardform.create({
        ...formData,
        user_id: userId,
        entry_time: now,
        update_time: now,
        created_at: now,
        updated_at: now
      });
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      data: onboardForm
    });
  } catch (error) {
    // Log the error
    console.error('Error submitting form:', error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      message: 'Error submitting form',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
