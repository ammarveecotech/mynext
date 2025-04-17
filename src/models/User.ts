import mongoose, { Schema, Document, Model } from 'mongoose';

// Interface to define the User document
export interface IUser extends Document {
  identificationType: 'malaysianIC' | 'passportNumber';
  identificationNumber: string;
  fullName: string;
  displayName?: string;
  gender: 'male' | 'female';
  dateOfBirth: Date;
  phoneNumber: string;
  email: string;
  nationality: 'malaysian' | 'nonMalaysian';
  race?: string;
  country?: string;
  state?: string;
  city?: string;
  postcode?: string;
  isOKU: boolean;
  
  // Current status fields
  scholarshipType?: 'scholarshipLoan' | 'selfFunded'; 
  academicQualification?: string;
  institutionType?: 'malaysiaOrExchange' | 'abroad';
  studyScope?: string;
  enrollmentDate?: Date;
  expectedGraduationDate?: Date;
  currentYear?: string;
  gradeType?: 'cgpa' | 'grade' | 'others' | 'noGrade';
  gradeValue?: string;
  englishTest?: 'muet' | 'cefr' | 'toefl' | 'ielts' | 'none' | 'other';
  
  // Preferences
  interestedSectors?: string[];
  interestedRoles?: string[];
  preferredStates?: string[];
  
  // Profile picture
  profilePicture?: string;
  
  // Authentication (if using social auth)
  authProvider?: 'google' | 'apple';
  authProviderId?: string;
  
  // Timestamps are automatically added by mongoose
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the User schema
const UserSchema: Schema = new Schema(
  {
    // Personal Information
    identificationType: { 
      type: String, 
      enum: ['malaysianIC', 'passportNumber'],
      required: true 
    },
    identificationNumber: { 
      type: String, 
      required: true,
      unique: true,
      trim: true 
    },
    fullName: { 
      type: String, 
      required: true,
      trim: true 
    },
    displayName: { 
      type: String, 
      trim: true 
    },
    gender: { 
      type: String, 
      enum: ['male', 'female'],
      required: true 
    },
    dateOfBirth: { 
      type: Date, 
      required: true 
    },
    phoneNumber: { 
      type: String,
      required: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      trim: true,
      lowercase: true 
    },
    nationality: { 
      type: String, 
      enum: ['malaysian', 'nonMalaysian'],
      required: true 
    },
    race: { 
      type: String, 
      trim: true 
    },
    country: { 
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
    postcode: { 
      type: String, 
      trim: true 
    },
    isOKU: { 
      type: Boolean, 
      default: false 
    },

    // Current Status
    scholarshipType: { 
      type: String, 
      enum: ['scholarshipLoan', 'selfFunded'] 
    },
    academicQualification: { 
      type: String 
    },
    institutionType: { 
      type: String, 
      enum: ['malaysiaOrExchange', 'abroad'] 
    },
    studyScope: { 
      type: String 
    },
    enrollmentDate: { 
      type: Date 
    },
    expectedGraduationDate: { 
      type: Date 
    },
    currentYear: { 
      type: String 
    },
    gradeType: { 
      type: String, 
      enum: ['cgpa', 'grade', 'others', 'noGrade'] 
    },
    gradeValue: { 
      type: String 
    },
    englishTest: { 
      type: String, 
      enum: ['muet', 'cefr', 'toefl', 'ielts', 'none', 'other'] 
    },

    // Preferences
    interestedSectors: [{ 
      type: String 
    }],
    interestedRoles: [{ 
      type: String 
    }],
    preferredStates: [{ 
      type: String 
    }],

    // Profile Picture
    profilePicture: { 
      type: String 
    },

    // Authentication
    authProvider: { 
      type: String, 
      enum: ['google', 'apple'] 
    },
    authProviderId: { 
      type: String 
    }
  },
  { 
    timestamps: true 
  }
);

// Check if the model is already defined to prevent overwriting during hot reloads
const User: Model<IUser> = mongoose.models.User as Model<IUser> || 
  mongoose.model<IUser>('User', UserSchema);

export default User; 