import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoreModelUserProfile extends Document {
  _id: string;
  entry_time: Date;
  update_time: Date;
  created_at: Date;
  updated_at: Date;
  user_id: Buffer;
  login_type: string;
  user_type: string;
  profile_picture: string;
  is_new_user: number;
  profile_views?: number;
  is_invisible?: string;
  is_active?: number;
}

const CoreModelUserProfileSchema = new Schema({
  _id: { type: String, required: true },
  entry_time: { type: Date, required: true },
  update_time: { type: Date, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  user_id: { type: Buffer, required: true },
  login_type: { type: String, required: true },
  user_type: { type: String, required: true },
  profile_picture: { type: String, required: true },
  is_new_user: { type: Number, required: true },
  profile_views: { type: Number },
  is_invisible: { type: String },
  is_active: { type: Number },
}, { timestamps: true });

// Interface to define the CoreModelOnboardform document
export interface ICoreModelOnboardform extends Document {
  // Step tracking
  step: number;
  
  // Page 1: Personal Information
  id_type: number; // 1 - Malaysian IC, 2 - Passport Number
  id_number: string;
  display_name: string;
  gender: string;
  dob: string;
  mob_code: string;
  mob_number: string;
  nationality: number;
  race: string;
  curr_country: string;
  state: string;
  city: string;
  postalcode: string;
  disability_status: number; // 0 - No, 1 - Yes
  disability_code: string | null;
  talent_status: string;
  profile_picture?: string;
  
  // Employment Information
  curr_employer: string | null;
  sector: string | null;
  dur_year: string | null;
  dur_month: string | null;
  position: string | null;
  salary: string | null;
  
  // Education Information
  high_qualification: string | null;
  insti_country_status: number;
  insti_name: string;
  insti_country: string | null;
  scope: string;
  grade_status: string;
  grade: string;
  english_tests: string;
  english_score: string | number;
  
  // Program Information
  curr_tc_program: number;
  programmee: string | null;
  last_employer: string | null;
  scholar_status: number;
  scholar_data: string;
  curr_qualification: string;
  insti_location_status: number;
  university: string | null;
  univ_enroll_date: string;
  exp_graduate_date: string;
  curr_study_year: string;
  campus: string;
  faculty: string;
  study_program: string | null;
  
  // Internship Information
  intern_dur_year: string | null;
  intern_dur_month: string | null;
  intern_position: string | null;
  intern_allowance: string | null;
  
  // Organization and Profile Settings
  is_active: number;
  organization_id: string | null;
  profile_views: number;
  department: string;
  is_ios_registeration: number;
  is_registered_employee: number;
  is_invisible: string;
  
  // Military Service Information
  army_corp_regiment: string | null;
  army_id_number: string | null;
  army_is_active: string | null;
  army_last_rank: string | null;
  army_service: string | null;
  is_army: string | null;
  pension_status: string | null;
  perhebat_training_status: string | null;
  retirement_year: string | null;
  
  // Assessment Status
  is_assessment_done: number;
  is_career_explorer_done: number;
  is_employability_done: number;
  is_english_proficiency_done: number;
  is_future_of_work_done: number;
  is_personality_and_motivation_done: number;
  is_work_interests_done: number;
  is_work_values_done: number;
  is_learning_styles_done: boolean;
  
  // System fields
  entry_time: string;
  update_time: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Define the CoreModelOnboardform schema
const CoreModelOnboardformSchema: Schema = new Schema(
  {
    // Step tracking
    step: { type: Number, default: 1 },
    
    // Page 1: Personal Information
    id_type: { type: Number, required: true, enum: [1, 2] },
    id_number: { type: String, required: true, trim: true },
    display_name: { type: String, required: true, trim: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    mob_code: { type: String, trim: true },
    mob_number: { type: String, required: true, trim: true },
    nationality: { type: Number, required: true },
    race: { type: String, trim: true },
    curr_country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    postalcode: { type: String, trim: true },
    disability_status: { type: Number, default: 0, enum: [0, 1] },
    disability_code: { type: String, trim: true, default: null },
    talent_status: { type: String, trim: true },
    profile_picture: { type: String, trim: true },
    
    // Employment Information
    curr_employer: { type: String, default: null },
    sector: { type: String, default: null },
    dur_year: { type: String, default: null },
    dur_month: { type: String, default: null },
    position: { type: String, default: null },
    salary: { type: String, default: null },
    
    // Education Information
    high_qualification: { type: String, default: null },
    insti_country_status: { type: Number },
    insti_name: { type: String, trim: true },
    insti_country: { type: String, default: null },
    scope: { type: String, trim: true },
    grade_status: { type: String, trim: true },
    grade: { type: String, trim: true },
    english_tests: { type: String, trim: true },
    english_score: { type: Schema.Types.Mixed },
    
    // Program Information
    curr_tc_program: { type: Number },
    programmee: { type: String, default: null },
    last_employer: { type: String, default: null },
    scholar_status: { type: Number, default: 0 },
    scholar_data: { type: String },
    curr_qualification: { type: String },
    insti_location_status: { type: Number },
    university: { type: String, default: null },
    univ_enroll_date: { type: Date },
    exp_graduate_date: { type: Date },
    curr_study_year: { type: String },
    campus: { type: String },
    faculty: { type: String },
    study_program: { type: String, default: null },
    
    // Internship Information
    intern_dur_year: { type: String, default: null },
    intern_dur_month: { type: String, default: null },
    intern_position: { type: String, default: null },
    intern_allowance: { type: String, default: null },
    
    // Organization and Profile Settings
    is_active: { type: Number, default: 0 },
    organization_id: { type: String, default: null },
    profile_views: { type: Number, default: 0 },
    department: { type: String, default: 'Others' },
    is_ios_registeration: { type: Number, default: 0 },
    is_registered_employee: { type: Number, default: 0 },
    is_invisible: { type: String, default: 'Y' },
    
    // Military Service Information
    army_corp_regiment: { type: String, default: null },
    army_id_number: { type: String, default: null },
    army_is_active: { type: String, default: null },
    army_last_rank: { type: String, default: null },
    army_service: { type: String, default: null },
    is_army: { type: String, default: null },
    pension_status: { type: String, default: null },
    perhebat_training_status: { type: String, default: null },
    retirement_year: { type: String, default: null },
    
    // Assessment Status
    is_assessment_done: { type: Number, default: 0 },
    is_career_explorer_done: { type: Number, default: 0 },
    is_employability_done: { type: Number, default: 0 },
    is_english_proficiency_done: { type: Number, default: 0 },
    is_future_of_work_done: { type: Number, default: 0 },
    is_personality_and_motivation_done: { type: Number, default: 0 },
    is_work_interests_done: { type: Number, default: 0 },
    is_work_values_done: { type: Number, default: 0 },
    is_learning_styles_done: { type: Boolean, default: false },
    
    // System fields
    entry_time: { type: Date, default: Date.now },
    update_time: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    user_id: { type: Buffer }
  },
  { 
    collection: 'core_model_onboardform'
  }
);

// Initialize models
export const CoreModelUserProfile = mongoose.models.CoreModelUserProfile as Model<ICoreModelUserProfile> || 
  mongoose.model<ICoreModelUserProfile>('CoreModelUserProfile', CoreModelUserProfileSchema, 'core_user_profile');

export const CoreModelOnboardform = mongoose.models.CoreModelOnboardform as Model<ICoreModelOnboardform> || 
  mongoose.model<ICoreModelOnboardform>('CoreModelOnboardform', CoreModelOnboardformSchema, 'core_model_onboardform');
