import mongoose, { Schema } from 'mongoose';

interface ICodeVerifier {
  value: string;
  projectId: string;
  userId: string;
  state: string;
  createdAt: Date;
}

const codeVerifierSchema = new Schema<ICodeVerifier>({
  value: { type: String, required: true },
  projectId: { type: String, required: true },
  userId: { type: String, required: true },
  state: { type: String, required: true },
  createdAt: { type: Date, expires: 600, default: Date.now },
});

const CodeVerifier = mongoose.model<ICodeVerifier>(
  'CodeVerifier',
  codeVerifierSchema
);

export default CodeVerifier;
