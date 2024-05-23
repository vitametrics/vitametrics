import mongoose, { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
  userId: string;
  email: string;
  name: string;
  password: string;
  role: string;
  isTempUser: boolean;
  emailVerfToken: string;
  emailVerified: boolean;
  setPasswordToken: string | null;
  passwordTokenExpiry: Date | null;
  projects: Types.ObjectId[];
  fitbitUserId: string | null;
  fitbitAccessToken: string | null;
  fitbitRefreshToken: string | null;
  lastTokenRefresh: Date | null;
}

const userSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true },
    name: String,
    password: String,
    role: { type: String, default: 'user' },
    isTempUser: { type: Boolean, default: false },
    emailVerfToken: String,
    emailVerified: { type: Boolean, default: false },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects' }],
    setPasswordToken: String,
    passwordTokenExpiry: Date,
    fitbitUserId: { type: String, default: null },
    fitbitAccessToken: { type: String, default: null },
    fitbitRefreshToken: { type: String, default: null },
    lastTokenRefresh: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual('projectDetails', {
  ref: 'Projects',
  localField: 'projects',
  foreignField: '_id',
});

const User = model<IUser>('User', userSchema);

export default User;
