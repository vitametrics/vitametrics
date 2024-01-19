import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

interface IAdminToken extends Document {
    tokenHash: string;
    compareToken: (token: string) => Promise<boolean>;
}

const adminTokenSchema = new mongoose.Schema({
    tokenHash: {type: String, required: true}
});

adminTokenSchema.methods.compareToken = async function (this: IAdminToken, token: string): Promise<boolean> {
    return bcrypt.compare(token, this.tokenHash);
};

const AdminToken = mongoose.model<IAdminToken>('AdminToken', adminTokenSchema);

export default AdminToken;