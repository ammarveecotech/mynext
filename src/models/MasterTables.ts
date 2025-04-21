import mongoose, { Schema, Document, Model } from 'mongoose';

// Base interface for all master tables
interface IMasterBase extends Document {
  Name: string;
  Id?: number;
  IsDeleted?: boolean;
}

// Master Universities (master_universities)
export interface IMasterUniversity extends IMasterBase {
  Type?: string;
  IsCustom?: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
}

const MasterUniversitySchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  IsDeleted: { type: Boolean, default: false },
  CreatedDate: { type: Date },
  UpdatedDate: { type: Date },
  Type: { type: String },
  IsCustom: { type: Number }
});

// Master Countries (master_countries)
export interface IMasterCountry extends IMasterBase {
  Iso3?: string;
  Iso2?: string;
  NumericCode?: string;
  PhoneCode?: string;
  Capital?: string;
  Currency?: string;
  CurrencyName?: string;
  CurrencySymbol?: string;
  Tld?: string;
  Native?: string;
  Region?: string;
  Subregion?: string;
  Timezones?: any[];
  Translations?: any;
  Latitude?: string;
  Longitude?: string;
  Emoji?: string;
  EmojiU?: string;
}

const MasterCountrySchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  Iso3: { type: String },
  Iso2: { type: String },
  NumericCode: { type: String },
  PhoneCode: { type: String },
  Capital: { type: String },
  Currency: { type: String },
  CurrencyName: { type: String },
  CurrencySymbol: { type: String },
  Tld: { type: String },
  Native: { type: String },
  Region: { type: String },
  Subregion: { type: String },
  Timezones: { type: Array },
  Translations: { type: Object },
  Latitude: { type: String },
  Longitude: { type: String },
  Emoji: { type: String },
  EmojiU: { type: String }
});

// Master States (master_states)
export interface IMasterState extends IMasterBase {
  CountryId: number; // Reference to country
  CountryCode?: string;
  CountryName?: string;
  StateCode?: string;
  Type?: string;
  Latitude?: string;
  Longitude?: string;
}

const MasterStateSchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  CountryId: { type: Number, required: true },
  CountryCode: { type: String },
  CountryName: { type: String },
  StateCode: { type: String },
  Type: { type: String },
  Latitude: { type: String },
  Longitude: { type: String },
  IsDeleted: { type: Boolean, default: false }
});

// Master Cities (master_cities)
export interface IMasterCity extends IMasterBase {
  StateId: number; // Reference to state
  StateCode?: string;
  StateName?: string;
  CountryId: number; // Reference to country
  CountryCode?: string;
  CountryName?: string;
  Latitude?: string;
  Longitude?: string;
  WikiDataId?: string;
}

const MasterCitySchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  StateId: { type: Number, required: true },
  StateCode: { type: String },
  StateName: { type: String },
  CountryId: { type: Number, required: true },
  CountryCode: { type: String },
  CountryName: { type: String },
  Latitude: { type: String },
  Longitude: { type: String },
  WikiDataId: { type: String },
  IsDeleted: { type: Boolean, default: false }
});

// Master Campus (master_campus)
export interface IMasterCampus extends IMasterBase {
  UniversityId: number; // Reference to university
}

const MasterCampusSchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  UniversityId: { type: Number, required: true },
  IsDeleted: { type: Boolean, default: false }
});

// Master Faculty (master_faculty)
export interface IMasterFaculty extends IMasterBase {
  ExternalId?: string;
  CollegeId: number; // Reference to university/college
}

const MasterFacultySchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  ExternalId: { type: String },
  CollegeId: { type: Number, required: true },
  IsDeleted: { type: Boolean, default: false }
});

// Master Study Program (master_study_program)
export interface IMasterStudyProgram extends IMasterBase {
  Code?: string;
  DepartmentId: number; // Reference to department/faculty
  RiasecCode1?: string;
  RiasecCode2?: string;
  RiasecCode3?: string;
}

const MasterStudyProgramSchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  Code: { type: String },
  DepartmentId: { type: Number, required: true },
  IsDeleted: { type: Boolean, default: false },
  RiasecCode1: { type: String },
  RiasecCode2: { type: String },
  RiasecCode3: { type: String }
});

// Master Scholarship Types (master_scholarship_types)
export interface IMasterScholarshipType extends IMasterBase {
  EnumValue: number;
  Title: string;
  IsDisabled: boolean;
  UniversityId: number;
  CreatedDate?: Date;
  UpdatedDate?: Date;
}

const MasterScholarshipTypeSchema = new Schema({
  Id: { type: Number },
  EnumValue: { type: Number },
  Title: { type: String, required: true },
  IsDisabled: { type: Boolean, default: false },
  UniversityId: { type: Number },
  IsDeleted: { type: Boolean, default: false },
  CreatedDate: { type: Date },
  UpdatedDate: { type: Date },
  Name: { type: String } // Adding this for compatibility with our interface
});

