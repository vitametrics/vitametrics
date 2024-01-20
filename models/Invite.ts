import mongoose from 'mongoose';

const inviteCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    expirationDate: { type: Date, default: () => new Date(+new Date() + 30*24*60*60*1000) }, // 30 day expiry for invite codes
    usageCount: { type: Number, default: 0, required: true }, // check usage count for invite codes
    isActive: { type: Boolean, default: true }, // allow for revoking of invites
    email: { type: String, default: ''}
}, { timestamps: true });

const InviteCode = mongoose.model('inviteCodes', inviteCodeSchema);

export default InviteCode;