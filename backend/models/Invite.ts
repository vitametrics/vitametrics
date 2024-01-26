import mongoose from 'mongoose';

export interface IInvite extends Document {
    code: string;
    usageCount: string;
    maxUses: string;
    isActive: string;
    orgId: string;
}

const inviteCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    usageCount: { type: Number, default: 0, required: true }, // check usage count for invite codes
    maxUses: { type: Number, default: 10, required: true},
    isActive: { type: Boolean, default: true }, // allow for revoking of invites
    orgId: { type: String, required: true}
}, { timestamps: true });

const InviteCode = mongoose.model('inviteCodes', inviteCodeSchema);

export default InviteCode;