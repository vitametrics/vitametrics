import argon2 from 'argon2';
import mongoose, { Document, Schema, Types, model } from 'mongoose';

export interface IUser extends Document {
    userId: string;
    email: string;
    name: string;
    password: string;
    role: string;
    emailVerfToken: string;
    emailVerified: boolean;
    setPasswordToken: string | null;
    passwordTokenExpiry: Date | null;
    projects: Types.ObjectId[];
};

const userSchema = new Schema({
    userId: { type: String, required: true, index: true},
    email: { type: String, required: true, unique: true, index: true},
    name: String,
    password: String,
    role: { type: String, default: "user"},
    emailVerfToken: String,
    emailVerified: { type: Boolean, default: false},
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Projects'}],
    setPasswordToken: String,
    passwordTokenExpiry: Date
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true }});

userSchema.virtual('projectDetails', {
    ref: 'Projects',
    localField: 'projects',
    foreignField: '_id'
});

const User = model<IUser>('User', userSchema);

export default User;