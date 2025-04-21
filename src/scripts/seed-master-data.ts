import mongoose from 'mongoose';
import * as MasterTables from '../models/MasterTables';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mynext_db';

// Sample data for master tables
const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Seed Countries
    const countries = [
      { name: 'Malaysia', code: 'MY', sort_order: 1 },
      { name: 'Singapore', code: 'SG', sort_order: 2 },
      { name: 'United States', code: 'US', sort_order: 3 },
      { name: 'United Kingdom', code: 'UK', sort_order: 4 },
      { name: 'Australia', code: 'AU', sort_order: 5 }
    ];
    
    console.log('Seeding countries...');
    await MasterTables.MasterCountry.deleteMany({});
    const createdCountries = await MasterTables.MasterCountry.insertMany(countries);
    console.log(`${createdCountries.length} countries seeded`);
    
    // Get Malaysia ID for reference
    const malaysiaId = createdCountries.find(c => c.code === 'MY')?._id;
    
    // Seed States (for Malaysia)
    if (malaysiaId) {
      const states = [
        { name: 'Selangor', code: 'SGR', country_id: malaysiaId, sort_order: 1 },
        { name: 'Kuala Lumpur', code: 'KL', country_id: malaysiaId, sort_order: 2 },
        { name: 'Penang', code: 'PNG', country_id: malaysiaId, sort_order: 3 },
        { name: 'Johor', code: 'JHR', country_id: malaysiaId, sort_order: 4 },
        { name: 'Sarawak', code: 'SWK', country_id: malaysiaId, sort_order: 5 }
      ];
      
      console.log('Seeding states...');
      await MasterTables.MasterState.deleteMany({ country_id: malaysiaId });
      const createdStates = await MasterTables.MasterState.insertMany(states);
      console.log(`${createdStates.length} states seeded`);
      
      // Get Selangor ID for reference
      const selangorId = createdStates.find(s => s.code === 'SGR')?._id;
      
      // Seed Cities (for Selangor)
      if (selangorId) {
        const cities = [
          { name: 'Shah Alam', code: 'SA', state_id: selangorId, sort_order: 1 },
          { name: 'Petaling Jaya', code: 'PJ', state_id: selangorId, sort_order: 2 },
          { name: 'Subang Jaya', code: 'SJ', state_id: selangorId, sort_order: 3 },
          { name: 'Klang', code: 'KLG', state_id: selangorId, sort_order: 4 },
          { name: 'Kajang', code: 'KJG', state_id: selangorId, sort_order: 5 }
        ];
        
        console.log('Seeding cities...');
        await MasterTables.MasterCity.deleteMany({ state_id: selangorId });
        const createdCities = await MasterTables.MasterCity.insertMany(cities);
        console.log(`${createdCities.length} cities seeded`);
      }
    }
    
    // Seed Universities
    const universities = [
      { name: 'Universiti Malaya', code: 'UM', sort_order: 1 },
      { name: 'Universiti Kebangsaan Malaysia', code: 'UKM', sort_order: 2 },
      { name: 'Universiti Putra Malaysia', code: 'UPM', sort_order: 3 },
      { name: 'Universiti Sains Malaysia', code: 'USM', sort_order: 4 },
      { name: 'Universiti Teknologi Malaysia', code: 'UTM', sort_order: 5 }
    ];
    
    console.log('Seeding universities...');
    await MasterTables.MasterUniversity.deleteMany({});
    const createdUniversities = await MasterTables.MasterUniversity.insertMany(universities);
    console.log(`${createdUniversities.length} universities seeded`);
    
    // Get UM ID for reference
    const umId = createdUniversities.find(u => u.code === 'UM')?._id;
    
    // Seed Campus (for UM)
    if (umId) {
      const campuses = [
        { name: 'Main Campus', code: 'UMMAIN', university_id: umId, sort_order: 1 },
        { name: 'Medical Campus', code: 'UMMED', university_id: umId, sort_order: 2 }
      ];
      
      console.log('Seeding campuses...');
      await MasterTables.MasterCampus.deleteMany({ university_id: umId });
      const createdCampuses = await MasterTables.MasterCampus.insertMany(campuses);
      console.log(`${createdCampuses.length} campuses seeded`);
      
      // Get Main Campus ID for reference
      const mainCampusId = createdCampuses.find(c => c.code === 'UMMAIN')?._id;
      
      // Seed Faculties (for UM Main Campus)
      if (mainCampusId) {
        const faculties = [
          { name: 'Faculty of Computer Science', code: 'UMCS', campus_id: mainCampusId, sort_order: 1 },
          { name: 'Faculty of Engineering', code: 'UMENG', campus_id: mainCampusId, sort_order: 2 },
          { name: 'Faculty of Business', code: 'UMBUS', campus_id: mainCampusId, sort_order: 3 },
          { name: 'Faculty of Arts', code: 'UMARTS', campus_id: mainCampusId, sort_order: 4 }
        ];
        
        console.log('Seeding faculties...');
        await MasterTables.MasterFaculty.deleteMany({ campus_id: mainCampusId });
        const createdFaculties = await MasterTables.MasterFaculty.insertMany(faculties);
        console.log(`${createdFaculties.length} faculties seeded`);
        
        // Get CS Faculty ID for reference
        const csFacultyId = createdFaculties.find(f => f.code === 'UMCS')?._id;
        
        // Seed Study Programs (for CS Faculty)
        if (csFacultyId) {
          const programs = [
            { name: 'Bachelor of Computer Science', code: 'BCS', faculty_id: csFacultyId, sort_order: 1 },
            { name: 'Bachelor of Information Technology', code: 'BIT', faculty_id: csFacultyId, sort_order: 2 },
            { name: 'Bachelor of Software Engineering', code: 'BSE', faculty_id: csFacultyId, sort_order: 3 },
            { name: 'Bachelor of Data Science', code: 'BDS', faculty_id: csFacultyId, sort_order: 4 }
          ];
          
          console.log('Seeding study programs...');
          await MasterTables.MasterStudyProgram.deleteMany({ faculty_id: csFacultyId });
          const createdPrograms = await MasterTables.MasterStudyProgram.insertMany(programs);
          console.log(`${createdPrograms.length} study programs seeded`);
        }
      }
    }
    
    // Seed Scholarship Types
    const scholarshipTypes = [
      { name: 'Government Scholarship', code: 'GOVT', sort_order: 1 },
      { name: 'Private Scholarship', code: 'PRIV', sort_order: 2 },
      { name: 'University Scholarship', code: 'UNI', sort_order: 3 },
      { name: 'International Scholarship', code: 'INTL', sort_order: 4 },
      { name: 'Self-Funded', code: 'SELF', sort_order: 5 }
    ];
    
    console.log('Seeding scholarship types...');
    await MasterTables.MasterScholarshipType.deleteMany({});
    const createdScholarshipTypes = await MasterTables.MasterScholarshipType.insertMany(scholarshipTypes);
    console.log(`${createdScholarshipTypes.length} scholarship types seeded`);
    
    // Get Government Scholarship ID for reference
    const govtScholarshipId = createdScholarshipTypes.find(s => s.code === 'GOVT')?._id;
    
    // Seed Scholarship Subtypes (for Government Scholarship)
    if (govtScholarshipId) {
      const scholarshipSubtypes = [
        { name: 'JPA Scholarship', code: 'JPA', scholarship_type_id: govtScholarshipId, sort_order: 1 },
        { name: 'MARA Scholarship', code: 'MARA', scholarship_type_id: govtScholarshipId, sort_order: 2 },
        { name: 'PTPTN Loan', code: 'PTPTN', scholarship_type_id: govtScholarshipId, sort_order: 3 }
      ];
      
      console.log('Seeding scholarship subtypes...');
      await MasterTables.MasterScholarshipSubtype.deleteMany({ scholarship_type_id: govtScholarshipId });
      const createdSubtypes = await MasterTables.MasterScholarshipSubtype.insertMany(scholarshipSubtypes);
      console.log(`${createdSubtypes.length} scholarship subtypes seeded`);
    }
    
    // Seed Academic Qualifications
    const academicQualifications = [
      { name: 'SPM', code: 'SPM', sort_order: 1 },
      { name: 'STPM', code: 'STPM', sort_order: 2 },
      { name: 'Diploma', code: 'DIP', sort_order: 3 },
      { name: 'Bachelor\'s Degree', code: 'BACH', sort_order: 4 },
      { name: 'Master\'s Degree', code: 'MAST', sort_order: 5 },
      { name: 'PhD', code: 'PHD', sort_order: 6 }
    ];
    
    console.log('Seeding academic qualifications...');
    await MasterTables.MasterAcademicQualification.deleteMany({});
    const createdQualifications = await MasterTables.MasterAcademicQualification.insertMany(academicQualifications);
    console.log(`${createdQualifications.length} academic qualifications seeded`);
    
    // Seed Scope of Studies
    const scopeOfStudies = [
      { name: 'Computer Science', code: 'CS', sort_order: 1 },
      { name: 'Engineering', code: 'ENG', sort_order: 2 },
      { name: 'Business', code: 'BUS', sort_order: 3 },
      { name: 'Medicine', code: 'MED', sort_order: 4 },
      { name: 'Arts', code: 'ARTS', sort_order: 5 },
      { name: 'Law', code: 'LAW', sort_order: 6 }
    ];
    
    console.log('Seeding scope of studies...');
    await MasterTables.MasterScopeOfStudy.deleteMany({});
    const createdScopes = await MasterTables.MasterScopeOfStudy.insertMany(scopeOfStudies);
    console.log(`${createdScopes.length} scope of studies seeded`);
    
    // Seed Grades
    const grades = [
      { name: 'A', code: 'A', sort_order: 1 },
      { name: 'B', code: 'B', sort_order: 2 },
      { name: 'C', code: 'C', sort_order: 3 },
      { name: 'D', code: 'D', sort_order: 4 },
      { name: 'E', code: 'E', sort_order: 5 },
      { name: 'F', code: 'F', sort_order: 6 }
    ];
    
    console.log('Seeding grades...');
    await MasterTables.MasterGrade.deleteMany({});
    const createdGrades = await MasterTables.MasterGrade.insertMany(grades);
    console.log(`${createdGrades.length} grades seeded`);
    
    // Seed English Test Types
    const englishTestTypes = [
      { name: 'MUET', code: 'MUET', sort_order: 1 },
      { name: 'IELTS', code: 'IELTS', sort_order: 2 },
      { name: 'TOEFL', code: 'TOEFL', sort_order: 3 },
      { name: 'CEFR', code: 'CEFR', sort_order: 4 }
    ];
    
    console.log('Seeding English test types...');
    await MasterTables.MasterEnglishEquivalentTestType.deleteMany({});
    const createdTestTypes = await MasterTables.MasterEnglishEquivalentTestType.insertMany(englishTestTypes);
    console.log(`${createdTestTypes.length} English test types seeded`);
    
    console.log('All master data seeded successfully');
  } catch (error) {
    console.error('Error seeding master data:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seed function
seedData();
