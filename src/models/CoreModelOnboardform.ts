import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface to define the CoreModelOnboardform document
export interface ICoreModelOnboardform extends Document {
  // Step tracking
  step: number;
  
  // Page 1: Personal Information
  id_type: number; // 1 - Malaysian IC, 2 - Passport Number
  id_number: string;
  display_name: string;
  gender: string; // 'F' - Female, 'M' - Male
  dob: Date;
  mob_code: string;
  mob_number: string;
  nationality: number;
  race: string;
  curr_country: string;
  state: string;
  city: string;
  postalcode: string;
  disability_status: number; // 0 - No, 1 - Yes
  disability_code: string;
  talent_status: string;
  
  // Page 2: Current Status
  scholar_status: string;
  scholar_data: string;
  curr_qualification: string;
  inst_name: string;
  university: string;
  campus: string;
  faculty: string;
  study_program: string;
  inst_country: string;
  scope: string;
  curr_study_year: string;
  grade_status: string;
  grade: string;
  english_tests: string;
  english_score: number;
  
  // System fields
  entry_time: Date;
  update_time: Date;
  created_at: Date;
  updated_at: Date;
  user_id: string;
}

// Define the CoreModelOnboardform schema
const CoreModelOnboardformSchema: Schema = new Schema(
  {
    // Step tracking
    step: { 
      type: Number,
      default: 1
    },
    
    // Page 1: Personal Information
    id_type: { 
      type: Number,
      required: true,
      enum: [1, 2] // 1 - Malaysian IC, 2 - Passport Number
    },
    id_number: { 
      type: String,
      required: true,
      trim: true
    },
    display_name: { 
      type: String,
      required: true,
      trim: true
    },
    gender: { 
      type: String,
      required: true,
      enum: ['F', 'M'] // F - Female, M - Male
    },
    dob: { 
      type: Date,
      required: true
    },
    mob_code: { 
      type: String,
      trim: true
    },
    mob_number: { 
      type: String,
      required: true,
      trim: true
    },
    nationality: { 
      type: Number,
      required: true
    },
    race: { 
      type: String,
      trim: true
    },
    curr_country: { 
      type: String,
      trim: true
    },
    state: { 
      type: String,
      trim: true
    },
    city: { 
      type: String,
      trim: true
    },
    postalcode: { 
      type: String,
      trim: true
    },
    disability_status: { 
      type: Number,
      default: 0,
      enum: [0, 1] // 0 - No, 1 - Yes
    },
    disability_code: { 
      type: String,
      trim: true
    },
    talent_status: { 
      type: String,
      trim: true
    },
    
    // Page 2: Current Status
    scholar_status: { 
      type: String,
      trim: true
    },
    scholar_data: { 
      type: String,
      trim: true
    },
    curr_qualification: { 
      type: String,
      trim: true
    },
    inst_name: { 
      type: String,
      trim: true
    },
    university: { 
      type: String,
      trim: true
    },
    campus: { 
      type: String,
      trim: true
    },
    faculty: { 
      type: String,
      trim: true
    },
    study_program: { 
      type: String,
      trim: true
    },
    inst_country: { 
      type: String,
      trim: true
    },
    scope: { 
      type: String,
      trim: true
    },
    curr_study_year: { 
      type: String,
      trim: true
    },
    grade_status: { 
      type: String,
      trim: true
    },
    grade: { 
      type: String,
      trim: true
    },
    english_tests: { 
      type: String,
      trim: true
    },
    english_score: { 
      type: Number
    },
    
    // System fields
    entry_time: { 
      type: Date,
      default: Date.now
    },
    update_time: { 
      type: Date,
      default: Date.now
    },
    created_at: { 
      type: Date,
      default: Date.now
    },
    updated_at: { 
      type: Date,
      default: Date.now
    },
    user_id: { 
      type: String,
      trim: true
    }
  },
  { 
    timestamps: true
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const CoreModelOnboardform: Model<ICoreModelOnboardform> = 
  mongoose.models.CoreModelOnboardform as Model<ICoreModelOnboardform> || 
  mongoose.model<ICoreModelOnboardform>('CoreModelOnboardform', CoreModelOnboardformSchema);

export default CoreModelOnboardform;
