import mongoose from 'mongoose';

export interface IDevice extends Document {
    deviceId: string;
    deviceType: string;
    userFullName: string;
    lastSyncDate: Date;
};

const devicesSchema = new mongoose.Schema({
    deviceId: String,
    deviceType: String,
    heartRateData: [{ date: Date, value: Number }],
    sleepData: [{ date: Date, duration: Number, quality: String }],
    nutritionData: [{ date: Date, value: Number }],
    lastSyncDate: [{date: Date}]
});

const deviceSchema = mongoose.model('devices', devicesSchema);


export default deviceSchema;