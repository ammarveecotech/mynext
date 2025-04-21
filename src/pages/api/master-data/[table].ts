import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/db';
import * as MasterTables from '@/models/MasterTables';

type MasterTableResponse = {
  success: boolean;
  data?: any[];
  message?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MasterTableResponse>
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    // Connect to the database
    await dbConnect();
    
    // Get the table name from the URL
    const { table } = req.query;
    
    // Get parent ID if provided (for dependent dropdowns)
    const parentId = req.query.parentId as string;
    const parentField = req.query.parentField as string;
    
    // Determine which model to use based on the table parameter
    let data: any[] = [];
    let query: any = {};
    
    // Add parent filter if provided
    if (parentId && parentField) {
      query[parentField] = parentId;
    }
    
    // Sort options - use Name field for sorting
    const sortOptions = { Name: 1 } as any; // Type assertion to avoid TypeScript errors
    
    // Add filter for non-deleted items
    query.IsDeleted = { $ne: true };
    
    try {
      switch (table) {
        case 'universities':
          data = await MasterTables.MasterUniversity.find(query).sort(sortOptions);
          break;
        case 'countries':
          data = await MasterTables.MasterCountry.find(query).sort(sortOptions);
          break;
        case 'states':
          data = await MasterTables.MasterState.find(query).sort(sortOptions);
          break;
        case 'cities':
          data = await MasterTables.MasterCity.find(query).sort(sortOptions);
          break;
        case 'campus':
          data = await MasterTables.MasterCampus.find(query).sort(sortOptions);
          break;
        case 'faculty':
          data = await MasterTables.MasterFaculty.find(query).sort(sortOptions);
          break;
        case 'study_program':
          data = await MasterTables.MasterStudyProgram.find(query).sort(sortOptions);
          break;
        case 'scholarship_types':
          // For collections that use Title instead of Name
          data = await MasterTables.MasterScholarshipType.find(query).sort({ Title: 1 });
          break;
        case 'scholarship_subtypes':
          data = await MasterTables.MasterScholarshipSubtype.find(query).sort(sortOptions);
          break;
        case 'academic_qualifications':
          data = await MasterTables.MasterAcademicQualification.find(query).sort(sortOptions);
          break;
        case 'scope_of_studies':
          data = await MasterTables.MasterScopeOfStudy.find(query).sort(sortOptions);
          break;
        case 'grades':
          // For collections that use Title instead of Name
          data = await MasterTables.MasterGrade.find(query).sort({ Title: 1 });
          break;
        case 'english_test_types':
          // For collections that use Title instead of Name
          data = await MasterTables.MasterEnglishEquivalentTestType.find(query).sort({ Title: 1 });
          break;
      default:
        return res.status(404).json({ success: false, message: 'Table not found' });
    }
    } catch (innerError) {
      console.error(`Error in switch statement for ${table}:`, innerError);
      throw innerError; // Re-throw to be caught by the outer try-catch
    }
    
    // Return success response with data
    return res.status(200).json({ 
      success: true, 
      data
    });
  } catch (error) {
    // Log the error
    console.error(`Error fetching master data for ${req.query.table}:`, error);
    
    // Return error response
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching master data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
