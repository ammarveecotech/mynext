import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import { CoreModelOnboardform } from '@/models/CoreTables';
import { getSession } from 'next-auth/react';

type SubmitFormResponse = {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  details?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitFormResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    console.log('Starting form submission process...');
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database successfully');
    
    const formData = req.body;
    console.log('Received form data:', JSON.stringify(formData, null, 2));
    
    // Validate required fields
    if (!formData.id_number || !formData.display_name) {
      throw new Error('Required fields missing: id_number and display_name are required');
    }
    
    const session = await getSession({ req });
    const userId = session?.user?.id || formData.user_id;
    console.log('Raw User ID:', userId);
    
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Convert user_id to Base64 if it's not already
    const base64UserId = Buffer.from(userId).toString('base64');
    console.log('Base64 User ID:', base64UserId);

    console.log('Checking for existing form...');
    let onboardForm = await CoreModelOnboardform.findOne({ user_id: base64UserId });
    console.log('Existing form found:', !!onboardForm);
    
    // Set timestamps
    const now = new Date();
    const formattedDate = now.toISOString();

    // Prepare the data with proper formatting
    const formDataToSave = {
      ...formData,
      user_id: base64UserId,
      entry_time: formattedDate,
      update_time: formattedDate,
      created_at: formattedDate,
      updated_at: formattedDate,
      is_active: 0,
      is_ios_registeration: 0,
      is_registered_employee: 0,
      is_invisible: "Y",
      department: "Others",
      profile_views: 0,
      is_assessment_done: 0,
      is_career_explorer_done: 0,
      is_employability_done: 0,
      is_english_proficiency_done: 0,
      is_future_of_work_done: 0,
      is_personality_and_motivation_done: 0,
      is_work_interests_done: 0,
      is_work_values_done: 0,
      is_learning_styles_done: false,
      // Convert string values to numbers where needed
      nationality: typeof formData.nationality === 'string' ? parseInt(formData.nationality) : formData.nationality,
      disability_status: typeof formData.disability_status === 'string' ? parseInt(formData.disability_status) : formData.disability_status,
      scholar_status: typeof formData.scholar_status === 'string' ? parseInt(formData.scholar_status) : formData.scholar_status,
      step: typeof formData.step === 'string' ? parseInt(formData.step) : formData.step,
      // Ensure these fields exist even if null
      country: null,
      curr_country: formData.curr_country?.toString() || null,
      state: formData.state?.toString() || null,
      city: formData.city?.toString() || null,
      disability_code: null,
      curr_employer: null,
      sector: null,
      dur_year: null,
      dur_month: null,
      position: null,
      salary: null,
      high_qualification: null,
      insti_country: null,
      programmee: null,
      last_employer: null,
      university: null,
      study_program: null,
      intern_dur_year: null,
      intern_dur_month: null,
      intern_position: null,
      intern_allowance: null,
      organization_id: null,
      army_corp_regiment: null,
      army_id_number: null,
      army_is_active: null,
      army_last_rank: null,
      army_service: null,
      is_army: null,
      pension_status: null,
      perhebat_training_status: null,
      retirement_year: null
    };
    console.log('Form data to save:', JSON.stringify(formDataToSave, null, 2));

    try {
      if (onboardForm) {
        console.log('Updating existing form...');
        onboardForm = await CoreModelOnboardform.findOneAndUpdate(
          { user_id: base64UserId },
          formDataToSave,
          { new: true, runValidators: true }
        );
        console.log('Form updated successfully');
      } else {
        console.log('Creating new form...');
        onboardForm = await CoreModelOnboardform.create(formDataToSave);
        console.log('Form created successfully');
      }
    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw new Error(`Database operation failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
    }
    
    console.log('Form saved successfully:', JSON.stringify(onboardForm, null, 2));
    
    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      data: onboardForm
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Error submitting form',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    });
  }
}