// Master Scholarship Subtypes (master_scholarship_subtypes)
export interface IMasterScholarshipSubtype extends IMasterBase {
  ScholarshipTypeId: number; // Reference to scholarship type
}

const MasterScholarshipSubtypeSchema = new Schema({
  Name: { type: String, required: true },
  Id: { type: Number },
  ScholarshipTypeId: { type: Number, required: true },
  IsDeleted: { type: Boolean, default: false }
});

// Master Academic Qualifications (master_academic_qualifications)
export interface IMasterAcademicQualification extends IMasterBase {
  Sequence?: number;
  EnumValue?: number;
  UniversityId?: number;
  CreatedDate?: string;
  UpdatedDate?: string;
}

const MasterAcademicQualificationSchema = new Schema({
  Id: { type: Number },
  Name: { type: String, required: true },
  Sequence: { type: Number },
  EnumValue: { type: Number },
  UniversityId: { type: Number },
  IsDeleted: { type: Boolean, default: false },
  CreatedDate: { type: String },
  UpdatedDate: { type: String }
});

// Master Scope of Studies (master_scope_of_studies)
export interface IMasterScopeOfStudy extends IMasterBase {
  UniversityId?: number;
  CreatedDate?: string;
  UpdatedDate?: string;
}

const MasterScopeOfStudySchema = new Schema({
  Id: { type: Number },
  CreatedDate: { type: String },
  IsDeleted: { type: Boolean, default: false },
  Name: { type: String, required: true },
  UniversityId: { type: Number },
  UpdatedDate: { type: String }
});

// Master Grades (master_grades)
export interface IMasterGrade extends IMasterBase {
  EnumValue?: number;
  Title: string;
  IsDisabled?: boolean;
  FinalGradeEnumValue?: number;
  UniversityId?: number;
  CreatedDate?: string;
  UpdatedDate?: string;
}

const MasterGradeSchema = new Schema({
  Id: { type: Number },
  EnumValue: { type: Number },
  Title: { type: String, required: true },
  IsDisabled: { type: Boolean, default: false },
  FinalGradeEnumValue: { type: Number },
  UniversityId: { type: Number },
  IsDeleted: { type: Boolean, default: false },
  CreatedDate: { type: String },
  UpdatedDate: { type: String },
  Name: { type: String } // Adding this for compatibility with our interface
});

// Master English Equivalent Test Types (master_english_equivalent_test_types)
export interface IMasterEnglishEquivalentTestType extends IMasterBase {
  EnumValue?: number;
  Title: string;
  IsDisabled?: boolean;
  UniversityId?: number;
  CreatedDate?: string;
  UpdatedDate?: string;
}

const MasterEnglishEquivalentTestTypeSchema = new Schema({
  Id: { type: Number },
  EnumValue: { type: Number },
  Title: { type: String, required: true },
  IsDisabled: { type: Boolean, default: false },
  UniversityId: { type: Number },
  IsDeleted: { type: Boolean, default: false },
  CreatedDate: { type: String },
  UpdatedDate: { type: String },
  Name: { type: String } // Adding this for compatibility with our interface
});

// Create models (with hot reload protection)
const getModel = <T>(name: string, schema: Schema): Model<T> => {
  return (mongoose.models[name] as Model<T>) || mongoose.model<T>(name, schema);
};

export const MasterUniversity = getModel<IMasterUniversity>('master_universities', MasterUniversitySchema);
export const MasterCountry = getModel<IMasterCountry>('master_countries', MasterCountrySchema);
export const MasterState = getModel<IMasterState>('master_states', MasterStateSchema);
export const MasterCity = getModel<IMasterCity>('master_cities', MasterCitySchema);
export const MasterCampus = getModel<IMasterCampus>('master_campus', MasterCampusSchema);
export const MasterFaculty = getModel<IMasterFaculty>('master_faculty', MasterFacultySchema);
export const MasterStudyProgram = getModel<IMasterStudyProgram>('master_study_program', MasterStudyProgramSchema);
export const MasterScholarshipType = getModel<IMasterScholarshipType>('master_scholarship_types', MasterScholarshipTypeSchema);
export const MasterScholarshipSubtype = getModel<IMasterScholarshipSubtype>('master_scholarship_subtypes', MasterScholarshipSubtypeSchema);
export const MasterAcademicQualification = getModel<IMasterAcademicQualification>('master_academic_qualifications', MasterAcademicQualificationSchema);
export const MasterScopeOfStudy = getModel<IMasterScopeOfStudy>('master_scope_of_studies', MasterScopeOfStudySchema);
export const MasterGrade = getModel<IMasterGrade>('master_grades', MasterGradeSchema);
export const MasterEnglishEquivalentTestType = getModel<IMasterEnglishEquivalentTestType>('master_english_equivalent_test_types', MasterEnglishEquivalentTestTypeSchema);
