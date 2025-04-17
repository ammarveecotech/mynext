import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
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
    
    // Create a new user with the form data
    const userData = {
      identificationType: formData.identificationType,
      identificationNumber: formData.identificationNumber,
      fullName: formData.fullName,
      displayName: formData.displayName,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      nationality: formData.nationality,
      race: formData.race,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      postcode: formData.postcode,
      isOKU: formData.isOKU,
      
      // Current Status
      scholarshipType: formData.scholarshipType,
      academicQualification: formData.academicQualification,
      institutionType: formData.institutionType,
      studyScope: formData.studyScope,
      enrollmentDate: formData.enrollmentDate,
      expectedGraduationDate: formData.expectedGraduationDate,
      currentYear: formData.currentYear,
      gradeType: formData.gradeType,
      gradeValue: formData.gradeValue,
      englishTest: formData.englishTest,
      
      // Preferences
      interestedSectors: formData.interestedSectors,
      interestedRoles: formData.interestedRoles,
      preferredStates: formData.preferredStates,
      
      // Profile Picture
      profilePicture: formData.profilePicture,
    };
    
    // Check if user with email already exists
    let user = await User.findOne({ email: formData.email });
    
    if (user) {
      // Update existing user
      user = await User.findOneAndUpdate(
        { email: formData.email },
        userData,
        { new: true, runValidators: true }
      );
    } else {
      // Create new user
      user = await User.create(userData);
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      message: 'Form submitted successfully',
      data: user
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