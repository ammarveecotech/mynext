import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import { CoreModelOnboardform } from '@/models/CoreTables';
import { 
  MasterState, 
  MasterCity, 
  MasterCountry, 
  MasterUniversity,
  MasterCampus,
  MasterFaculty,
  MasterStudyProgram,
  MasterScholarshipType,
  MasterAcademicQualification,
  MasterScopeOfStudy,
  MasterGrade,
  MasterEnglishEquivalentTestType
} from '@/models/MasterTables';
import { getSession } from 'next-auth/react';

type OverviewDataResponse = {
  success: boolean;
  data?: {
    // Personal Info
    stateName?: string;
    cityName?: string;
    nationalityName?: string;
    countryName?: string;
    
    // Current Status
    scholarshipType?: string;
    academicQualification?: string;
    universityName?: string;
    campusName?: string;
    facultyName?: string;
    studyProgramName?: string;
    instituteCountryName?: string;
    scopeOfStudyName?: string;
    gradeName?: string;
    englishTestName?: string;
    
    // Preferences
    preferredStateNames?: string[];
    interestedSectors?: string[];
    interestedPositions?: string[];
  };
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverviewDataResponse>
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
    
    // Initialize result object
    const result: any = {};
    
    // Process Personal Information
    if (formData.state && !String(formData.state).includes(',')) {
      const stateData = await MasterState.findOne({ Id: Number(formData.state) });
      if (stateData) {
        result.stateName = stateData.Name;
      }
    }
    
    if (formData.city) {
      const cityData = await MasterCity.findOne({ Id: Number(formData.city) });
      if (cityData) {
        result.cityName = cityData.Name;
      }
    }
    
    if (formData.nationality) {
      const nationalityData = await MasterCountry.findOne({ Id: Number(formData.nationality) });
      if (nationalityData) {
        result.nationalityName = nationalityData.Name;
      }
    }
    
    if (formData.curr_country) {
      const countryData = await MasterCountry.findOne({ Id: Number(formData.curr_country) });
      if (countryData) {
        result.countryName = countryData.Name;
      }
    }
    
    // Process Current Status
    if (formData.scholar_status) {
      const scholarshipData = await MasterScholarshipType.findOne({ Id: Number(formData.scholar_status) });
      if (scholarshipData) {
        result.scholarshipType = scholarshipData.Title;
      }
    }
    
    if (formData.curr_qualification) {
      const qualificationData = await MasterAcademicQualification.findOne({ Id: Number(formData.curr_qualification) });
      if (qualificationData) {
        result.academicQualification = qualificationData.Name;
      }
    }
    
    if (formData.university) {
      const universityData = await MasterUniversity.findOne({ Id: Number(formData.university) });
      if (universityData) {
        result.universityName = universityData.Name;
      }
    }
    
    if (formData.campus) {
      const campusData = await MasterCampus.findOne({ Id: Number(formData.campus) });
      if (campusData) {
        result.campusName = campusData.Name;
      }
    }
    
    if (formData.faculty) {
      const facultyData = await MasterFaculty.findOne({ Id: Number(formData.faculty) });
      if (facultyData) {
        result.facultyName = facultyData.Name;
      }
    }
    
    if (formData.study_program) {
      const programData = await MasterStudyProgram.findOne({ Id: Number(formData.study_program) });
      if (programData) {
        result.studyProgramName = programData.Name;
      }
    }
    
    if (formData.insti_country) {
      const instituteCountryData = await MasterCountry.findOne({ Id: Number(formData.insti_country) });
      if (instituteCountryData) {
        result.instituteCountryName = instituteCountryData.Name;
      }
    }
    
    if (formData.scope) {
      const scopeData = await MasterScopeOfStudy.findOne({ Id: Number(formData.scope) });
      if (scopeData) {
        result.scopeOfStudyName = scopeData.Name;
      }
    }
    
    if (formData.grade_status) {
      const gradeData = await MasterGrade.findOne({ Id: Number(formData.grade_status) });
      if (gradeData) {
        result.gradeName = gradeData.Title;
      }
    }
    
    if (formData.english_tests) {
      const testData = await MasterEnglishEquivalentTestType.findOne({ Id: Number(formData.english_tests) });
      if (testData) {
        result.englishTestName = testData.Title;
      }
    }
    
    // Process Preferences
    if (formData.state && String(formData.state).includes(',')) {
      const stateIds = String(formData.state).split(',');
      const preferredStateNames: string[] = [];
      
      for (const stateId of stateIds) {
        const stateData = await MasterState.findOne({ Id: Number(stateId) });
        if (stateData) {
          preferredStateNames.push(stateData.Name);
        }
      }
      
      result.preferredStateNames = preferredStateNames;
    }
    
    // For sectors and positions, these might be custom values or IDs
    // We'll handle them directly in the frontend for now
    
    // Return the collected data
    return res.status(200).json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error retrieving overview data:', error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
