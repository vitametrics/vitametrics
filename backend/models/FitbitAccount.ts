import mongoose, { Document, Schema } from 'mongoose';

export interface IFitbitAccount extends Document {
  userId: string;
  accessToken: string;
  refreshToken: string;
  lastTokenRefresh: Date;
  project_id: mongoose.Types.ObjectId;
}

const fitbitAccountSchema = new Schema(
  {
    userId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    lastTokenRefresh: { type: Date, required: true },
    project_id: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true }
);

const FitbitAccount = mongoose.model<IFitbitAccount>(
  'FitbitAccount',
  fitbitAccountSchema
);

export default FitbitAccount;
