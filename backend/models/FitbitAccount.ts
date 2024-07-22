import mongoose, { Document, Schema } from 'mongoose';

export interface IFitbitAccount extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  lastTokenRefresh: Date;
  project_id: mongoose.Types.ObjectId;
  isTemporaryUser: boolean;
  name?: string;
  email?: string;
  contactInfo?: string;
  idToken?: string;
}

const fitbitAccountSchema = new Schema(
  {
    userId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    lastTokenRefresh: { type: Date, required: true },
    project_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    isTemporaryUser: { type: Boolean, default: false },
    name: { type: String },
    email: { type: String },
    contactInfo: { type: String },
    idToken: { type: String },
  },
  { timestamps: true }
);

const FitbitAccount = mongoose.model<IFitbitAccount>(
  'FitbitAccount',
  fitbitAccountSchema
);

export default FitbitAccount;
